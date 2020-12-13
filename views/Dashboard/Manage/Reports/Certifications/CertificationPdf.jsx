import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isEmpty } from 'ramda'
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

export default function CertificationPdf(props) {
  const { users, programs, date, tab } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = equals(tab, 'employees')
    ? 'Reports - Certifications - Employees'
    : 'Reports - Certifications - Certifications'

  let pageIndex = 1

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle={pageTitle}
          title="Certifications"
          date={`${startDate} - ${endDate}`}
          fixed
        />
        {equals(tab, 'employees') && (
          <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
            <View fixed style={styles.listHeader}>
              <View style={{ flex: 10.5 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employee</Text>
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Open</Text>
              </View>
              <View style={{ flex: 9, padding: '0 10px' }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Certifications</Text>
              </View>
              <View style={{ flex: 3.5 }}>
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
              <View style={{ flex: 9, padding: '0 10px' }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Certifications</Text>
              </View>
            </View>
            {isEmpty(users) ? (
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
              users.map((user, index) => {
                const name = user.profile.first_name + user.profile.last_name
                const openCerts = user.stats.open_certifications.map(({ title }) => ({
                  title,
                }))
                let openCertsTitle = []
                openCerts.forEach(e => {
                  openCertsTitle.push(e.title)
                })
                const completedCerts = user.stats.completed_certifications.map(({ title }) => ({
                  title,
                }))
                let completedCertsTitle = []
                completedCerts.forEach(e => {
                  completedCertsTitle.push(e.title)
                })
                let pageBreak = false
                if (pageIndex == 10) {
                  pageBreak = true
                  pageIndex = 1
                }
                pageIndex++
                return (
                  <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                    <View style={{ flex: 10.5 }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>{name}</Text>
                    </View>
                    <View style={{ flex: 1.5 }}>
                      <Text
                        style={{
                          fontSize: '12',
                          fontWeight: 'light',
                          fontFamily: 'Roboto',
                          textAlign: 'right',
                        }}
                      >
                        {user.stats.open}
                      </Text>
                    </View>
                    <View style={{ flex: 9, padding: '0 10px' }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                        {isEmpty(openCerts) ? 'Nothing open' : openCertsTitle.join(', ')}
                      </Text>
                    </View>
                    <View style={{ flex: 3.5 }}>
                      <Text
                        style={{
                          fontSize: '12',
                          fontWeight: 'light',
                          fontFamily: 'Roboto',
                          textAlign: 'right',
                        }}
                      >
                        {user.stats.completed}
                      </Text>
                    </View>
                    <View style={{ flex: 9, padding: '0 10px' }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                        {isEmpty(completedCerts) ? 'Nothing Completed' : completedCertsTitle.join(', ')}
                      </Text>
                    </View>
                  </View>
                )
              })
            )}
          </View>
        )}
        {equals(tab, 'certifications') && (
          <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
            <View fixed style={styles.listHeader}>
              <View style={{ flex: 10.5 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Certifications</Text>
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Open</Text>
              </View>
              <View style={{ flex: 9, padding: '0 10px' }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employees</Text>
              </View>
              <View style={{ flex: 3.5 }}>
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
              <View style={{ flex: 9, padding: '0 10px' }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employees</Text>
              </View>
            </View>
            {isEmpty(programs) ? (
              <View
                style={{
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
                const openEmployees = program.stats.open_employees.map(e => {
                  const { profile } = e
                  return {
                    name: `${profile.first_name} ${profile.last_name}`,
                  }
                })
                const completedEmployees = program.stats.completed_employees.map(e => {
                  const { profile } = e
                  return {
                    name: `${profile.first_name} ${profile.last_name}`,
                  }
                })
                let openEmployeesName = []
                openEmployees.forEach(e => {
                  openEmployeesName.push(e.name)
                })
                let completedEmployeesName = []
                completedEmployees.forEach(e => {
                  completedEmployeesName.push(e.name)
                })
                let pageBreak = false
                if (pageIndex == 10) {
                  pageBreak = true
                  pageIndex = 1
                }
                pageIndex++

                return (
                  <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                    <View style={{ flex: 10.5 }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>{program.title}</Text>
                    </View>
                    <View style={{ flex: 1.5 }}>
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
                    <View style={{ flex: 9, padding: '0 10px' }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                        {isEmpty(openEmployees) ? 'No employee' : openEmployeesName.join(', ')}
                      </Text>
                    </View>
                    <View style={{ flex: 3.5 }}>
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
                    <View style={{ flex: 9, padding: '0 10px' }}>
                      <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                        {isEmpty(completedEmployees) ? 'No employee' : completedEmployeesName.join(', ')}
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
