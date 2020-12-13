import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isNil, isEmpty, filter, length } from 'ramda'
import { PdfHeader as Header } from '@components'
import { convertAvgDays, inPage, localDate } from '~/services/util'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 25,
    alignItems: 'stretch',
  },
  listHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px',
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
    marginTop: '5px',
    marginRight: '10px',
    marginLeft: '10px',
    minHeight: '50px',
    maxHeight: '100px',
  },
  pageNumbers: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    bottom: 5,
    left: 0,
    right: 0,
    textAlign: 'center',
    margin: '10px',
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    paddingTop: 10,
  },
  textItemStyle: {
    fontSize: '10',
    fontWeight: 'light',
    fontFamily: 'Roboto',
    textAlign: 'right',
  },
  pdBottom: {
    paddingBottom: '5',
  },
  headingTextItemStyle: {
    fontSize: '10',
    fontFamily: 'Roboto',
    textAlign: 'right',
    fontWeight: 'light',
  },
  listHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: '0px',
    paddingBottom: '5px',
    paddingTop: '5px',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  secondaryTextHeading: {
    fontSize: '16px',
  },
  sectionStyle: {
    marginBottom: '20px',
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

const formatStartEnd = (startDate, endDate) => {
  if (isEmpty(startDate) || isNil(endDate)) {
    return
  }
  const st = moment(startDate).format('MMM DD')
  const ed = moment(endDate).format('MMM DD')
  if (!equals(st, ed)) {
    return st + ' - ' + ed
  }
  return st
}

export default function IndividualTaskReportPDF(props) {
  const { data, selected, current, per, startDate, endDate, incompletedTasks, completedTasks, dailyHabits } = props

  const individuals = selected ? filter(e => e.id == selected, data.individuals) : data.individuals

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle="Reports - Tasks - Individual Task Report"
          title="Individual Task Report"
          date={formatStartEnd(startDate, endDate)}
        />

        <View style={{ display: 'flex', paddingBottom: 20, marginTop: 20 }}>
          <View
            wrap={false}
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 0,
              marginLeft: '250',
              marginTop: '10',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ alignSelf: 'flex-end' }}>
              <Text style={{ fontSize: '12', fontWeight: 'bold' }}> Tasks Stats </Text>
            </View>
            <View style={{ alignSelf: 'flex-end', marginRight: '5' }}>
              <Text style={{ fontSize: '12', fontWeight: 'bold' }}> Habits Completion </Text>
            </View>
          </View>
          <View style={styles.listHeader}>
            <View style={{ flex: 5 }}>
              <Text style={[styles.headingTextItemStyle, { textAlign: 'left' }]}></Text>
            </View>

            <View style={{ flex: 4 }}>
              <Text style={styles.headingTextItemStyle}>Assigned for month</Text>
            </View>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 5 }}>
              <Text style={styles.headingTextItemStyle}> Incompl. for month </Text>
            </View>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 4 }}>
              <Text style={styles.headingTextItemStyle}>Compl. for month</Text>
            </View>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 4 }}>
              <Text style={styles.headingTextItemStyle}>Compl. on time</Text>
            </View>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 3 }}>
              <Text style={styles.headingTextItemStyle}>Compl. late</Text>
            </View>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 4 }}>
              <Text style={styles.headingTextItemStyle}>Ave Compl. per day</Text>
            </View>
            <View style={{ flex: 1 }} />

            <View style={{ flex: 4 }}>
              <Text style={styles.headingTextItemStyle}>Ave time to compl.</Text>
            </View>

            <View style={{ flex: 2 }} />
            <View style={{ flex: 3 }}>
              <Text style={styles.headingTextItemStyle}>Daily</Text>
            </View>

            <View style={{ flex: 4 }}>
              <Text style={[styles.headingTextItemStyle, { textAlign: 'center' }]}>Weekly</Text>
            </View>

            <View style={{ flex: 4 }}>
              <Text style={styles.headingTextItemStyle}>Monthly</Text>
            </View>
          </View>
          {individuals.map((item, index) => {
            if (inPage(index, current, per)) {
              return (
                <View style={styles.listItem} key={`taskr${index}`} wrap break={false}>
                  <View style={{ flex: 5 }}>
                    <Text style={{ fontSize: '10', fontWeight: 'light', fontFamily: 'Roboto' }}>{item.name}</Text>
                  </View>

                  <View style={{ flex: 4 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>{item.report.tasks_assigned.count}</Text>
                    <Text style={styles.textItemStyle}>100%</Text>
                  </View>
                  <View style={{ flex: 1 }} />

                  <View style={{ flex: 5 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>{item.report.tasks_incomplete.count}</Text>
                    <Text style={styles.textItemStyle}>{item.report.tasks_incomplete.percent}%</Text>
                  </View>
                  <View style={{ flex: 1 }} />

                  <View style={{ flex: 4 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>{item.report.tasks_completed.count}</Text>
                    <Text style={styles.textItemStyle}>{item.report.tasks_completed.percent}%</Text>
                  </View>
                  <View style={{ flex: 1 }} />

                  <View style={{ flex: 4 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>
                      {item.report.tasks_completed_on_time.count}
                    </Text>
                    <Text style={styles.textItemStyle}>{item.report.tasks_completed_on_time.percent}%</Text>
                  </View>
                  <View style={{ flex: 1 }} />

                  <View style={{ flex: 3 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>
                      {item.report.tasks_completed_late.count}
                    </Text>
                    <Text style={styles.textItemStyle}>{item.report.tasks_completed_late.percent}%</Text>
                  </View>
                  <View style={{ flex: 1 }} />

                  <View style={{ flex: 4 }}>
                    <Text style={styles.textItemStyle}>{item.report.avg_completions_per_day.toFixed(2)}</Text>
                  </View>
                  <View style={{ flex: 1 }} />

                  <View style={{ flex: 4 }}>
                    <Text style={styles.textItemStyle}>{convertAvgDays(item.report.avg_days.count)}</Text>
                  </View>
                  <View style={{ flex: 2 }} />

                  <View style={{ flex: 3 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>{item.report.daily_completion.complete}</Text>
                    <Text style={styles.textItemStyle}>{item.report.daily_completion.percent}%</Text>
                  </View>

                  <View style={{ flex: 4 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>
                      {item.report.weekly_completion.complete}
                    </Text>
                    <Text style={styles.textItemStyle}>{item.report.weekly_completion.percent}%</Text>
                  </View>

                  <View style={{ flex: 4 }}>
                    <Text style={[styles.textItemStyle, styles.pdBottom]}>
                      {item.report.monthly_completion.complete}
                    </Text>
                    <Text style={styles.textItemStyle}>{item.report.monthly_completion.percent}%</Text>
                  </View>
                </View>
              )
            }
          })}
        </View>

        <View style={styles.sectionStyle}>
          <Text style={{ fontSize: '16', fontWeight: 800, marginBottom: 10 }}>Incomplete Tasks</Text>
          <View style={{ display: 'flex', paddingBottom: 5 }}>
            <View style={styles.listHeader}>
              <View style={{ flex: 13 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Task name</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Category</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Due date</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Status</Text>
              </View>
            </View>
          </View>
          {length(incompletedTasks) > 0 &&
            incompletedTasks.map((item, index) => {
              return (
                <View style={{ display: 'flex', padding: 5 }} key={`individual-task-incompleted${index}`}>
                  <View style={styles.listHeader}>
                    <View style={{ flex: 13, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {item.data.name}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {item.project.name}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {localDate(item.data.due_date, 'MMM DD, YY')}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>past due</Text>
                    </View>
                  </View>
                </View>
              )
            })}
        </View>

        <View style={styles.sectionStyle}>
          <Text style={{ fontSize: '16', fontWeight: 800, marginBottom: 10 }}>Completed Tasks</Text>
          <View style={{ display: 'flex', paddingBottom: 5 }}>
            <View style={styles.listHeader}>
              <View style={{ flex: 13 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Task name</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Category</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Due date</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Status</Text>
              </View>
            </View>
          </View>
          {length(completedTasks) > 0 &&
            completedTasks.map((item, index) => {
              return (
                <View style={{ display: 'flex', padding: 5 }} key={`individual-task-completed${index}`}>
                  <View style={styles.listHeader}>
                    <View style={{ flex: 13, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {item.data.name}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {item.project.name}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {localDate(item.data.due_date, 'MMM DD, YY')}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>past due</Text>
                    </View>
                  </View>
                </View>
              )
            })}
        </View>

        <View style={styles.sectionStyle}>
          <Text style={{ fontSize: '16', fontWeight: 800, marginBottom: 10 }}> Daily Habits </Text>
          <View style={{ display: 'flex', paddingBottom: 5 }}>
            <View style={styles.listHeader}>
              <View style={{ flex: 13 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Task name</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Category</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Assigned</Text>
              </View>
              <View style={{ flex: 3 }}>
                <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Completed</Text>
              </View>
            </View>
          </View>
          {length(dailyHabits) > 0 &&
            dailyHabits.map((item, index) => {
              return (
                <View style={{ display: 'flex', padding: 5 }} key={`individual-task-daily-habit${index}`}>
                  <View style={styles.listHeader}>
                    <View style={{ flex: 13, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
                        {item.data.name}
                      </Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Daily</Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>Manager</Text>
                    </View>
                    <View style={{ flex: 3, paddingBottom: 5 }}>
                      <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>72%</Text>
                    </View>
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
