import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isNil, isEmpty } from 'ramda'
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
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
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
    marginBottom: '8px',
    marginRight: '10px',
    marginLeft: '10px',
    borderBottomWidth: 0.25,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: 35,
    maxHeight: 100,
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

function formatStartEnd(date) {
  if (isEmpty(date) || isNil(date)) {
    return
  }
  const st = date.start.format('MMM DD')
  const ed = date.end.format('MMM DD')
  if (!equals(st, ed)) {
    return st + ' - ' + ed
  }
  return st
}

export default function BirthdayPDF({ employees, date }) {
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle="Reports - Birthday Report"
          title="Birthday Report"
          date={formatStartEnd(date)}
          fixed
        />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Employee's Name</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Company</Text>
            </View>
            <View style={{ flex: 0.5 }} />
            <View style={{ flex: 2.5 }}>
              <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Department</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text
                style={{
                  fontSize: '10',
                  fontWeight: 'normal',
                  fontFamily: 'Roboto',
                }}
              >
                Birthday
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text
                style={{
                  fontSize: '10',
                  fontWeight: 'normal',
                  fontFamily: 'Roboto',
                }}
              >
                Hire Date
              </Text>
            </View>
            <View style={{ flex: 0.5 }} />
          </View>
          {employees.map((employee, index) => {
            const hireDate = moment(employee.hired_at).format('MMM DD, YY')
            const birthday =
              isNil(employee.birthday) || isEmpty(employee.birthday)
                ? 'NA'
                : moment(employee.birthday).format('MMM DD, YY')
            let pageBreak = false
            if (pageIndex == 13) {
              pageBreak = true
              pageIndex = 1
            }
            pageIndex++
            return (
              <View style={styles.listItem} key={`birth${index}`} wrap break={pageBreak}>
                <View style={{ flex: 4 }}>
                  <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>{employee.name}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                    {employee.company_name}
                  </Text>
                </View>
                <View style={{ flex: 0.5 }} />
                <View style={{ flex: 2.5 }}>
                  <Text style={{ fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' }}>
                    {employee.department_name}
                  </Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text
                    style={{
                      fontSize: '12',
                      fontWeight: 'light',
                      fontFamily: 'Roboto',
                    }}
                  >
                    {birthday}
                  </Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text
                    style={{
                      fontSize: '12',
                      fontWeight: 'light',
                      fontFamily: 'Roboto',
                    }}
                  >
                    {hireDate}
                  </Text>
                </View>
                <View style={{ flex: 0.5 }} />
              </View>
            )
          })}
        </View>
        <Text
          fixed
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  ).toBlob()
}
