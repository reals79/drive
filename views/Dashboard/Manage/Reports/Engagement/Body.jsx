import React from 'react'
import { equals, includes, isNil, path } from 'ramda'
import classNames from 'classnames'
import { Avatar, Icon } from '@components'
import { avatarBackgroundColor, inPage } from '~/services/util'
import { KEYS, TITLES } from './Constants'
import './Engagement.scss'

const Body = ({ data, type, page, per, total, column, totalColumn, userIds }) => {
  if (isNil(data)) return null
  if (isNil(total)) return null

  return (
    <>
      <div className="engagement">
        <div className="d-flex-2 d-flex-sm-1 pb-3 pm-md-2">
          <span className="dsl-m12 text-400">Company</span>
        </div>
        {TITLES[type].map((title, index) => (
          <div
            className={classNames(
              'd-flex-1 text-400 text-right d-none d-md-block pb-3 pb-md-0 ml-2',
              index <= 1 && column == 1 && 'd-block',
              index > 1 && index <= 3 && column == 2 && 'd-block',
              index > 3 && index <= 5 && column == 3 && 'd-block',
              index > 5 && index <= 7 && column == 4 && 'd-block'
            )}
            key={title}
          >
            <p className="dsl-m12 mb-0 text-400">{title[0]}</p>
            <p className="dsl-m12 mb-0 text-400">{title[1]}</p>
          </div>
        ))}
        <div className={classNames('edit d-none d-md-flex', totalColumn == column && 'd-flex')} />
      </div>
      {isNil(data) || equals(0, data.length) || isNil(total) ? (
        <div className="no-records">
          <p className="dsl-m12">No records available</p>
        </div>
      ) : (
        <div>
          {total.map((total, index) => (
            <div className="engagement pb-0 pb-md-4" key={index}>
              <div className="d-flex d-flex-2 d-flex-sm-1 align-items-center custom-br-ssm">
                <span className="dsl-b14 text-400">Total</span>
              </div>
              {KEYS[type].length > 0 ? (
                KEYS[type].map((key, i) => (
                  <div
                    className={classNames(
                      'd-flex-1 text-right d-none d-md-block ml-2',
                      i <= 1 && column == 1 && 'd-block',
                      i > 1 && i <= 3 && column == 2 && 'd-block',
                      i > 3 && i <= 5 && column == 3 && 'd-block',
                      i > 5 && i <= 7 && column == 4 && 'd-block',
                      i % 2 == 0 ? 'custom-br-ssm pt-3 pt-md-0' : 'list-item',
                      KEYS[type].length == i + 1 && 'pt-3 pt-md-0 custom-br-ssm'
                    )}
                    key={`${index}-${key}`}
                  >
                    <p className="dsl-b14 mb-1 text-400">
                      {key.includes('completion') ? path(['complete'], total[key]) : path(['count'], total[key]) || 0}
                    </p>
                    <p className="dsl-m12 mb-0">{path(['percent'], total[key]) || 0}%</p>
                  </div>
                ))
              ) : (
                <div className="dsl-d14 d-flex-3 text-center empty-message">No records available</div>
              )}
              <div className={classNames('edit d-none d-md-flex pb-4 pb-md-0', totalColumn == column && 'd-flex')}>
                <Icon name="fas fa-ellipsis-h text-500" color="#969faa" size={14} />
              </div>
            </div>
          ))}
          {data.map((company, index) => {
            if (
              (userIds.length > 0 && includes(company.id, userIds)) ||
              (userIds.length === 0 && inPage(index, page, per))
            )
              return (
                <div className="engagement pb-0 pb-md-4" key={company.id}>
                  <div className="d-flex-2 d-flex-sm-3 d-flex align-items-center custom-br-ssm mr-2 mr-md-0">
                    <Avatar
                      size="tiny"
                      type="initial"
                      url={`${company.avatar}${Date.now()}`}
                      name={company.name}
                      backgroundColor={avatarBackgroundColor(company.id)}
                    />
                    <span className="dsl-b14 ml-3 cursor-pointer text-400">{company.name}</span>
                  </div>
                  {KEYS[type].length > 0 ? (
                    KEYS[type].map((key, i) => (
                      <div
                        className={classNames(
                          'd-flex-1 text-right d-none d-md-block ml-2',
                          i <= 1 && column == 1 && 'd-block',
                          i > 1 && i <= 3 && column == 2 && 'd-block',
                          i > 3 && i <= 5 && column == 3 && 'd-block',
                          i > 5 && i <= 7 && column == 4 && 'd-block',
                          i % 2 == 0 ? 'custom-br-ssm pt-3 pt-md-0' : 'list-item',
                          KEYS[type].length == i + 1 && 'pt-3 pt-md-0 custom-br-ssm'
                        )}
                        key={`${company.id}-${key}`}
                      >
                        <p className="dsl-b14 mb-1 text-400">
                          {key.includes('completion')
                            ? path(['complete'], company.report[key])
                            : path(['count'], company.report[key]) || 0}
                        </p>
                        <p className="dsl-m12 mb-0">{path(['percent'], company.report[key]) || 0}%</p>
                      </div>
                    ))
                  ) : (
                    <div className="dsl-d14 d-flex-3 text-center empty-message">No records available</div>
                  )}
                  <div className={classNames('edit d-none d-md-flex pb-4 pb-md-0', totalColumn == column && 'd-flex')}>
                    <Icon name="fas fa-ellipsis-h text-500" color="#969faa" size={14} />
                  </div>
                </div>
              )
          })}
        </div>
      )}
    </>
  )
}

export default Body
