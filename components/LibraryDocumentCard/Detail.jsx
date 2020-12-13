import React, { memo } from 'react'
import moment from 'moment'
import { Row, Col } from 'react-bootstrap'
import { equals } from 'ramda'
import { Accordion, Button, Dropdown, Filter, Icon } from '@components'
import Document from './Document'
import './LibraryDocumentCard.scss'

function Detail(props) {
  const { type, document, authors, departments, competencies, categories, history } = props
  return (
    <>
      <Filter
        aligns={['left', 'right']}
        backTitle={`all ${type}s`}
        onBack={() => history.goBack()}
      />
      <div className="library-document-card border-5">
        <div className="detail-content">
          <div className="d-flex justify-content-between py-1">
            <p className="dsl-b22 bold mb-0">{document.name || document.title}</p>
            <Icon name="far fa-ellipsis-h" size={14} color="#c3c7cc" />
          </div>
          <div className="py-2">
            <p className="dsl-m12 mb-0">Description</p>
            <div className="p-2">
              <span className="dsl-b16 truncate-four">{document.data.description}</span>
            </div>
          </div>
          {equals('esign', type) ? (
            <Row className="mx-0 mt-2">
              <Col xs={12} sm={6} className="px-0">
                <p className="dsl-m12 mb-0">Singers</p>
                <div className="p-2">
                  <p className="dsl-b16 mb-0">15</p>
                </div>
              </Col>
              <Col xs={12} sm={6} className="px-0">
                <p className="dsl-m12 mb-0">Countersingers</p>
                <div className="p-2">
                  <p className="dsl-b16 mb-0">3</p>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="mx-0 mt-2">
              <Col xs={12} sm={6} className="px-0">
                <p className="dsl-m12 mb-0">File</p>
                <div className="p-2">
                  <p className="dsl-b16 mb-0">{document.data.file ? document.data.file : 'N/A'}</p>
                </div>
              </Col>
              <Col xs={12} sm={6} className="px-0">
                <p className="dsl-m12 mb-0">Last time Changed</p>
                <div className="p-2">
                  <p className="dsl-b16 mb-0">
                    {moment
                      .utc(document.updated_at)
                      .local()
                      .format('MMM DD, YYYY')}
                  </p>
                </div>
              </Col>
            </Row>
          )}

          <Accordion className="settings">
            <Row className="mt-3">
              <Col xs={12} sm={6} className="my-3">
                <Dropdown
                  title="Author"
                  direction="vertical"
                  width="fit-content"
                  data={authors}
                  defaultIds={[document.author_id]}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="my-3">
                <Dropdown
                  multi
                  title="Departments"
                  direction="vertical"
                  width="fit-content"
                  data={departments}
                  defaultIds={document.data.department}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="my-3">
                <Dropdown
                  multi
                  title="Competencies"
                  direction="vertical"
                  width="fit-content"
                  data={competencies}
                  defaultIds={document.data.competency}
                  getValue={e => e.name}
                />
              </Col>
              <Col xs={12} sm={6} className="my-3">
                <Dropdown
                  multi
                  title="Categories"
                  direction="vertical"
                  width="fit-content"
                  data={categories}
                  defaultIds={document.data.category}
                  getValue={e => e.name}
                />
              </Col>
            </Row>
          </Accordion>
        </div>
      </div>
      {type == 'packets' && (
        <div className="library-document-card border-5 mt-3 py-3">
          <div className="d-flex justify-content-between">
            <span className="dsl-b20 bold mb-0">Documents</span>
            <Button type="link">
              <Icon name="fal fa-plus" size={12} color="#376caf" />
              <span className="dsl-p14 ml-1">Add Document</span>
            </Button>
          </div>
          <Document
            name="New Hire Orientation"
            description="Lorem Ipsum is simply dummy text"
            iconName="fal fa-file-pdf"
            documentName="PDF"
            modules={5}
            attachments="https://www.google.com"
            updatedAt="2020-03-02 10:10:10"
            onShow={() => {}}
            onToggle={() => {}}
            onChange={() => {}}
          />
        </div>
      )}
    </>
  )
}

export default memo(Detail)
