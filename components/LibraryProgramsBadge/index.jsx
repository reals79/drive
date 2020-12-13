import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { equals, isNil, keys, values, isEmpty } from 'ramda'
import {
  Accordion,
  Button,
  Dropdown,
  Icon,
  Input,
  LibraryProgramsList as ProgramsList,
  Upload,
  Thumbnail,
} from '@components'
import { LibraryExpires, LibraryLevels } from '~/services/config'
import './LibraryProgramsBadge.scss'

class List extends React.PureComponent {
  handleToggle = e => () => {
    this.props.onToggle(e)
  }

  handleMenuChange = career => e => {
    const selectedMenu = e[0].value
    if (equals(selectedMenu, 'Assign')) {
      this.props.onModal({
        type: 'Assign Program',
        data: { before: { modules: [] }, after: [career] },
        callBack: null,
      })
    } else if (equals(selectedMenu, 'Detail View')) {
      this.props.onToggle(career.id)
    } else {
      this.props.onToggle(null)
    }
  }

  render() {
    const { data, isAdmin } = this.props

    return (
      <>
        {data.map((item, index) => (
          <ProgramsList.ClosedList
            key={`${item.id}-${index}`}
            isAdmin={isAdmin}
            name={item.title}
            description={item.data.description}
            type="badges"
            onToggle={this.handleToggle(item.id)}
            onChange={this.handleMenuChange(item)}
          />
        ))}
      </>
    )
  }
}

List.propTypes = {
  isAdmin: PropTypes.bool,
  data: PropTypes.array,
  onToggle: PropTypes.func,
  onModal: PropTypes.func,
}

List.defaultProps = {
  isAdmin: false,
  data: [],
  onToggle: () => {},
  onModal: () => {},
}

class Detail extends React.PureComponent {
  constructor(props) {
    super(props)

    const isLevel = !isNil(props.data.data.levels) && !isEmpty(props.data.data.levels)
    const levels = isLevel
      ? keys(props.data.data.levels).map((key, index) => {
          return { id: index + 1, value: `Level ${key}` }
        })
      : []

    this.state = {
      levels,
      levelData: isLevel ? values(props.data.data.levels) : [],
      curLevel: 0,
    }

    this.handleLink = this.handleLink.bind(this)
  }

  handleLink(link) {
    if (!isNil(link) && !isEmpty(link)) {
      const win = window.open(link, '_blank')
      win.focus()
    }
  }

  render() {
    const { admin, data } = this.props
    const { levels, levelData, curLevel } = this.state
    const badgeIcon =
      !isNil(levelData[curLevel].icon_url) && !isEmpty(levelData[curLevel].icon_url)
        ? levelData[curLevel].icon_url
        : 'fal fa-badge-check'

    return (
      <div className="lib-programs-badge">
        <div className="d-flex py-2">
          <p className="dsl-b22 bold">{data.title}</p>
          <div className="d-flex-1" />
          <Icon name="far fa-ellipsis-h" size={14} color="#c3c7cc" />
        </div>
        <div className="">
          <p className="dsl-m12 mb-2">Description</p>
          <p className="dsl-b16 p-2">{data.data.description || data.description}</p>
        </div>
        <Accordion className="settings-badge">
          <Row className="mx-0">
            <Col xs={6} className="px-0">
              <Dropdown
                title="Levels"
                direction="vertical"
                data={levels}
                defaultIndexes={[curLevel]}
                width="fit-content"
              />
            </Col>
            <Col xs={6} className="px-0">
              {admin ? (
                <Dropdown
                  title="Expiration"
                  direction="vertical"
                  data={LibraryExpires}
                  defaultIndexes={[levelData[curLevel].valid_months]}
                  width="fit-content"
                />
              ) : (
                <p className="dsl-b14 mb-0 px-2" />
              )}
            </Col>
          </Row>
          <Row className="mx-0 my-4">
            <Col xs={6} className="px-0">
              <p className="dsl-m12 mb-3">Upload icon</p>
              <Thumbnail src={badgeIcon} className="badge-thumbnail" />
              {admin && (
                <Upload
                  icon=""
                  type="link"
                  title="UPLOAD"
                  size={14}
                  color="#376caf"
                  className="my-3"
                />
              )}
            </Col>
            <Col xs={6} className="px-0">
              <p className="dsl-m12 mb-3">Upload certificate</p>
              <Thumbnail
                src="fal fa-file-certificate"
                className="badge-thumbnail"
                onClick={this.handleLink.bind(this, levelData[curLevel].certificate_pdf)}
              />
              {admin && (
                <Upload
                  icon=""
                  type="link"
                  title="UPLOAD"
                  size={14}
                  color="#376caf"
                  className="my-3"
                />
              )}
            </Col>
          </Row>
        </Accordion>
      </div>
    )
  }
}

