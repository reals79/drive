import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import { filter, range, values } from 'ramda'
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
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    paddingBottom: '10px',
    paddingTop: '10px',
    borderBottomWidth: 0.25,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
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
  ratings: {
    height: '10px',
    width: '10px',
    color: 'black',
    border: '1px',
    borderStyle: 'solid',
    textAlign: 'left',
  },
  fontStyle1: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    paddingBottom: '5px',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
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
      <Text>&nbsp;{scoreRate}</Text>
    </View>
  )
}

export default function IndividualPerformancePdf(pdfData) {
  const { user, company, startDate, endDate, data, lastReviewState, individualPerformanceReview } = pdfData
  const { totals } = individualPerformanceReview

  let pageIndex = 1
  const reviews = filter(item => moment(item.date_start).isBetween(startDate, endDate, null, '[]'), data.data)
  const priorReview = values(reviews[0]?.data?.scorecards)[0] || {}
  const dateStart = moment(startDate).format('MMM DD')
  const dateEnd = moment(endDate).format('MMM DD')
  const lastReview = lastReviewState
    ? moment(lastReviewState).isBefore(user?.feed?.created_at)
      ? 'NA'
      : moment(lastReviewState).format('MMM D,YYYY')
    : 'NA'
  const recentReview =
    reviews[0]?.status === 2 ? reviews[0]?.data?.completed_average_star_rating : reviews[0]?.prior_score

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header style={{ paddingTop: 20 }} Pagetitle={user.name} date={`${dateStart} - ${dateEnd}`} />
        <View style={{ paddingBottom: 18 }}>
          <Text style={styles.title}>Performance History Report</Text>
        </View>
        <Text style={styles.fontStyle1}>Company: {company.name}</Text>
        <View style={[styles.fontStyle1, { display: 'flex', flexDirection: 'row' }]}>
          <View>
            <Text style={{ marginRight: '80px', paddingBottom: '5px' }}>
              ScoreCard: {priorReview ? priorReview.title : 'Na'}
            </Text>
            <Text style={{ paddingBottom: '10px' }}>Recent review: {lastReview}</Text>
          </View>
          <View style={{ flex: 2 }}>
            {reviews.length &&
            !moment(reviews[0]?.date_start).isBefore(user?.feed?.created_at) &&
            lastReview !== 'NA' ? (
              <>
                <View style={{ display: 'flex', flexDirection: 'row', marginRight: '50px' }}>
                  <Text style={styles.fontStyle1}>Recent Review:</Text>
                  {recentReview == 'N/A' || recentReview == undefined ? (
                    <Text style={styles.fontStyle1}>&nbsp;N/A</Text>
                  ) : (
                    rating(recentReview)
                  )}
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={styles.fontStyle1}>Average Review:</Text>
                  {totals?.average_star_rating == 'N/A' ? (
                    <Text style={styles.fontStyle1}>&nbsp;N/A</Text>
                  ) : (
                    rating(totals?.average_star_rating)
                  )}
                </View>
              </>
            ) : (
              <>
                <Text>Recent Review: Na </Text>
                <Text> Average Review: Na </Text>
              </>
            )}
          </View>
        </View>
        <View>
          <View style={{ paddingBottom: 18 }}>
            <Text style={styles.title}>Prior Reviews</Text>
          </View>
          <View wrap style={{ display: 'flex' }}>
            <View style={styles.listHeader} fixed>
              <View style={{ flex: 1, maxWidth: '22%' }}>
                <Text style={styles.fontStyle1}>Date</Text>
              </View>
              <View style={{ flex: 4, maxWidth: '32%' }}>
                <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>Scorecard</Text>
              </View>
              <View style={{ flex: 2, maxWidth: '26%' }}>
                <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>Score</Text>
              </View>
              <View style={{ flex: 2, maxWidth: '18%' }}>
                <Text style={styles.fontStyle1}>Commitments</Text>
              </View>
              <View style={{ flex: 1, maxWidth: '22%' }}>
                <Text style={[styles.fontStyle1, { textAlign: 'right' }]}>Status</Text>
              </View>
            </View>
          </View>

          {reviews.length ? (
            reviews.map((item, index) => {
              const rate = item?.data?.average_star_rating
              const scorecard = item.data?.scorecards ? values(item.data.scorecards)[0] : null
              let pageBreak = false
              if (pageIndex == 10) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++

              return (
                <View wrap style={{ display: 'flex' }} key={index} break={pageBreak}>
                  <View style={styles.listHeader} fixed>
                    <View style={{ flex: 1, maxWidth: '22%' }}>
                      <Text style={styles.listItemData}>{moment(item.date_start).format('MMMM YYYY')}</Text>
                    </View>
                    {moment(item.date_start).isBefore(user?.feed?.created_at) ? (
                      <View>
                        <Text style={styles.listItemData}>Not Employed</Text>
                      </View>
                    ) : (
                      <>
                        <View style={{ flex: 4, maxWidth: '32%' }}>
                          <Text style={[styles.listItemData, { textAlign: 'left' }]}>
                            {moment(item.date_start).isBefore(user?.feed?.created_at) ? (
                              <Text style={styles.listItemData}>Not Employed</Text>
                            ) : (
                              <Text style={styles.listItemData}>{scorecard ? scorecard.title : 'No Scorecard'}</Text>
                            )}
                          </Text>
                        </View>
                        <View style={{ flex: 2, maxWidth: '26%' }}>
                          <View style={[styles.listItemData, { textAlign: 'left' }]}>
                            {item.status == 2 ? (
                              <>
                                {item?.data?.average_star_rating && rate !== 'N/A' ? (
                                  rating(item?.data?.average_star_rating)
                                ) : (
                                  <Text style={[styles.listItemData, { textAlign: 'left' }]}>Na (Per Manager)</Text>
                                )}
                                {item?.data?.average_star_rating === undefined && (
                                  <Text style={styles.listItemData}>Incomplete</Text>
                                )}
                              </>
                            ) : (
                              <Text style={styles.listItemData}>Incomplete</Text>
                            )}
                          </View>
                        </View>
                        <View style={{ flex: 2, maxWidth: '18%' }}>
                          {item.status == 2 ? (
                            <View wrap style={{ display: 'flex', flexDirection: 'row' }}>
                              <Text style={styles.listItemData}>
                                <Image src="/images/icons/graduation.png" />
                                <Text>&nbsp;{item.trainings ? item.trainings.length : 'Na'}&nbsp;</Text>
                              </Text>
                              <Text style={styles.listItemData}>
                                <Image src="/images/icons/check_circle.png" />
                                <Text>&nbsp;{item.tasks ? item.tasks.length : 'Na'}</Text>
                              </Text>
                            </View>
                          ) : (
                            <Text style={[styles.listItemData, { textAlign: 'left' }]}>Incomplete</Text>
                          )}
                        </View>
                        <View style={{ flex: 1, maxWidth: '22%' }}>
                          <Text style={[styles.listItemData, { textAlign: 'right' }]}>
                            {item.status == 2 ? (
                              <>
                                {item.data && item.data.scorecards ? (
                                  <Text style={styles.listItemData}>
                                    Completed{`\n`}
                                    {moment(item.completed_at).format('MMM DD,YY')}
                                  </Text>
                                ) : (
                                  <Text style={styles.listItemData}>No Scorecard</Text>
                                )}
                              </>
                            ) : (
                              <Text style={styles.listItemData}>Incomplete</Text>
                            )}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              )
            })
          ) : (
            <Text>No Review</Text>
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
