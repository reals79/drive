import React from 'react'
import { connect } from 'react-redux'
import ReactQuill from 'react-quill'
import moment from 'moment'
import classNames from 'classnames'
import { Picker, Emoji } from 'emoji-mart'
import { find, isEmpty } from 'ramda'
import { Avatar, Button, Icon } from '@components'
import AppActions from '~/actions/app'
import CommunityActions from '~/actions/community'
import CommunityHeader from '~/views/Dashboard/Community/Header'
import TopicList from '~/views/Dashboard/Community/Forums/TopicList'
import { history } from '~/reducers'
import { avatarBackgroundColor } from '~/services/util'
import './Forums.scss'

let icon = ReactQuill.Quill.import('ui/icons')
icon['image'] = '<i class="fal fa-paperclip text-primary dsl-p15" aria-hidden="true"/>'

class IndividualTopic extends React.Component {
  state = {
    topicId: this.props.match.params.topicId,
    departId: this.props.match.params.departId,
    file: null,
    preview: null,
    comment: null,
    openEmoji: false,
  }

  componentDidMount() {
    const { topicId, departId } = this.state
    this.props.getTopic({ id: topicId })
    this.props.getTopics({ category_id: departId, order: 'recent', page: 1, per_page: 10 })
  }

  handleEmojiInput = e => {
    const comment = this.state.comment + e.native
    this.setState({ comment })
  }

  handleCommentForm = () => {
    const { token } = this.props
    const { comment, topicId } = this.state
    const route = history.location.pathname
    const payload = { comment: { parent_id: topicId, data: { body: comment } } }

    if (comment) {
      if (token) {
        this.props.addComment(payload)
      } else {
        this.props.toggleModal({
          type: 'Authentication',
          data: { before: { route, after: { type: 'ADDTOPICCOMMENT_REQUEST', payload } } },
          callBack: null,
        })
      }
    }
    this.setState({ comment: '', preview: null, openEmoji: false })
  }

  handleComposer = e => {
    this.setState({ comment: e })
  }

  handleOpenProfile = e => {
    const { userId } = this.props
    const payload = {
      userId: e.id,
      type: userId === e.id ? 'me' : 'others',
      route: `/community/profile/about?user_id=${e.id}`,
    }
    this.props.getUser(payload)
  }

