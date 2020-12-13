import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isNil, values } from 'ramda'
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
    margin: '10px 10px 0 10px',
    paddingBottom: '10px',
    paddingTop: '3px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
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
  listItemFont: { fontSize: '10', fontWeight: 'light', fontFamily: 'Roboto' },
  titleHead: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  listTitle: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' },
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

export default function NewHirePdf(props) {
  const { newHireReport, date } = props
  const startDate = moment(date.start).format('MMM-DD')
  const endDate = moment(date.end).format('MMM-DD')
  const pageTitle = 'Reports - New Hire Orientation'
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header Pagetitle={pageTitle} style={{ paddingTop: '10px' }} date={`${startDate} - ${endDate}`} fixed />
        {values(newHireReport.individuals).length === 0 ? (
          <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
            <View style={styles.listHeader} fixed>
              <View style={{ flex: 4, textAlign: 'center' }}>
                <Text style={styles.listHeaderTitle}>No New Hires is Present</Text>
              </View>
            </View>
          </View>
        ) : (
          <View wrap style={{ display: 'flex' }}>
            <View fixed>
              <View style={{ flex: 4, paddingTop: '20px', paddingLeft: '10px', paddingBottom: '15px' }}>
                <Text style={styles.titleHead}>New Hire Orientation Report</Text>
              </View>
            </View>
            <View style={styles.listHeader} fixed>
              <View style={{ flex: 5 }}>
                <Text style={styles.listTitle}>Employee</Text>
              </View>
              <View style={{ flex: 3, textAlign: 'right' }}>
                <Text style={styles.listTitle}>Course</Text>
              </View>
              <View style={{ flex: 3, textAlign: 'right' }}>
                <Text style={styles.listTitle}>Habits</Text>
              </View>
              <View style={{ flex: 3, textAlign: 'right' }}>
                <Text style={styles.listTitle}>Quotas</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 3, paddingRight: '10px', textAlign: 'right' }}>
                <Text style={styles.listTitle}>Assigned</Text>
              </View>
              <View style={{ flex: 4, textAlign: 'right' }}>
                <Text style={styles.listTitle}>Est.Completions</Text>
              </View>
              <View style={{ flex: 3, textAlign: 'right', paddingRight: 5 }}>
                <Text style={styles.listTitle}>Completed</Text>
              </View>
            </View>

            {values(newHireReport.individuals).map((item, index) => {
              const { name, report } = item
              const { certification_object } = report
              const courses = isNil(certification_object) ? null : certification_object.stats.courses
              const habits = isNil(certification_object) ? null : certification_object.stats.habits
              const quotas = isNil(certification_object) ? null : certification_object.stats.quotas
              const created_at = isNil(certification_object) ? null : certification_object.created_at
              const est_completion = isNil(certification_object) ? null : certification_object.estimated_completion
              const completed_at = isNil(certification_object) ? null : certification_object.completed_at
              const habitsComplete = isNil(habits)
                ? 0
                : habits.day.complete + habits.week.complete + habits.month.complete
              const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
              const habitsCompletion =
                isNil(habits) || equals(habitsTotal, 0) ? 0 : Math.ceil((habitsComplete * 100) / habitsTotal)

              let pageBreak = false
              if (pageIndex === 13) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++
              return (
                <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                  <View style={{ flex: 5 }}>
                    <Text style={styles.listItemFont}>{name}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right', paddingLeft: '20px' }}>
                    <Text style={styles.listItemFont}>
                      {isNil(courses) ? `0/0` : `${courses.complete}/${courses.total}`}
                    </Text>
                    <Text style={styles.listItemFont}>{isNil(courses) ? `0%` : `${courses.completion}%`}</Text>
                  </View>
                  <View style={{ flex: 3, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>
                      {habitsComplete}/{habitsTotal}
                    </Text>
                    <Text style={styles.listItemFont}>{habitsCompletion}%</Text>
                  </View>
                  <View style={{ flex: 3, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>
                      {isNil(quotas) ? `0/0` : `${quotas.complete}/${quotas.total}`}
                    </Text>
                    <Text style={styles.listItemFont}>{isNil(quotas) ? `0%` : `${quotas.completion}%`}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 3, textAlign: 'right', paddingRight: '10px' }}>
                    <Text style={styles.listItemFont}>
                      {isNil(created_at)
                        ? 'NA'
                        : moment
                            .utc(created_at)
                            .local()
                            .format('MMM DD, YY')}
                    </Text>
                  </View>
                  <View style={{ flex: 4, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>
                      {isNil(est_completion)
                        ? 'NA'
                        : moment
                            .utc(est_completion)
                            .local()
                            .format('MMM DD, YY')}
                    </Text>
                  </View>
                  <View style={{ flex: 3, textAlign: 'right', paddingRight: 5 }}>
                    <Text style={styles.listItemFont}>
                      {!isNil(completed_at) ? 'NA' : moment('Feb 21, 20').format('MMM DD, YY')}
                    </Text>
                  </View>
                </View>
              )
            })}
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
