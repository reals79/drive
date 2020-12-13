import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { isNil, isEmpty } from 'ramda'
import { Filter, Accordion, Dropdown, EditDropdown } from '@components'
import { RecurringType, LibraryToDoHabitDetailMenu } from '~/services/config'

function Detail(props) {
  const {
    authors,
    departments,
    competencies,
    categories,
    history,
    data,
    userRole,
    onSelect,
  } = props

  if (isNil(data)) return null

  const departmentIds = data.data.department || []
  const competencyIds = data.data.competency || []
  const categoryIds = data.data.category || []
  const { schedule_interval } = data.data
  const schedule = schedule_interval || 'month'

  return (
    <>
      <Filter aligns={['left', 'right']} backTitle="all habits" onBack={() => history.goBack()} />
      <div className="lib-todo-habit">
        <div className="habit-detail">
          <div className="d-flex justify-content-between py-2">
            <p className="dsl-b22 bold">{data.name}</p>
            <EditDropdown options={LibraryToDoHabitDetailMenu[userRole]} onChange={onSelect} />
          </div>
          <div className="">
            <p className="dsl-m12 mb-2">Description</p>
            <p className="dsl-b16 p-2">{data.data.description || data.description}</p>
          </div>
          <div className="my-2">
            <p className="dsl-m12 mb-0">Frequency</p>
            <div className="p-2">
              <p className="dsl-b16 mb-0 text-400">{RecurringType[schedule].label}</p>
            </div>
          </div>

          <Accordion className="settings-habit" expanded={false}>
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Author"
                  direction="vertical"
                  width="fit-content"
                  disabled
                  getValue={e => e.name}
                  defaultIds={[data.author_id]}
                  data={authors}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Departments"
                  direction="vertical"
                  width="fit-content"
                  disabled
                  getValue={e => e.name}
                  defaultIds={departmentIds}
                  data={departments}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Competencies"
                  direction="vertical"
                  width="fit-content"
                  disabled
                  getValue={e => e.name}
                  defaultIds={competencyIds}
                  data={competencies}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Categories"
                  direction="vertical"
                  width="fit-content"
                  disabled
                  getValue={e => e.name}
                  defaultIds={categoryIds}
                  data={categories}
                />
              </Col>
            </Row>
          </Accordion>
        </div>
      </div>
    </>
  )
}

Detail.propTypes = {
  tags: PropTypes.array,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    data: PropTypes.any,
    author_id: PropTypes.number,
  }),
}

Detail.defaultProps = {
  tags: [],
  data: {
    id: 0,
    name: '',
    data: {},
    author_id: 0,
  },
}

export default memo(Detail)
