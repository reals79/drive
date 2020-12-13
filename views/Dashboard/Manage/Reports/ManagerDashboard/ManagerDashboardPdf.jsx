import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { isEmpty } from 'ramda'
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
    paddingBottom: '10px',
    paddingTop: '10px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
    minHeight: 25,
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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  fontStyle1: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' },
  fontStyle2: { fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' },
  fontStyle3: { fontSize: '10', fontWeight: 'light', fontFamily: 'Roboto' },
  fontStyle4: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto', textAlign: 'right' },
  fontStyle5: { fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto', textAlign: 'right' },
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

const getBasicInfoData = (title, data, totalCount) => {
  return (
    <View>
      <View style={{ paddingBottom: 18 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {data.map((item, index) => {
        if (index < totalCount) {
          return (
            <View style={{ paddingBottom: index === totalCount - 1 ? 17 : 10, display: 'flex' }}>
              <Text
                style={{
                  fontSize: '10',
                  fontWeight: 'normal',
                  fontFamily: 'Roboto',
                  letterSpacing: 0,
                }}
              >
                {item.title}:
                <Text style={styles.fontStyle3} value={item.value}>
                  {'   ' + item.value}
                </Text>
              </Text>
            </View>
          )
        }
      })}
    </View>
  )
}

const getTableData = (tableTitle, data, c1Header, c2Header, c3Header, c1Data, c2Data, c3Data) => {
  return (
    <View>
      <View style={{ paddingBottom: 3 }}>
        <Text style={styles.title}>{tableTitle}</Text>
      </View>
      <View wrap style={{ paddingBottom: 20 }}>
        <View fixed style={styles.listHeader}>
          <View style={{ flex: 7 }}>
            <Text style={styles.fontStyle1}>{c1Header}</Text>
          </View>
          <View style={{ flex: c2Header === 'Career' ? 2 : 1 }}>
            <Text style={styles.fontStyle4}>{c2Header}</Text>
          </View>
          <View style={{ flex: 2, paddingRight: 8 }}>
            <Text style={styles.fontStyle4}>{c3Header}</Text>
          </View>
        </View>
        {isEmpty(data) ? (
          <View>
            <Text style={styles.fontStyle2}>No {tableTitle}</Text>
          </View>
        ) : (
          data.map((item, index) => {
            return (
              <View style={styles.listItem} key={`crd${index}`} wrap>
                <View style={{ flex: 7 }}>
                  <Text style={styles.fontStyle2}>
                    {c1Data === 'user'
                      ? item.user.profile.first_name + item.user.profile.last_name
                      : item[c1Data]['name']}
                  </Text>
                </View>
                <View style={{ flex: c2Data === 'program' ? 2 : 1 }}>
                  <Text style={styles.fontStyle5}>
                    {c2Data === 'static' ? 'YES' : c2Data === 'program' ? item[c2Data]['title'] : item[c2Data]}
                  </Text>
                </View>
                <View style={{ flex: 2, paddingRight: 8 }}>
                  <Text style={styles.fontStyle5}>{c3Data === 'static' ? '30%' : item[c3Data]}</Text>
                </View>
              </View>
            )
          })
        )}
      </View>
    </View>
  )
}

export default function ManagerDashboardPdf(props) {
  const {
    reports: { training, new_hire, performance, career, tasks, employee_records },
    date,
  } = props

  let pdfData = []
  pdfData.push({
    title: 'Training Activity',
    data1: { title: 'Modules Completed', value: training.modules_completed },
    data2: {
      title: 'Courses Completed',
      value: training.courses_completed,
    },
    data3: {
      title: 'Assignments ready next week',
      value: training.assignments,
    },
    totalDataCount: 3,
    tableData: training.top_users,
    tableTitle: 'Top Trainees',
    c1Header: 'Employee',
    c2Header: 'Modules',
    c3Header: 'Courses',
    c1Data: 'user',
    c2Data: 'modules_complete',
    c3Data: 'courses_complete',
  })
  pdfData.push({
    title: 'New Hire Orientations',
    data1: { title: 'New hires this month', value: new_hire.new_hires },
    data2: {
      title: 'Certifications assigned',
      value: new_hire.certifications_assigned,
    },
    data3: {
      title: 'Certifications completed',
      value: new_hire.certifications_completed,
    },
    totalDataCount: 3,
    tableData: new_hire.top_users,
    tableTitle: 'New Hires',
    c1Header: 'Employee',
    c2Header: 'Active',
    c3Header: 'Completed',
    c1Data: 'user',
    c2Data: 'static',
    c3Data: 'static',
  })
  pdfData.push({
    title: 'Performance Reviews',
    data1: { title: 'Employees with scorecards', value: performance.scorecards },
    data2: {
      title: 'Average reviews',
      value: performance.average_reviews,
    },
    data3: {
      title: 'Commitments made',
      value: performance.task_commitments,
    },
    totalDataCount: 3,
    tableData: performance.top_users,
    tableTitle: 'Top Reviews',
    c1Header: 'Employee',
    c2Header: 'Score',
    c3Header: 'Stars',
    c1Data: 'user',
    c2Data: 'stars',
    c3Data: 'stars',
  })
  pdfData.push({
    title: 'Career Management',
    data1: { title: 'Employees career paths', value: career.employee_careers },
    data2: {
      title: 'Promotions possible this month',
      value: career.promotions_possible,
    },
    data3: {
      title: 'Ave career completion',
      value: career.average_completion + '%',
    },
    totalDataCount: 3,
    tableData: career.top_users,
    tableTitle: 'Career Progress',
    c1Header: 'Employee',
    c2Header: 'Career',
    c3Header: 'Progress',
    c1Data: 'user',
    c2Data: 'program',
    c3Data: 'completed_percent',
  })
  pdfData.push({
    title: 'Tasks & Projects',
    data1: { title: 'Tasks completed', value: tasks.tasks_completed },
    data2: {
      title: 'Habits completed',
      value: tasks.habits_completed,
    },
    data3: {
      title: 'Active projects',
      value: tasks.active_projects,
    },
    totalDataCount: 3,
    tableData: tasks.popular_projects,
    tableTitle: 'Popular Projects',
    c1Header: 'Projects',
    c2Header: 'Completed',
    c3Header: 'Past Due',
    c1Data: 'project',
    c2Data: 'complete',
    c3Data: 'past_due',
    tableData2: tasks.top_users,
    tableTitle2: '',
    c1Header2: 'Most Active Employees',
    c2Header2: '',
    c3Header2: 'Completed Tasks',
    c1Data2: 'user',
    c2Data2: '',
    c3Data2: 'total',
  })
  pdfData.push({
    title: 'Employee Records',
    data1: { title: 'Total employees', value: employee_records.total_employees },
    data2: {
      title: 'Assigned training',
      value: employee_records.training_assigned,
    },
    data3: {
      title: 'New hires',
      value: employee_records.new_hires,
    },
    data4: {
      title: 'Employees w/Scorecards',
      value: employee_records.scorecards,
    },
    data5: {
      title: 'Average performance',
      value: employee_records.average_performance,
    },
    data6: {
      title: 'Employees w/Careers',
      value: employee_records.employee_careers,
    },
    data7: {
      title: 'Employees w/Habits Sched-s',
      value: employee_records.habit_schedules,
    },
    data8: {
      title: 'Tasks assigned',
      value: employee_records.tasks_assigned,
    },
    data9: {
      title: 'Archived signed documents',
      value: employee_records.active_signed_documents,
    },
    totalDataCount: 9,
  })

  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = 'Reports - Manager Dashboard'
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20, paddingBottom: 10 }}
          Pagetitle={pageTitle}
          date={`${startDate} - ${endDate}`}
          fixed
        />
        {pdfData.map((item, index) => (
          <View style={{ display: 'flex', marginLeft: 10, marginRight: 10 }} wrap break={index === 2 || index === 4}>
            {getBasicInfoData(
              item.title,
              [
                item.data1,
                item.data2,
                item.data3,
                item.data4,
                item.data5,
                item.data6,
                item.data7,
                item.data8,
                item.data9,
              ],
              item.totalDataCount
            )}
            {item.tableData &&
              getTableData(
                item.tableTitle,
                item.tableData,
                item.c1Header,
                item.c2Header,
                item.c3Header,
                item.c1Data,
                item.c2Data,
                item.c3Data
              )}
            {item.tableData2 &&
              getTableData(
                item.tableTitle2,
                item.tableData2,
                item.c1Header2,
                item.c2Header2,
                item.c3Header2,
                item.c1Data2,
                item.c2Data2,
                item.c3Data2
              )}
          </View>
        ))}
        <Text
          fixed
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  ).toBlob()
}
