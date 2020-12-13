import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { isNil, equals, length, concat, uniqBy, isEmpty } from 'ramda'
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
    maxHeight: '75px',
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

const ListHabit = (data, title, userId) => {
  let pageIndex = 1
  return (
    <View break={title === 'Daily' ? false : true}>
      <View style={styles.mainHeader} fixed>
        <View style={{ flex: 4 }}>
          <Text style={styles.title}>{title} Habits</Text>
        </View>
      </View>
      <View style={styles.listHeader} fixed wrap>
        <View style={{ flex: 11 }}>
          <Text style={styles.listHeaderTitle}>Habits</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={styles.listHeaderTitle}>Assigned</Text>
        </View>
        <View style={{ flex: 2, textAlign: 'right' }}>
          <Text style={styles.listHeaderTitle}>Completed</Text>
        </View>
      </View>
      {isEmpty(data) ? (
        <View style={styles.listItem}>
          <View style={{ flex: 11 }}>
            <Text style={styles.listItemFont}>No Quotas Assigned</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.listItemFont}>Na</Text>
          </View>
          <View style={{ flex: 2, textAlign: 'right' }}>
            <Text style={styles.listItemFont}>Na</Text>
          </View>
        </View>
      ) : (
        data.map((habit, index) => {
          let pageBreak = false
          if (pageIndex === 9 && index === 8) {
            pageBreak = true
            pageIndex = 1
          } else if (pageIndex === 10) {
            pageBreak = true
            pageIndex = 1
          }
          pageIndex++
          return (
            <View style={styles.listItem} key={habit.id} break={pageBreak}>
              <View style={{ flex: 11 }}>
                <Text style={styles.listItemFont}>{habit.name || habit.data.name}</Text>
                <Text style={styles.listHeaderTitle}>{title}</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.listItemFont}>
                  {isNil(habit.program_id) ? (equals(habit.assignedBy, userId) ? 'Self' : 'Manager') : `Program`}
                </Text>
              </View>
              <View style={{ flex: 2, textAlign: 'right' }}>
                <Text style={styles.listItemFont}>{habit.completed ? habit.completed : 0}%</Text>
              </View>
            </View>
          )
        })
      )}
    </View>
  )
}

const ListQuota = (data, title) => {
  let pageIndex = 1
  return (
    <View>
      <View style={styles.mainHeader} fixed>
        <View style={{ flex: 4 }}>
          <Text style={styles.title}>{title} Quotas</Text>
        </View>
      </View>
      <View style={styles.listHeader} fixed>
        <View style={[title === 'Program' ? { flex: 8 } : { flex: 3 }]}>
          <Text style={styles.listHeaderTitle}>Quotas</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={styles.listHeaderTitle}>{title === 'Scorecard' ? 'Scale' : 'Calculation'}</Text>
        </View>
        <View style={{ flex: 1, textAlign: 'right' }}>
          <Text style={styles.listHeaderTitle}>Actual</Text>
        </View>
        <View style={{ flex: 1, textAlign: 'right' }}>
          <Text style={styles.listHeaderTitle}>{title === 'Scorecard' ? 'Score' : 'Status'}</Text>
        </View>
      </View>
      {isEmpty(data) ? (
        <View style={styles.listItem}>
          <View style={[title === 'Program' ? { flex: 8 } : { flex: 3 }]}>
            <Text style={styles.listItemFont}>No Quotas Assigned</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.listItemFont}>Na</Text>
          </View>
          <View style={{ flex: 1, textAlign: 'right' }}>
            <Text style={styles.listItemFont}>Na</Text>
          </View>
          <View style={{ flex: 1, textAlign: 'right' }}>
            <Text style={styles.listItemFont}>Na</Text>
          </View>
        </View>
      ) : (
        data.map((quota, index) => {
          let pageBreak = false
          if (pageIndex === 6 && index === 5) {
            pageBreak = true
            pageIndex = 1
          } else if (pageIndex === 2) {
            pageBreak = true
            pageIndex = 1
          }
          pageIndex++
          return (
            <View style={styles.listItem} key={`crd${index}`} break={pageBreak}>
              {title === 'Scorecard' ? (
                <View style={{ flex: 3 }}>
                  <Text style={styles.listItemFont}>{quota.data.name || quota.name}</Text>
                </View>
              ) : (
                <View style={{ flex: 8 }}>
                  <Text style={styles.listItemFont}>{quota.data.name || quota.name}</Text>
                  <Text style={styles.listHeaderTitle}>{quota.data.description}</Text>
                </View>
              )}
              {title === 'Scorecard' ? (
                <View style={{ flex: 2, marginBottom: 5 }}>
                  <Text style={styles.listItemFont}>{quota.data.star_values[0]} = 5.0</Text>
                  <Text style={styles.listItemFont}>{quota.data.star_values[2]} = 4.0</Text>
                  <Text style={styles.listItemFont}>{quota.data.star_values[3]} = 2.0</Text>
                </View>
              ) : (
                <View style={{ flex: 2 }}>
                  <Text style={styles.listItemFont}> {quota.data.quota_calculation}</Text>
                </View>
              )}
              <View style={{ flex: 1, textAlign: 'right' }}>
                <Text style={styles.listItemFont}>{quota.actuals[0] ? quota.actuals[0].actual : 0}</Text>
              </View>
              <View style={{ flex: 1, textAlign: 'right' }}>
                {title === 'Scorecard' ? (
                  <Text style={styles.listItemFont}>3.0</Text>
                ) : (
                  <Text style={styles.listItemFont}>{quota.status}</Text>
                )}
              </View>
            </View>
          )
        })
      )}
    </View>
  )
}

