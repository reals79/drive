import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import { isNil, isEmpty, equals } from 'ramda'
import moment from 'moment'
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
    minHeight: '40px',
    maxHeight: '65px',
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

export default function AssignmentsProgramsPdf(props) {
  const { date, data } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = 'Reports - Assignments - Programs'
  let pageIndex = 1

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header style={{ paddingTop: 20 }} Pagetitle={pageTitle} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Programs</Text>
            </View>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 5 }}>
              <Text style={styles.listHeaderTitle}>Programs</Text>
            </View>
            <View style={{ flex: 1, textAlign: 'center' }}>
              <Text style={styles.listHeaderTitle}>Courses</Text>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Habits</Text>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Quotas</Text>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Docs</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Assigned</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Est Completion</Text>
            </View>
            <View style={{ flex: 1.5, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Completed</Text>
            </View>
          </View>
          {isNil(data) || isEmpty(data) ? (
            <View style={{ flex: 4, textAlign: 'center' }}>
              <Text style={styles.listItemFont}>No programs assigned.</Text>
            </View>
          ) : (
            data.map(program => {
              const { courses, habits, quotas, modules } = program.stats
              const habitsComplete = isNil(habits)
                ? 0
                : habits.day.complete + habits.week.complete + habits.month.complete
              const habitsTotal = isNil(habits) ? 0 : habits.day.total + habits.week.total + habits.month.total
              const habitsCompletion = equals(habitsTotal, 0) ? 0 : Math.ceil((habitsComplete * 100) / habitsTotal)
              const totalsCompletion = Math.ceil(
                ((habitsComplete + quotas.complete + courses.complete) * 100) /
                  (habitsTotal + courses.total + quotas.total)
              )
              let pageBreak = false
              if (pageIndex === 10) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++
              return (
                <View style={styles.listItem} key={program.id} break={pageBreak}>
                  <View style={{ flex: 5 }}>
                    <Text style={styles.listItemFont}>{program.title}</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: 'center' }}>
                    <Text style={styles.listItemFont}>
                      {courses.complete}/{courses.total}
                    </Text>
                    <Text style={styles.listHeaderTitle}>{courses.completion}%</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>
                      {habitsComplete}/{habitsTotal}
                    </Text>
                    <Text style={styles.listHeaderTitle}>{habitsCompletion}%</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>
                      {quotas.complete}/{quotas.total}
                    </Text>
                    <Text style={styles.listHeaderTitle}>{quotas.completion}%</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>NA</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'center' }}>
                    <Text style={styles.listItemFont}>{moment(program.created_at).format('MMM DD, YY')}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.listItemFont}>{moment(program.estimated_completion).format('MMM DD, YY')}</Text>
                  </View>
                  <View style={{ flex: 1.5, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{totalsCompletion}%</Text>
                  </View>
                </View>
              )
            })
          )}
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
