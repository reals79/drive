import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { equals, find, propEq, isNil, toLower } from 'ramda'
import { Accordion, Dropdown, EditDropdown, Filter, Toggle } from '@components'
import { LibraryToDoQuotaDetailMenu, QuotaType, QuotaSource } from '~/services/config'

function Detail(props) {
  const { editable, authors, departments, competencies, categories, history, data, userRole, onSelect } = props

  const departmentIds = data.data.department || []
  const competencyIds = data.data.competency || []
  const categoryIds = data.data.category || []

  const type = find(propEq('name', data.data.target_types))(QuotaType)
  const source = find(propEq('name', data.data.source))(QuotaSource)
  const target_types = type ? type.id : 0
  const sourceId = source ? source.id : 0
  const track = isNil(data.data.track_daily) ? false : equals(toLower(data.data.track_daily), 'yes')

  return (
    <>
      <Filter dataCy="quotaFilter" aligns={['left', 'right']} backTitle="all quotas" onBack={() => history.goBack()} />
      <div className="lib-todo-quota" data-cy="quota-detail">
        <div className="quota-detail">
          <div className="d-flex justify-content-between py-2" data-cy="quota-name">
            <p className="dsl-b22 bold">{data.name}</p>
            {userRole < 3 && (
              <EditDropdown dataCy="editDropdown" options={LibraryToDoQuotaDetailMenu[userRole]} onChange={onSelect} />
            )}
          </div>
          <div className="" data-cy="quotaDescription">
            <p className="dsl-m12 mb-2">Quota description</p>
            <p className="dsl-b16 p-2">{data.data.description || data.description}</p>
          </div>
          <Accordion className="settings-quota" expanded={false}>
            <Row className="mx-0">
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Type"
                  dataCy="quotaType"
                  direction="vertical"
                  width="fit-content"
                  data={QuotaType}
                  defaultIds={[target_types]}
                  disabled={!editable}
                  getValue={e => e.name}
                  returnBy="data"
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Source"
                  dataCy="source"
                  direction="vertical"
                  width="fit-content"
                  data={QuotaSource}
                  defaultIds={[sourceId]}
                  disabled={!editable}
                  getValue={e => e.name}
                  returnBy="data"
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  title="Author"
                  dataCy="author"
                  direction="vertical"
                  width="fit-content"
                  data={authors}
                  defaultIds={[data.author_id]}
                  disabled={!editable}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Departments"
                  dataCy="department"
                  direction="vertical"
                  width="fit-content"
                  defaultIds={departmentIds}
                  data={departments}
                  disabled={!editable}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Competencies"
                  dataCy="competencies"
                  direction="vertical"
                  width="fit-content"
                  defaultIds={competencyIds}
                  data={competencies}
                  disabled={!editable}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Dropdown
                  multi
                  title="Categories"
                  dataCy="categories"
                  direction="vertical"
                  width="fit-content"
                  data={categories}
                  defaultIds={categoryIds}
                  disabled={!editable}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="px-0 my-3">
                <Toggle
                  checked={track}
                  title="Track Daily"
                  dataCy="trackDaily"
                  leftLabel="Off"
                  rightLabel="On"
                  disabled
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
  data: PropTypes.any,
  userRole: PropTypes.number,
  editable: PropTypes.bool,
}

Detail.defaultProps = {
  data: {},
  userRole: 1,
  editable: false,
}

export default memo(Detail)
