import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { isNil, isEmpty } from 'ramda'
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
    margin: '9px 10px 0px 10px',
    paddingBottom: '10px',
    paddingTop: '3px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: '9px 10px 0px 10px',
    paddingBottom: '3px',
    paddingTop: '10px',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: '8px 10px 0px 10px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
    minHeight: '30px',
    maxHeight: '50px',
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
  listHeaderTitle: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' },
  listItemFont: { fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' },
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

export default function AnniversaryPdf(props) {
  const { employees, date } = props
  const startDate = date.start.format('MMM-DD')
  const endDate = date.end.format('MMM-DD')
  const pageTitle = 'Report - Anniversary Report'
  let pageIndex = 1

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header Pagetitle={pageTitle} style={{ paddingTop: '20px' }} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Anniversary Report</Text>
            </View>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.listHeaderTitle}>Employee</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.listHeaderTitle}>Company</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.listHeaderTitle}>Departments</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Anniversary date</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right', paddingRight: 5 }}>
              <Text style={styles.listHeaderTitle}>Hire date</Text>
            </View>
          </View>
          {employees.map((employee, index) => {
            const hireDate = moment(employee.hired_at).format('MMM DD, YY')
            const anniversaryDate =
              isNil(employee.anniversary_date) || isEmpty(employee.anniversary_date)
                ? 'NA'
                : moment(employee.anniversary_date).format('MMM DD, YY')
            let pageBreak = false
            if (pageIndex == 14) {
              pageBreak = true
              pageIndex = 1
            }
            pageIndex++
            return (
              <View style={styles.listItem} key={index} wrap break={pageBreak}>
                <View style={{ flex: 4 }}>
                  <Text style={styles.listItemFont}>{employee.name}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.listItemFont}>{employee.company_name}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.listItemFont}>{employee.department_name}</Text>
                </View>
                <View style={{ flex: 2, textAlign: 'right' }}>
                  <Text style={styles.listItemFont}>{anniversaryDate}</Text>
                </View>
                <View style={{ flex: 2, textAlign: 'right', paddingRight: 5 }}>
                  <Text style={styles.listItemFont}>{hireDate}</Text>
                </View>
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
