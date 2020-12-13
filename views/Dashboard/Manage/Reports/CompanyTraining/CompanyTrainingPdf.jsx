import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals } from 'ramda'
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
    marginLeft: 10,
    marginRight: 5,
    paddingBottom: '5px',
    paddingTop: '10px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
  },
  listRow: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 5,
    paddingRight: 10,
    paddingBottom: '5px',
    paddingTop: '10px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
  },
  listColumn: {
    minWidth: 25,
    maxWidth: 100,
    paddingTop: 5,
    paddingBottom: 5,
    flex: 4,
    textAlign: 'right',
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: '9px 10px 0 10px',
    paddingTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
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
  employeeName: {
    fontSize: '11',
    fontWeight: 'light',
    fontFamily: 'Roboto',
  },
  percentageSize: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
  },
  valueSize: {
    fontSize: '12',
    fontWeight: 'light',
    fontFamily: 'Roboto',
  },
  customWrap: {
    flex: 6,
    paddingTop: 8,
    paddingBottom: 8,
  },
  customFlex: {
    flex: 3.5,
    paddingTop: 8,
    paddingBottom: 8,
  },
  columnHeading: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
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

export default function TrainingListPdf(props) {
  const { date, trainingReports, companyId, type, total, typeValue } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const mode = companyId[0] === -1 ? 'company' : 'individual'
  const selected = equals('individual', mode) ? trainingReports[mode].individuals : trainingReports[mode].companies
  let pageTitle = `Reports - Training - ${type}`
  let pdfDataHeader = []
  let pdfDataTotal = []
  let employeeData = []
  let pageIndex = 1

  pdfDataHeader.push(
    { one: 'Assigned', two: 'Courses' },
    { one: 'Incomplete', two: 'Courses' },
    { one: 'Past Due', two: 'Courses' },
    { one: 'Completed', two: 'Courses' },
    { one: 'Completed', two: 'on time' },
    { one: 'Completed', two: 'past due' }
  )

  pdfDataTotal.push(
    { one: total.courses_assigned.count, two: total.courses_assigned.percent },
    { one: total.courses_incompleted.count, two: total.courses_incompleted.percent },
    { one: total.courses_past_due.count, two: total.courses_past_due.percent },
    { one: total.courses_completed.count, two: total.courses_completed.percent },
    { one: total.courses_completed_on_time.count, two: total.courses_completed_on_time.percent },
    { one: total.courses_completed_past_due.count, two: total.courses_completed_past_due.percent }
  )
  {
    selected.map(item => {
      const { report } = item
      let reportValues = []
      reportValues.push(
        {
          one: report[typeValue].courses_assigned.count,
          two: report[typeValue].courses_assigned.percent,
        },
        {
          one: report[typeValue].courses_incompleted.count,
          two: report[typeValue].courses_incompleted.percent,
        },
        {
          one: report[typeValue].courses_past_due.count,
          two: report[typeValue].courses_past_due.percent,
        },
        {
          one: report[typeValue].courses_completed.count,
          two: report[typeValue].courses_completed.percent,
        },
        {
          one: report[typeValue].courses_completed_on_time.count,
          two: report[typeValue].courses_completed_on_time.percent,
        },
        {
          one: report[typeValue].courses_completed_past_due.count,
          two: report[typeValue].courses_completed_past_due.percent,
        }
      )
      employeeData.push({ name: item.name, reportValues: reportValues })
    })
  }
  const totalEmployee = employeeData.length
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20, paddingBottom: 10 }}
          Pagetitle={pageTitle}
          date={`${startDate} - ${endDate}`}
          fixed
        />
        <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
          <View style={styles.mainHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Training Report</Text>
            </View>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={styles.customWrap}>
              <Text style={styles.columnHeading}>Employees</Text>
            </View>
            {pdfDataHeader.map((columnHeader, index) => {
              return (
                <View style={styles.listColumn}>
                  <Text style={styles.columnHeading}>{columnHeader.one}</Text>
                  <Text style={styles.columnHeading}>{columnHeader.two}</Text>
                </View>
              )
            })}
          </View>
          <View style={styles.listRow}>
            <View style={totalEmployee > 1 ? styles.customFlex : styles.customWrap}>
              <Text style={styles.employeeName}>Total</Text>
            </View>
            {pdfDataTotal.map((columnTotalValue, index) => {
              return (
                <View style={styles.listColumn}>
                  <Text style={styles.valueSize}>{columnTotalValue.one}</Text>
                  <Text style={styles.percentageSize}>{columnTotalValue.two}%</Text>
                </View>
              )
            })}
          </View>
          {employeeData.map((data, index) => {
            let pageBreak = false
            if (pageIndex === 10) {
              pageBreak = true
              pageIndex = 0
            }
            pageIndex++
            return (
              <View style={styles.listRow} key={`crd${index}`} wrap break={pageBreak}>
                <View style={totalEmployee > 1 ? styles.customFlex : styles.customWrap}>
                  <Text style={styles.employeeName}>{data.name}</Text>
                </View>
                {data.reportValues.map((item, index) => (
                  <View style={styles.listColumn}>
                    <Text style={styles.valueSize}>{item.one}</Text>
                    <Text style={styles.percentageSize}>{item.two}%</Text>
                  </View>
                ))}
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
