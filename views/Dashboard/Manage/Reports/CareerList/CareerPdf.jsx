import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isNil, find, propEq, keys, length, isEmpty } from 'ramda'
import { PdfHeader as Header } from '@components'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    alignItems: 'stretch',
  },
  listHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px',
    paddingBottom: '10px',
    paddingTop: '10px',
    borderBottomWidth: 0.25,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '5px',
    marginRight: '10px',
    marginLeft: '10px',
    borderBottomWidth: 0.25,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: '50px',
    maxHeight: '100px',
  },
  pageNumbers: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    margin: '10px',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
})

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/fonts/Roboto-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/Roboto-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/Roboto-Light.ttf',
      fontWeight: 'light',
    },
  ],
})

export default function CareerPdf(props) {
  const { users, programs, jobRoles, date, tab } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = equals(tab, 'employees') ? 'Reports - Career - Employees' : 'Reports - Career - Career'
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle={pageTitle}
          title="Career"
          date={`${startDate} - ${endDate}`}
          fixed
        />
        {equals(tab, 'employees') && (
          <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
            <View style={styles.listHeader} fixed>
              <View style={{ flex: 4 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employee</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Career</Text>
              </View>
              <View style={{ flex: 0.5 }} />
              <View style={{ flex: 2.5 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Level</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={{
                    fontSize: '10',
                    fontWeight: 'normal',
                    fontFamily: 'Roboto',
                    textAlign: 'right',
                  }}
                >
                  Started
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={{
                    fontSize: '10',
                    fontWeight: 'normal',
                    fontFamily: 'Roboto',
                    textAlign: 'right',
                  }}
                >
                  Est. Compl.
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text
                  style={{
                    fontSize: '10',
                    fontWeight: 'normal',
                    fontFamily: 'Roboto',
                    textAlign: 'right',
                  }}
                >
                  Completed
                </Text>
              </View>
              <View style={{ flex: 0.5 }} />
            </View>
            {users.map((item, index) => {
              const { profile, stats } = item
              let currentCareer = stats.open_careers[0]
              if (equals(stats.open, 0) && !equals(stats.completed, 0)) {
                currentCareer = stats.completed_careers[0]
              }
              const title = isNil(currentCareer) ? 'No Program Assigned' : currentCareer.title
              const name = isNil(profile) ? '' : `${profile.first_name} ${profile.last_name}`
              const careerRole = isNil(currentCareer) ? null : find(propEq('id', currentCareer.job_role_id), jobRoles)
              const jobTitle = isNil(careerRole) ? '' : careerRole.name
              const level = isNil(currentCareer)
                ? 'N/A'
                : `(${currentCareer.level}/${
                    isNil(currentCareer.data) || isNil(currentCareer.data.levels)
                      ? 1
                      : length(keys(currentCareer.data.levels))
                  })`
              const started = isNil(currentCareer)
                ? 'N/A'
                : moment
                    .utc(currentCareer.started_at || currentCareer.created_at)
                    .local()
                    .format('MMM DD, YY')
              const end =
                isNil(currentCareer) || isNil(currentCareer.end_estimate)
                  ? 'N/A'
                  : moment
                      .utc(item.program.end_estimate)
                      .local()
                      .format('MMM DD, YY')
              let completed = 0
              if (!isNil(currentCareer)) {
                const currentStats = currentCareer.stats
                const { courses, quotas } = currentStats
                const totals = (isNil(quotas) ? 0 : quotas.total) + (isNil(courses) ? 0 : courses.total)
                const completes = (isNil(quotas) ? 0 : quotas.complete) + (isNil(courses) ? 0 : courses.complete)
                completed = equals(totals, 0) ? 100 : ((completes * 100) / totals).toFixed(2)
              }
              let pageBreak = false
              if (pageIndex == 10) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++
              return (
                <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                  <View style={{ flex: 4 }}>
                    <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>{name}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>{title}</Text>
                  </View>
                  <View style={{ flex: 0.5 }} />
                  <View style={{ flex: 2.5 }}>
                    <Text
                      style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}
                    >{`${jobTitle} ${level}`}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontSize: '12',
                        fontWeight: 'light',
                        fontFamily: 'Roboto',
                        textAlign: 'right',
                      }}
                    >
                      {started}
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontSize: '12',
                        fontWeight: 'light',
                        fontFamily: 'Roboto',
                        textAlign: 'right',
                      }}
                    >
                      {end}
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontSize: '12',
                        fontWeight: 'light',
                        fontFamily: 'Roboto',
                        textAlign: 'right',
                      }}
                    >
                      {completed}%
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }} />
                </View>
              )
            })}
          </View>
        )}
        {equals(tab, 'careers') && (
          <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
            <View fixed style={styles.listHeader}>
              <View style={{ flex: 7 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Careers</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Open</Text>
              </View>
              <View style={{ flex: 8, padding: '0 10px' }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employees</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text
                  style={{
                    fontSize: '10',
                    fontWeight: 'normal',
                    fontFamily: 'Roboto',
                    textAlign: 'right',
                  }}
                >
                  Completed
                </Text>
              </View>
              <View style={{ flex: 8, padding: '0 10px' }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employees</Text>
              </View>
            </View>
            {isEmpty(programs) ? (
              <View
                styles={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 0',
                }}
              >
                <Text style={{ fontSize: '16', fontWeight: 'normal', fontFamily: 'Roboto' }}>No Careers Assigned</Text>
              </View>
            ) : (
              programs.map((program, index) => {
                const openEmployees = program.stats.open_employees
                  ? program.stats.open_employees.map(e => {
                      const { profile } = e
                      return {
                        name: `${profile.first_name} ${profile.last_name}`,
                      }
                    })
                  : []
                const completedEmployees = program.stats.completed_employees
                  ? program.stats.completed_employees.map(e => {
                      const { profile } = e
                      return {
                        name: `${profile.first_name} ${profile.last_name}`,
                      }
                    })
                  : []
                let openEmpolyeesName = []
                openEmployees.forEach(e => {
                  openEmpolyeesName.push(e.name)
                })
                let completedEmployeesName = []
                completedEmployees.forEach(e => {
                  completedEmployeesName.push(e.name)
                })
                let pageBreak = false
                if (pageIndex == 10) {
                  pageBreak = true
                  pageIndex = 0
                }
                pageIndex++
                return (
                  <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                    <View style={{ flex: 7 }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>{program.title}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: '12',
                          fontWeight: 'light',
                          fontFamily: 'Roboto',
                          textAlign: 'right',
                        }}
                      >
                        {program.stats.open}
                      </Text>
                    </View>
                    <View style={{ flex: 8, padding: '0 10px' }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                        {isEmpty(openEmpolyeesName) ? 'No employee' : openEmpolyeesName.join(', ')}
                      </Text>
                    </View>
                    <View style={{ flex: 3 }}>
                      <Text
                        style={{
                          fontSize: '12',
                          fontWeight: 'light',
                          fontFamily: 'Roboto',
                          textAlign: 'right',
                        }}
                      >
                        {program.stats.completed}
                      </Text>
                    </View>
                    <View style={{ flex: 8, padding: '0 10px' }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                        {isEmpty(completedEmployeesName) ? 'No Employee' : completedEmployeesName.join(', ')}
                      </Text>
                    </View>
                  </View>
                )
              })
            )}
          </View>
        )}
        <Text
          fixed
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  ).toBlob()
}
