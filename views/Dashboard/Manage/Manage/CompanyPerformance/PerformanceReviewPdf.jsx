import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import moment from 'moment'
import { equals, isNil, range } from 'ramda'
import { PdfHeader as Header } from '@components'

const styles = StyleSheet.create({
  container: { flexDirection: 'column', paddingLeft: 20, paddingRight: 20, paddingBottom: 20, alignItems: 'stretch' },
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
  ratings: { height: '13px', width: '13px', color: 'black', border: '2px', borderStyle: 'solid' },
  fontStyle2: { fontSize: '10', fontWeight: 'light', fontFamily: 'Roboto' },
  fontStyle3: { fontSize: '10', fontWeight: '500', fontFamily: 'Roboto' },
  titleHead: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Roboto' },
  listTitle: { fontSize: 10, fontWeight: 'normal', fontFamily: 'Roboto' },
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

const rating = scoreRate => {
  const ratingArray = range(0, 5)
  return (
    <View style={{ flex: 1, flexDirection: 'row', textAlign: 'left', display: 'flex-start' }}>
      {ratingArray.map((i, index) => {
        return (
          <Image
            src={i >= Math.ceil(scoreRate) ? '/images/ratings_active.png' : '/images/star.png'}
            key={index + 'rate'}
            style={styles.ratings}
          />
        )
      })}
      <Text style={styles.listTitle}>&nbsp;{scoreRate}</Text>
    </View>
  )
}

const calcInput = (item, startDate, endDate) => {
  if (item.scorecards && item.scorecards.length > 0) {
    const scorecard = item.scorecards[0]
    const quotas = scorecard.quotas
    if (!quotas.length) return 'No Scorecard'
    let sum = 0
    quotas.forEach(_quota => {
      const actuals = _quota.actuals.filter(actual => moment(actual.actual_at).isBetween(startDate, endDate, 'day'))
      if (actuals.length > 0) sum += 1
    })
    const completedDate =
      item.performance && item.performance.completed_at
        ? moment(item.performance.completed_at).format('MM/DD/YY')
        : 'N/A'

    return item.performance && item.performance.status === 2
      ? `Completed\n${completedDate}`
      : `Incomplete\n(${((100 * sum) / quotas.length).toFixed(2)}%)`
  }
  return 'No Scorecard'
}

const showOrgChart = (data, pageIndex) => (
  <>
    <View>
      <Text style={[styles.fontStyle2, { paddingBottom: '10px' }]}>Average Score</Text>
      {rating(data?.stats?.completed_average_star_score?.stars)}
      <Text style={[styles.fontStyle2, { paddingTop: '10px' }]}>
        {data?.stats?.reviews_completed?.count}&#47;{data?.stats?.scorecards?.count}&nbsp;Reviews completed
      </Text>
    </View>
    <View wrap style={{ display: 'flex' }}>
      <View style={styles.listHeader} fixed>
        <View style={{ flex: 4 }}>
          <Text style={styles.fontStyle3}>Department</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.fontStyle3, { textAlign: 'right', paddingRight: '10px' }]}>Team</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle3, { textAlign: 'right', paddingRight: '10px' }]}>Employees</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle3, { textAlign: 'right', paddingRight: '10px' }]}>Completed</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle3]}>Score</Text>
        </View>
      </View>
    </View>

    {data?.departments?.map((item, index) => {
      const { department, totals } = item
      let pageBreak = false
      if (pageIndex === 13) {
        pageBreak = true
        pageIndex = 1
      }
      pageIndex++
      return (
        <View style={styles.listHeader} key={index} wrap break={pageBreak}>
          <View style={{ flex: 4 }}>
            <Text style={styles.fontStyle2}>{department.name || department}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.fontStyle2, { textAlign: 'right', paddingRight: '10px' }]}>0</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>{totals?.employees?.count}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>{totals?.reviews_completed?.count}</Text>
          </View>
          <View style={{ flex: 2, paddingLeft: '10px' }}>{rating(totals?.completed_average_star_score?.stars)}</View>
        </View>
      )
    })}
    <Text
      fixed
      style={styles.pageNumbers}
      render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
    />
  </>
)

export default function PerformanceReviewPdf(props) {
  const { date, data, activeTab } = props
  const startDate = moment(date.start).format('MMM-DD')
  const endDate = moment(date.end).format('MMM-DD')
  const pageTitle = `Reports - Performance ${activeTab}`
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
        {equals(activeTab, 'employees') && (
          <>
            <View style={{ marginLeft: 10, marginRight: 10 }} fixed>
              <View style={{ paddingBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titleHead}>Performance Report</Text>
                </View>
              </View>
              <View style={styles.listHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>Employee</Text>
                </View>
                <View style={{ flex: 1.8 }}>
                  <Text style={styles.listTitle}>ScoreCard</Text>
                </View>
                <View style={{ flex: 1.2 }}>
                  <Text style={styles.listTitle}>Score</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listTitle}>Commitments</Text>
                </View>
                <View style={{ flex: 0.8 }}>
                  <Text style={styles.listTitle}>Status</Text>
                </View>
              </View>
            </View>
            {data.users.map((item, index) => {
              let scorecard = null
              let pageBreak = false
              if (pageIndex === 13) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++
              return (
                <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listItemData}>
                      {`${item.user.profile.first_name} ${item.user.profile.last_name}`}
                    </Text>
                  </View>
                  <View style={{ flex: 1.8 }}>
                    <Text style={styles.listItemData}> {!scorecard ? 'No Scorecard' : scorecard.title}</Text>
                  </View>
                  <View style={{ flex: 1.2 }}>
                    {isNil(item.performance) ? (
                      <Text style={styles.listItemData}>Incomplete</Text>
                    ) : (
                      <Text>
                        {item.performance.status === 2 ? (
                          <Text>
                            {item.performance.data && 'N/A' !== item.performance.data.average_star_rating ? (
                              <Text style={styles.listItemData}>{item.performance.data.average_star_rating}</Text>
                            ) : (
                              <Text style={styles.listItemData}>Na (Per Manager)</Text>
                            )}
                          </Text>
                        ) : (
                          <Text style={styles.listItemData}>Incomplete</Text>
                        )}
                      </Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    {item.performance && item.performance.status !== 2 && (
                      <Text style={styles.listItemData}>Incomplete</Text>
                    )}
                    {item.performance && item.performance.status === 2 && !scorecard && (
                      <Text style={styles.listItemData}>N/A</Text>
                    )}
                    {item.performance && item.performance.status === 2 && scorecard && (
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
                  <View style={{ flex: 0.8 }}>
                    <Text style={styles.listItemData}>{calcInput(item, startDate, endDate)}</Text>
                  </View>
                </View>
              )
            })}
            <Text
              fixed
              style={styles.pageNumbers}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </>
        )}
        {equals(activeTab, 'chart') && showOrgChart(data, pageIndex)}
      </Page>
    </Document>
  ).toBlob()
}