export default function AssignmentsToDoPdf(props) {
  const { date, scorecards, programs, quotas, habitSchedules, userId, dailyHabits, weeklyHabits, monthlyHabits } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = 'Reports - Assignments - ToDo'
  let scorecardQuotas = []
  let scorecardTitle = []
  let programTitle = []
  let programCourseItems = 0
  let habitSchedulesTitle = []
  let habitsItem = 0

  scorecards.map((card, index) => {
    const { title, quotas } = card
    if (!isNil(quotas)) scorecardQuotas = concat(scorecardQuotas, quotas)
    scorecardTitle.push(title)
  })
  const scorecardQuota = uniqBy(x => x.id, scorecardQuotas)

  programs.map((card, index) => {
    const { title } = card
    programTitle.push(title)
    programCourseItems += card.stats.courses.total
  })

  habitSchedules.map(card => {
    const { data } = card
    habitSchedulesTitle.push(data.name)
    habitsItem += data.child_count
  })

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header style={{ paddingTop: 20 }} Pagetitle={pageTitle} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader}>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Scorecards</Text>
            </View>
          </View>
          <View style={styles.listHeader}>
            <View style={{ flex: 3.5 }}>
              <Text style={styles.listHeaderTitle}>Scorecards</Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Courses</Text>
            </View>
          </View>
          <View style={styles.listItem} wrap>
            <View style={{ flex: 3.5, marginBottom: 5 }}>
              <Text style={styles.listItemFont}>
                {isEmpty(scorecardTitle) ? 'No assigned program.' : scorecardTitle.join(', ')}
              </Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listItemFont}>{length(scorecardQuota)}</Text>
            </View>
          </View>
          {ListQuota(scorecardQuota, 'Scorecard')}
        </View>
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader}>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Programs</Text>
            </View>
          </View>
          <View style={styles.listHeader}>
            <View style={{ flex: 3.5 }}>
              <Text style={styles.listHeaderTitle}>Programs</Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Courses</Text>
            </View>
          </View>
          <View style={styles.listItem} wrap>
            <View style={{ flex: 3.5, marginBottom: 5 }}>
              <Text style={styles.listItemFont}>
                {isEmpty(programTitle) ? 'No assigned scorecard.' : programTitle.join(', ')}
              </Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listItemFont}>{programCourseItems}</Text>
            </View>
          </View>
          {ListQuota(quotas, 'Program')}
        </View>
        <View wrap style={{ display: 'flex' }} break>
          <View style={styles.mainHeader}>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Habit Schedule</Text>
            </View>
          </View>
          <View style={styles.listHeader}>
            <View style={{ flex: 3.5 }}>
              <Text style={styles.listHeaderTitle}>Habit Schedule</Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Habits</Text>
            </View>
          </View>
          <View style={styles.listItem} wrap>
            <View style={{ flex: 0.5 }}>
              <Text style={styles.listHeaderTitle}>Schedules</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={styles.listItemFont}>
                {isEmpty(habitSchedulesTitle) ? 'No assigned habit schedule.' : habitSchedulesTitle.join(', ')}
              </Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listItemFont}>{habitsItem}</Text>
            </View>
          </View>
          {ListHabit(dailyHabits, 'Daily', userId)}
          {ListHabit(weeklyHabits, 'Weekly', userId)}
          {ListHabit(monthlyHabits, 'Monthly', userId)}
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
