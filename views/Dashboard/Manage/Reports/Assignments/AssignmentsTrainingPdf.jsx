import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isNil, length, isEmpty } from 'ramda'
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
    minHeight: '45px',
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
  textLineThrough: { textDecoration: 'line-through' },
  textLineNone: { textDecoration: 'none' },
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

const FeedList = (course, user) => {
  const { data, program_id, assigned_by, archived, due_at } = course
  const { child_count, completed } = data
  const dueDate = moment(due_at).format('MMM D')
  let status = ''
  if (equals(child_count, 0) || equals(completed, 0)) {
    status = 'Not Started'
  } else if (equals(child_count, completed)) {
    status = 'Completed'
  } else {
    status = 'In Progress'
  }
  const completionStatus = equals(child_count, completed)
  return (
    <View style={styles.listItem}>
      <View style={{ flex: 3.5, marginBottom: 5 }}>
        <Text style={[styles.listItemFont, completionStatus ? styles.textLineThrough : styles.textLineNone]}>
          {data.name}
        </Text>
        <Text style={styles.listHeaderTitle}>
          Assigned:
          {isNil(program_id) ? (equals(assigned_by, user) ? ' Self ' : ' Manager ') : ` Carrer`}
        </Text>
      </View>
      <View style={{ flex: 1.5, textAlign: 'right' }}>
        <Text style={styles.listItemFont}>{child_count || 0}</Text>
      </View>
      <View style={{ flex: 1, textAlign: 'right' }}>
        <Text style={styles.listItemFont}>{completed}</Text>
      </View>
      <View style={{ flex: 1, textAlign: 'right' }}>
        <Text style={styles.listItemFont}>{dueDate}</Text>
      </View>
      <View style={{ flex: 1.5, marginLeft: 20 }}>
        <Text style={styles.listItemFont}>{status}</Text>
      </View>
    </View>
  )
}

export default function AssignmentsTrainingPdf(props) {
  const { date, tracks, schedules, assignments, trainings, userId } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = 'Reports - Assignments - Training'
  let pageIndex = 1
  let scheduleTitle = []
  let trackCoursesTitle = []
  let scheduleCourses = 0
  let trackCourses = 0
  schedules.map(schedule => {
    const { title, data } = schedule
    scheduleCourses += isNil(data.cards) ? 0 : length(data.cards)
    scheduleTitle.push(title)
  })
  tracks.map(track => {
    const { title, data } = track
    trackCourses += isNil(data.cards) ? 0 : length(data.cards)
    trackCoursesTitle.push(title)
  })

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header style={{ paddingTop: 20 }} Pagetitle={pageTitle} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader}>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Schedules & Tracks</Text>
            </View>
          </View>
          <View style={styles.listHeader}>
            <View style={{ flex: 3.5 }}>
              <Text style={styles.listHeaderTitle}>Schedules & Tracks</Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Courses</Text>
            </View>
          </View>
          <View style={styles.listItem} wrap>
            <View style={{ flex: 0.5 }}>
              <Text style={styles.listHeaderTitle}>Schedules</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={styles.listItemFont}>
                {isEmpty(scheduleTitle) ? 'No assigned schedule.' : scheduleTitle.join(', ')}
              </Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listItemFont}>{scheduleCourses}</Text>
            </View>
          </View>
          <View style={styles.listItem} wrap>
            <View style={{ flex: 0.5 }}>
              <Text style={styles.listHeaderTitle}>Tracks</Text>
            </View>
            <View style={{ flex: 3, marginBottom: 10 }}>
              <Text style={styles.listItemFont}>
                {isEmpty(trackCoursesTitle) ? 'No assigned tracks.' : trackCoursesTitle.join(', ')}
              </Text>
            </View>
            <View style={{ flex: 0.5, textAlign: 'right' }}>
              <Text style={styles.listItemFont}>{trackCourses}</Text>
            </View>
          </View>
        </View>
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Courses</Text>
            </View>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 3.5 }}>
              <Text style={styles.listHeaderTitle}>Courses</Text>
            </View>
            <View style={{ flex: 1.5, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Modules</Text>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Compl.</Text>
            </View>
            <View style={{ flex: 1, textAlign: 'right' }}>
              <Text style={styles.listHeaderTitle}>Due</Text>
            </View>
            <View style={{ flex: 1.5, marginLeft: 20 }}>
              <Text style={styles.listHeaderTitle}>Status</Text>
            </View>
          </View>
          {assignments.map((card, index) => {
            let pageBreak = false
            if (pageIndex === 8 && index === 7) {
              pageBreak = true
              pageIndex = 1
            } else if (pageIndex === 12) {
              pageBreak = true
              pageIndex = 1
            }
            pageIndex++
            return (
              <View key={`crd${card.id}`} break={pageBreak}>
                {FeedList(card, userId)}
              </View>
            )
          })}
          {trainings.map((card, index) => {
            let pageBreak = false
            if (pageIndex === 8 && index === 7) {
              pageBreak = true
              pageIndex = 1
            } else if (pageIndex === 12) {
              pageBreak = true
              pageIndex = 1
            }
            pageIndex++
            return (
              <View key={`crd${card.id}`} break={pageBreak}>
                {FeedList(card, userId)}
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