  render() {
    const { data, history, topics, departments, name, avatar, userId } = this.props
    const { openEmoji, comment, departId } = this.state
    const department = find(e => e.id === departId, departments)
    const relatedTopics = topics[departId]
    const topic = data?.topics?.data[0]
    const topicComment = topic?.comments?.length > 0 && topic?.comments[0]

    return (
      <div className="community-forum">
        <CommunityHeader
          activeRoute="Forums"
          childRoute={topic?.name}
          backTitle="to all forums"
          onBack={() => history.goBack()}
        />
        {topic && (
          <div className="popular-forum-category p-3">
            <div className="d-flex p-1 mb-3 align-center w-100">
              <div className="justify-content-between">
                <div className="avatar-section">
                  <Avatar
                    type="initial"
                    url={topicComment?.author_avatar}
                    name={`${topicComment.user.first_name} ${topicComment.user.last_name}`}
                    onToggle={() => this.handleOpenProfile(topicComment?.user)}
                  />
                </div>
              </div>
              <div className="d-flex pl-2 w-100">
                <div className="d-flex-10  d-flex flex-column">
                  <span className="dsl-m12 text-400 mb-1">
                    {topicComment?.user?.first_name}&nbsp;{topicComment?.user?.last_name}
                  </span>
                  <span className="dsl-m12 text-400">{topicComment?.user?.profile?.job_title}</span>
                </div>
                <div className="d-flex-2 dsl-m12 text-400 text-right">{department?.name || ''}</div>
              </div>
            </div>
            <div className="dsl-b18 bold mt-3 mb-3">{topic?.name}</div>
            <div className="dsl-b16 mb-2 lh-22" dangerouslySetInnerHTML={{ __html: topicComment?.data?.body }} />
            <div className="d-flex pt-3 pb-1">
              <Icon name="far fa-eye mr-2 text-500" size={12} color="#969faa" />
              <span className="dsl-d14 mr-4 text-400">{topic.stats?.views || 0}</span>
              <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#969faa" />
              <span className="dsl-d14 mr-4 text-400">{topic.stats?.likes || 0}</span>
              <Icon name="far fa-comment mr-2 text-500" size={12} color="#969faa" />
              <span className="dsl-d14 text-400 mr-2">{topic.stats?.comments || 0}</span>
            </div>
          </div>
        )}

        <div className="popular-forum-category mt-3 p-3">
          <div className="dsl-b18 bold mt-3 mb-2">Comments</div>
          <div className="d-flex p-1 pb-3 mt-3 align-center w-100">
            <div className="justify-content-between">
              <div className="avatar-section">
                <Avatar
                  url={topicComment?.author_avatar}
                  name={`${topicComment?.user?.first_name} ${topicComment?.user?.last_name}`}
                  type="initial"
                  backgroundColor="#4F4487"
                  onToggle={() => this.handleOpenProfile(topicComment?.user)}
                />
              </div>
            </div>
            <div className="w-100 pl-2">
              <div className="d-flex flex-column">
                <span className="dsl-m12 text-400 mb-1">
                  {`${topicComment?.user?.first_name} ${topicComment?.user?.last_name}`}
                </span>
                <span className="dsl-m12 text-400">{topicComment?.user?.profile?.job_title}</span>
                <span className="dsl-m16 mt-2 mr-3" dangerouslySetInnerHTML={{ __html: topicComment?.data?.body }} />
              </div>
              <div className="d-flex mt-2 mr-3">
                <Icon name="fas fa-reply mr-2 text-700" size={12} color="#000" />
                <span className="dsl-b14 mr-4 text-400">Reply</span>
                <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#000" />
                <span className="dsl-b14 mr-4 text-400">{topic.stats?.likes || 0}</span>
                <Icon name="far fa-comment mr-2 text-500" size={12} color="#000" />
                <span className="dsl-b14 text-400">{topic.stats?.comments || 0}</span>
              </div>
            </div>
          </div>
          <div className="comment-border">
            <div className={classNames(topic?.comments?.length > 4 && 'forum-wrapper mt-2')}>
              {topic?.comments?.map(item => {
                const { id, author_avatar, created_at, data, stats, user } = item
                return (
                  <div className="d-flex p-1 mt-3 align-center w-100">
                    <div className="d-flex p-1 align-center w-100" key={`topic-${id}`}>
                      <div className="justify-content-between">
                        <div className="avatar-section">
                          <Avatar
                            type="initial"
                            url={author_avatar}
                            name={`${user?.first_name} ${user?.last_name}`}
                            backgroundColor="#4F4487"
                            onToggle={() => this.handleOpenProfile(user)}
                          />
                        </div>
                      </div>
                      <div className="w-100 pl-2">
                        <div className="d-flex w-100">
                          <div className="d-flex flex-column w-100 mt-1">
                            <div className="d-flex w-100 justify-content-between">
                              <div className="dsl-m12 text-400 mb-1">{`${user?.first_name} ${user?.last_name}`}</div>
                              <div className="d-flex dsl-m12 text-400 text-right">
                                <span className="dsl-m12 mr-2 mb-1 justify-content-end">
                                  {moment(created_at).format('MMM DD, YY')}
                                </span>
                                <Icon name="fas fa-reply text-700" size={12} color="#969faa" />
                              </div>
                            </div>
                            <span className="dsl-m12 text-400">{user?.profile?.job_title}</span>
                            <div className="dsl-m16 mt-2 mr-3" dangerouslySetInnerHTML={{ __html: data?.body }} />
                          </div>
                        </div>
                        <div className="d-flex mt-2 mr-3">
                          <Icon name="fas fa-reply mr-2 text-700" size={12} color="#000" />
                          <span className="dsl-b14 mr-4 text-400">Reply</span>
                          <Icon name="fal fa-thumbs-up mr-2 text-500" size={12} color="#000" />
                          <span className="dsl-b14 mr-4 text-400">{stats?.likes || 0}</span>
                          <Icon name="far fa-comment mr-2 text-500" size={12} color="#000" />
                          <span className="dsl-b14 text-400 mr-2">{stats?.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="input-comment">
            <div className="avatar-section">
              <Avatar
                url={`${avatar}?${Date.now()}`}
                name={name}
                type="logo"
                backgroundColor={avatarBackgroundColor(userId)}
              />
            </div>
            <div className="w-100">
              <ReactQuill
                className="w-80"
                placeholder="Type a comment"
                theme="snow"
                value={comment}
                ref={el => {
                  this.quill = el
                }}
                modules={{
                  toolbar: {
                    container: [['link', 'image']],
                  },
                }}
                onChange={this.handleComposer}
              />
            </div>
            <div className="attach-emoji">
              <Emoji
                emoji=":slightly_smiling_face:"
                size={20}
                onClick={() => this.setState({ openEmoji: !openEmoji })}
              />
            </div>
            <Button
              className="ml-2"
              type="medium"
              name="COMMENT"
              disabled={isEmpty(comment)}
              onClick={this.handleCommentForm}
            />
          </div>
        </div>

        <div className="emoji-container">
          {openEmoji && <Picker style={{ position: 'absolute' }} onSelect={this.handleEmojiInput} />}
        </div>

        <div className="popular-forum-category mt-3 p-3 d-flex justify-content-between">
          <div className="d-flex flex-column cursor-pointer">
            <div className="d-flex align-items-center pr-3">
              <Icon name="fal fa-less-than mr-2" size={12} color="#376caf" />
              <div className="dsl-p14 ml-2 text-400">PREV TOPIC</div>
            </div>
            <div className="dsl-m12 pt-3 pb-2 text-custom-wrap ml-3">This is a test blog</div>
          </div>
          <div className="d-flex justify-content-end flex-column cursor-pointer">
            <div className="d-flex align-items-center pr-3" onClick={() => {}}>
              <span className="dsl-p14 mr-2 text-400">NEXT TOPIC</span>
              <Icon name="fal fa-greater-than" size={12} color="#376caf" />
            </div>
            <div className="dsl-m12 pt-3 pb-2 text-custom-wrap">This is a test blog</div>
          </div>
        </div>

        <div className="popular-forum-category p-3 mt-3">
          <span className="dsl-b22 bold mb-4">Related Topics</span>
          <div className="main-wrapper">
            <TopicList data={relatedTopics?.topics?.data} displayMenu={true} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userId: state.app.id,
  token: state.app.token,
  name: state.app.first_name + ' ' + state.app.last_name,
  avatar: state.app.avatar,
  data: state.community.individualTopic,
  topics: state.community.topics,
  departments: state.company.blogCategories,
})

const mapDispatchToProps = dispatch => ({
  addComment: payload => dispatch(CommunityActions.addtopiccommentRequest(payload)),
  getTopics: e => dispatch(CommunityActions.gettopicsRequest(e)),
  getTopic: (e, route) => dispatch(CommunityActions.getforumindividualtopicRequest(e, route)),
  getUser: e => dispatch(CommunityActions.getcommunityuserRequest(e)),
  toggleModal: payload => dispatch(AppActions.modalRequest(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTopic)
