import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, filter, isNil } from 'ramda'
import { PdfHeader as Header } from '@components'
import { CompanyPerformanceReportMenu } from '~/services/config'

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
    marginLeft: 10,
    marginRight: 10,
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
  titleHead: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Roboto' },
  listTitle: { fontSize: 10, fontWeight: 'normal', fontFamily: 'Roboto' },
  listItemFont: { fontSize: 8, fontWeight: 'light', fontFamily: 'Roboto' },
  listItemData: { fontSize: 11, fontWeight: 'light', fontFamily: 'Roboto' },
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

export default function CompanyPerformancePdf(props) {
  const { date, data, userRole } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = 'Reports - Performance'
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          Pagetitle={pageTitle}
          style={{ paddingTop: 10, paddingBottom: 10 }}
          date={`${startDate} - ${endDate}`}
          fixed
        />
        <View style={{ marginLeft: 10, marginRight: 10 }} fixed>
          <View style={{ paddingBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleHead}>Performance Report</Text>
            </View>
          </View>
          <View style={styles.listHeader}>
            <View style={{ flex: 2 }}>
              <Text style={styles.listTitle}>Employee</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={styles.listTitle}>ScoreCard</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>Score</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>Commitments</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>Completed</Text>
            </View>
          </View>
        </View>
        {data.users.map((item, index) => {
          let editOptions = []
          if (equals(0, item.scorecards.length)) {
            editOptions = filter(
              e => !equals('Unassign Scorecard', e) && !equals('Preview Scorecard', e),
              CompanyPerformanceReportMenu[userRole]
            )
          } else {
            editOptions = filter(e => !equals('Assign Scorecard', e), CompanyPerformanceReportMenu[userRole])
          }
          if (item.performance && equals(2, item.performance.status)) {
            editOptions = filter(e => !equals('Input Actuals', e) && !equals('Start Review', e), editOptions)
          }
          if (item.scorecards.length == 0) {
            editOptions = editOptions.filter(option => option !== 'Input Actuals')
          }

          let pageBreak = false
          if (pageIndex == 13) {
            pageBreak = true
            pageIndex = 1
          }
          pageIndex++
          return (
            <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
              <View style={{ flex: 2 }}>
                <Text style={styles.listItemData}>
                  {`${item.user.profile.first_name} ${item.user.profile.last_name}`}
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.listItemData}>
                  {0 == item.scorecards.length ? 'No Scorecard assigned' : item.scorecards[0].title}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                {isNil(item.performance) ? (
                  <Text style={styles.listItemData}>Incomplete</Text>
                ) : (
                  <Text>
                    {item.performance.status == 2 ? (
                      <Text>
                        {item.performance.data && 'N/A' !== item.performance.data.average_star_rating ? (
                          <Text style={styles.listItemData}>{item.performance.data.average_star_rating}</Text>
                        ) : (
                          <Text style={styles.listItemData}>Na</Text>
                        )}
                      </Text>
                    ) : (
                      <Text style={styles.listItemData}>Incomplete</Text>
                    )}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {isNil(item.performance) ? (
                  <Text>Incomplete</Text>
                ) : (
                  <View>
                    <View>
                      <Text style={styles.listItemData}>Training: {item.performance.trainings.length}</Text>
                    </View>
                    <View>
                      <Text style={styles.listItemData}>Task: {item.performance.tasks.length}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {item.performance && item.performance.status == 2 && (
                  <Text style={styles.listItemData}>{moment(item.performance.completed_at).format('MM/DD/YY')}</Text>
                )}
              </View>
            </View>
          )
        })}
        <Text
          fixed
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  ).toBlob()
}