Detail.propTypes = {
  admin: PropTypes.bool,
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    data: PropTypes.any,
  }),
}

Detail.defaultProps = {
  admin: false,
  data: {
    id: 0,
    title: '',
    data: {},
  },
}

class Add extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      description: '',
      level: null,
      expiration: null,
      certificateLink: '',
      iconLink: '',
    }

    this.handleSave = this.handleSave.bind(this)
  }

  handleSave(published) {
    const { title, description, level, expiration, certificateLink, iconLink } = this.state

    let levels = {}
    for (let i = 0; i < level; i++) {
      levels[i + 1] = {
        certificate_pdf: certificateLink,
        icon_url: iconLink,
        valid_months: expiration,
      }
    }

    const program = {
      author_id: 1,
      company_id: 5,
      user_id: null,
      status: 0,
      designation: 1,
      title,
      description,
      level,
      data: {
        levels,
      },
      type: 3,
      published,
    }

    const payload = {
      type: 'badges',
      data: {
        program,
      },
    }
    this.props.onSave(payload)
  }

  render() {
    const { title, description, level } = this.state
    const disabled = isEmpty(title) || isNil(level)

    return (
      <div className="lib-programs-badge">
        <div className="d-flex py-2">
          <p className="dsl-b22 bold">Add Badge</p>
          <div className="d-flex-1" />
          <Icon name="far fa-ellipsis-h" size={14} color="#c3c7cc" />
        </div>
        <div className="">
          <Input
            className="input-field"
            title="Title"
            value={title}
            direction="vertical"
            placeholder="Title your badge..."
            onChange={title => this.setState({ title })}
          />
          <Input
            className="input-field"
            as="textarea"
            rows="2"
            title="Description"
            value={description}
            direction="vertical"
            placeholder="Type here..."
            onChange={description => this.setState({ description })}
          />
        </div>
        <Accordion className="settings-badge">
          <Row className="mx-0">
            <Col xs={6} className="px-0">
              <Dropdown
                title="Levels"
                direction="vertical"
                data={LibraryLevels}
                width="fit-content"
                height={250}
                onChange={e => this.setState({ level: e[0] })}
              />
            </Col>
            <Col xs={6} className="px-0">
              <Dropdown
                title="Expiration"
                direction="vertical"
                data={LibraryExpires}
                defaultIndexes={[0]}
                width="fit-content"
                height={250}
                onChange={e => this.setState({ expiration: e[0] })}
              />
            </Col>
          </Row>
          <Row className="mx-0 my-4">
            <Col xs={6} className="px-0">
              <p className="dsl-m12 mb-3">Upload icon</p>
              <Thumbnail src="fal fa-badge-check" className="badge-thumbnail" />
              <Upload
                icon=""
                type="link"
                title="UPLOAD"
                size={14}
                color="#376caf"
                className="my-3"
              />
            </Col>
            <Col xs={6} className="px-0">
              <p className="dsl-m12 mb-3">Upload certificate</p>
              <Thumbnail src="fal fa-file-certificate" className="badge-thumbnail" />
              <Upload
                icon=""
                type="link"
                title="UPLOAD"
                size={14}
                color="#376caf"
                className="my-3"
              />
            </Col>
          </Row>
        </Accordion>
        <div className="d-flex justify-content-end">
          <Button
            name="Save Draft"
            className="btn-save mr-3"
            disabled={disabled}
            onClick={this.handleSave.bind(this, 0)}
          />
          <Button
            name="Save & Publish"
            className="btn-save"
            disabled={disabled}
            onClick={this.handleSave.bind(this, 1)}
          />
        </div>
      </div>
    )
  }
}

Add.propTypes = {
  onSave: PropTypes.func,
}

Add.defaultProps = {
  onSave: () => {},
}

export { List, Detail, Add }
