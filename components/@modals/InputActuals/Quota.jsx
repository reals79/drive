import React from 'react'
import { OverlayTrigger } from 'react-bootstrap'
import moment from 'moment'
import { Animations, Avatar, Button, CheckBox, Icon, Input, QuotaTooltip, Rating, RatingTooltip } from '@components'
import classNames from 'classnames'
import { avatarBackgroundColor, getUnit, quotaCalc } from '~/services/util'
import './InputActuals.scss'

class Quota extends React.Component {
  state = { hovered: false, opened: false, message: '' }

  handleClose = () => {
    this.setState({ hovered: false, opened: false })
  }

  handleMouseOver = () => {
    const { opened } = this.state
    if (!opened) this.setState({ hovered: true, opened: false })
  }

  handleMouseLeave = () => {
    const { opened } = this.state
    if (!opened) this.handleClose()
  }

  handleMouseClick = () => {
    this.setState({ hovered: false, opened: true })
  }

  handleSubmit = () => {
    const { message } = this.state
    if (message) {
      this.props.onComment(message)
      this.setState({ message: '', hovered: false, opened: false })
    }
  }

  render() {
    const { avatar, data, name, userId, value, isProgram, onChange, onCheck } = this.props
    const { message, opened, hovered } = this.state
    const visible = opened || (value.data && value.data.comments.length && hovered)
    if (!data) return null

    const target = data.data.star_values ? data.data.star_values[5] : data.data.quota_target
    const rating = value.actual ? quotaCalc(data, value.actual) : 0

    return (
      <div className="d-flex py-4 border-bottom flex-column flex-md-row d-flex-12 lh-100">
        <div className="d-flex d-flex-4">
          <div className="quota-check d-h-end">
            <CheckBox
              className="quota-checkbox"
              size="tiny"
              id={`qt${data.id}`}
              checked={value.checked}
              onChange={onCheck}
            />
          </div>
          <div className="d-flex-5 ml-2 d-flex justify-content-start align-items-center">
            <OverlayTrigger placement="top" overlay={QuotaTooltip(data.data.description, data.name)}>
              <span className="dsl-b14 bold">{data.name}</span>
            </OverlayTrigger>
          </div>
        </div>
        <div className="d-flex d-flex-5 ml-5 ml-md-3">
          <div className={classNames('d-flex-1 d-h-end flex-column flex-md-row pb-1 pb-md-0', isProgram && 'd-flex-2')}>
            <p className="dsl-m12 text-400 d-block d-md-none">Target</p>
            <span className="dsl-b14 text-400 ml-1 ml-md-0">{getUnit(target, data.data.target_types)}</span>
          </div>
          <div className="d-h-end d-flex-2 justify-content-center flex-column flex-md-row ml-2 ml-md-0">
            <p className="dsl-m12 text-400 d-block d-md-none mt-3">Actual</p>
            <Input
              type={value.checked ? 'number' : 'text'}
              value={value.checked ? (value.actual == '0' ? '0' : Number(value.actual)) : 'NA'}
              disabled={!value.checked}
              onChange={onChange}
            />
          </div>
          {!isProgram && (
            <OverlayTrigger placement="top" overlay={RatingTooltip(data)}>
              <div className="d-flex-4 d-h-start flex-column flex-md-row mr-4 mr-md-0">
                <p className="dsl-m12 text-400 d-block d-md-none mr-5 mr-md-0">Rating</p>
                {value.checked ? (
                  <>
                    {value.actual ? (
                      <Rating className="ml-2 ml-md-3" score={rating} />
                    ) : (
                      <span className="dsl-b14 text-400 mr-4 ml-md-3 text-400">Incomplete</span>
                    )}
                  </>
                ) : (
                  <span className="dsl-b14 text-400 mr-4 ml-md-3 text-400">NA</span>
                )}
              </div>
            </OverlayTrigger>
          )}
        </div>
        <div className="quota-comment mx-3">
          <Icon
            name="fas fa-comment cursor-pointer"
            active={value.data && value.data.comments.length}
            size={14}
            colors={['#376caf', '#dee2e6']}
            onClick={this.handleMouseClick}
            onMouseEnter={this.handleMouseOver}
            onMouseLeave={this.handleMouseLeave}
          />
          <Animations.Popup
            className={classNames('comment-popup', hovered && 'cmt')}
            enter={10}
            exit={0}
            opened={visible}
          >
            <div className="d-flex justify-content-between">
              <div>
                {hovered &&
                  value.data &&
                  value.data.comments.map((item, index) => (
                    <div key={`h${index}`} onClick={() => this.setState({ opened: true, hovered: false })}>
                      <p className="dsl-m10 mb-1">By {item.name}</p>
                      <p className="dsl-b12 mb-2">{item.comment}</p>
                    </div>
                  ))}
              </div>
              <div className="d-h-end mb-2 pb-2">
                <Icon name="fal fa-times cursor-pointer" color="black" size={14} onClick={this.handleClose} />
              </div>
            </div>
            {opened && (
              <>
                {value.data &&
                  value.data.comments.map((item, index) => (
                    <div
                      key={`c${index}`}
                      className="d-flex cursor-pointer mb-3 align-items-center"
                      onClick={() => this.setState({ opened: true, hovered: false })}
                    >
                      <Avatar
                        className="comment-avatar"
                        url={`${item.avatar}?${Date.now()}`}
                        name={name}
                        backgroundColor={avatarBackgroundColor(item.user_id)}
                      />
                      <div className="d-flex-1 ml-2">
                        <p className="dsl-m10 mb-1 text-400">
                          {moment
                            .utc(item.created_at)
                            .local()
                            .format('MMM DD [AT] hh:mm A z')}
                        </p>
                        <p className="dsl-b12 mb-0 text-400">{item.comment}</p>
                      </div>
                    </div>
                  ))}
                <div className="d-flex mb-2">
                  <Avatar
                    url={`${avatar}?${Date.now()}`}
                    name={name}
                    type="logo"
                    backgroundColor={avatarBackgroundColor(userId)}
                  />
                  <div className="d-flex-1 ml-2">
                    <Input
                      className="text-left"
                      placeholder="Type here..."
                      value={message}
                      onChange={e => this.setState({ message: e })}
                    />
                  </div>
                </div>
                <div className="d-h-end">
                  <Button type="link" name="SAVE" onClick={this.handleSubmit} />
                </div>
              </>
            )}
          </Animations.Popup>
        </div>
      </div>
    )
  }
}

export default Quota
