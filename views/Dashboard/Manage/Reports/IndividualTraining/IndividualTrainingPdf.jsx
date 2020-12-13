import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { isNil, equals } from 'ramda'
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
    paddingBottom: 15,
    paddingTop: 3,
  },
  listSubHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItem: 'center',
    marginRight: 50,
    paddingBottom: 10,
  },
  listSubData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItem: 'center',
    marginRight: 82,
    paddingBottom: 10,
    minWidth: '120px',
    maxWidth: '120px',
  },
  tableHeader: {
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
    marginLeft: 10,
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
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: '10px',
    marginRight: '10px',
    marginLeft: '10px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
    minHeight: 40,
    maxHeight: 100,
  },
  listHeaderTitle: { fontSize: '10', fontWeight: 'bold', fontFamily: 'Roboto', fontColor: '#000' },
  listSubHeaderTitle: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    marginRight: 5,
  },
  listSubHeaderData: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    marginRight: 5,
  },
  listMainHeader: {
    flexDirection: 'row',
    marginLeft: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
    marginBottom: 10,
  },
  listMainHeader2: {
    flexDirection: 'row',
    marginLeft: 35,
    marginBottom: 20,
  },
  headerSubTitle: {
    flex: 2,
    textAlign: 'center',
  },
  listDisplayFlex2: {
    flex: 2,
  },
  listItemFont: { fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' },
  fontStyleHead4: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    textAlign: 'right',
  },
  fontStyle4: {
    fontSize: '12',
    fontWeight: 'light',
    fontFamily: 'Roboto',
    textAlign: 'right',
  },
  fontStyleHead5: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto', textAlign: 'left' },
  fontStyle5: {
    fontSize: '12',
    fontWeight: 'light',
    fontFamily: 'Roboto',
    textAlign: 'left',
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

const renderStatus = (status, completed_at) => {
  if (equals(status, 0)) {
    return <Text className="dsl-b14 text-400 no-wrap">Not Started</Text>
  } else if (equals(status, 3)) {
    return (
      <View>
        <Text className="dsl-b14 text-400 no-wrap">Completed</Text>
        <Text className="dsl-m12 no-wrap">{moment(completed_at).format('M/D/YYYY')}</Text>
      </View>
    )
  } else if (equals(status, 2)) {
    return <Text className="dsl-b14 text-400 no-wrap">Past Due</Text>
  } else {
    return <Text className="dsl-b14 text-400 no-wrap">In Progress</Text>
  }
}

const getTableData = (title, data, pageIndex) => {
  return (
    <View style={{ marginBottom: '15px' }}>
      <View style={{ paddingBottom: 3 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View fixed style={styles.tableHeader}>
        <View style={{ flex: 6 }}>
          <Text style={styles.fontStyleHead5}>Courses</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Modules</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Compl</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Open</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Due date</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Status</Text>
        </View>
      </View>
      {data.length > 0 ? (
        data.map((item, index) => {
          let pageBreak = false
          if (pageIndex == 10) {
            pageBreak = true
            pageIndex = 1
          }
          pageIndex++
          const completed = item.children_complete
          const total = item.children.length
          const opened = total - completed
          const due_date = isNil(item.due_at) ? 'N/A' : moment(item.due_at).format('MMM D')
          return (
            <View key={index} style={styles.listItem} wrap break={pageBreak}>
              <View style={{ flex: 6 }}>
                <Text style={styles.fontStyle5}>{item.data.name}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{total}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{completed}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{opened}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{due_date}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{renderStatus(item.status, item.completed_at)}</Text>
              </View>
            </View>
          )
        })
      ) : (
        <Text style={styles.fontStyle4}>{`There are no ${title} assigned courses.`}</Text>
      )}
    </View>
  )
}

export default function IndividualTrainingPdf(props) {
  const { date, user, userReport, data, tableHeader, activeTab } = props
  const { manager, career, self } = userReport.report
  const assignDataManager = {
    assigned: manager.courses_assigned.count,
    incompleted: manager.courses_incompleted.count,
    psdtDue: manager.courses_past_due.count,
    completed: manager.courses_completed.count,
  }

  const assignDataCareer = {
    assigned: career.courses_assigned.count,
    incompleted: career.courses_incompleted.count,
    psdtDue: career.courses_past_due.count,
    completed: career.courses_completed.count,
  }
  const assignDataSelf = {
    assigned: self.courses_assigned.count,
    incompleted: self.courses_incompleted.count,
    psdtDue: self.courses_past_due.count,
    completed: self.courses_completed.count,
  }
  const userReportArray = [assignDataManager, assignDataCareer, assignDataSelf]
  const startDate = moment(date.start).format('MMM-DD')
  const endDate = moment(date.end).format('MMM-DD')
  const pageTitle = `Reports - Training - ${user.name}`
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header Pagetitle={pageTitle} style={{ paddingTop: '20px' }} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex', paddingBottom: 12 }}>
          <Text style={styles.title}>{user.name}</Text>
        </View>
        <View wrap style={{ display: 'flex', paddingBottom: 5 }}>
          <View style={styles.listHeader} fixed>
            <View style={styles.headerSubTitle}>
              <Text style={styles.listHeaderTitle}>Career Assigned</Text>
            </View>
            <View style={styles.headerSubTitle}>
              <Text style={styles.listHeaderTitle}>Manager Assigned</Text>
            </View>
            <View style={styles.headerSubTitle}>
              <Text style={styles.listHeaderTitle}>Self Assigned</Text>
            </View>
          </View>
          <View style={styles.listMainHeader}>
            {userReportArray.map((item, index) => {
              return (
                <View key={index} style={styles.listSubHeader} fixed>
                  <View>
                    <Text style={styles.listSubHeaderTitle}>Courses</Text>
                  </View>
                  <View>
                    <Text style={styles.listSubHeaderTitle}>Open</Text>
                  </View>
                  <View>
                    <Text style={styles.listSubHeaderTitle}>PostDue </Text>
                  </View>
                  <View>
                    <Text style={styles.listSubHeaderTitle}>Compl.</Text>
                  </View>
                </View>
              )
            })}
          </View>
          <View style={styles.listMainHeader2}>
            {userReportArray.map((item, index) => {
              return (
                <View key={index} style={styles.listSubData} fixed>
                  <View>
                    <Text style={styles.listSubHeaderData}>{item.assigned}</Text>
                  </View>
                  <View>
                    <Text style={styles.listSubHeaderData}>{item.completed}</Text>
                  </View>
                  <View>
                    <Text style={styles.listSubHeaderData}>{item.psdtDue}</Text>
                  </View>
                  <View>
                    <Text style={styles.listSubHeaderData}>{item.incompleted}</Text>
                  </View>
                </View>
              )
            })}
          </View>
          {getTableData(tableHeader, data, pageIndex)}
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
