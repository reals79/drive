import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import { equals, find, findLast, isNil, propEq, range } from 'ramda'
import moment from 'moment'
import { PdfHeader as Header } from '@components'
import { arrangeQuota, getUnit } from '~/services/util'
import { QuotaCalcs } from '~/services/config'

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
    marginBottom: '10px',
    paddingBottom: '10px',
    paddingTop: '10px',
    borderBottomWidth: 0.25,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  checked: {
    height: '14px',
    width: '14px',
  },
  unChecked: {
    height: '16px',
    width: '16px',
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
  fontStyle2: {
    fontSize: '10',
    fontWeight: 'light',
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
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

const calcDetail = (quota, now) => {
  const { quota_calculation } = quota.data
  const startDate = moment(now.start)
    .startOf('month')
    .format('YYYY-MM-DD')
  const endDate = moment(now.end)
    .endOf('month')
    .format('YYYY-MM-DD')
  const actual = findLast(x => moment(x.actual_at).isBetween(startDate, endDate))(quota.actuals)
  let calculation = null
  if (quota_calculation == QuotaCalcs.MONTH || quota_calculation == QuotaCalcs.QUARTER) {
    if (isNil(quota.calculation.months) || isNil(actual)) {
      calculation = null
    } else {
      calculation = quota.calculation.months[actual.actual_at]
    }
  } else if (quota_calculation === QuotaCalcs.TOTAL) {
    calculation = isNil(quota.calculation.total) ? null : quota.calculation.total
  }

  const actualValue = actual ? actual.actual : 0
  const data = actual ? actual.data : null
  const starRating = calculation ? calculation.star_rating : 0
  return { starRating, actualValue, data, incomplete: isNil(actual) }
}

const headerTitle = title => (
  <View style={{ paddingBottom: 18 }}>
    <Text style={styles.title}>{title}</Text>
  </View>
)

const headerData = (name, job, hire, manager, review, performance, avgStars) => (
  <>
    <Text style={[styles.fontStyle1, { paddingBottom: 10 }]}>{name}</Text>
    <Text style={styles.fontStyle1}>Role:{job}</Text>
    <View style={[styles.fontStyle1, { display: 'flex', flexDirection: 'row' }]}>
      <View>
        <Text style={{ marginRight: '80px', paddingBottom: '5px' }}>HireDate: {moment(hire).format('M/D/YYYY')}</Text>
        <Text style={{ paddingBottom: '10px' }}>
          Supervisor: {manager ? `${manager.profile.first_name} ${manager.profile.last_name}` : 'Na'}
        </Text>
      </View>
      <View style={{ flex: 2 }}>
        {review.length ? (
          <>
            <View style={{ display: 'flex', flexDirection: 'row', marginRight: '50px' }}>
              <Text style={styles.fontStyle1}>Prior Review::</Text>
              {rating(review[0].data ? reviews[0].prior_score : 0)}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={styles.fontStyle1}>YTD Review:</Text>
              {rating(avgStars)}
            </View>
          </>
        ) : (
          <>
            <View style={{ display: 'flex', flexDirection: 'row', marginRight: '50px' }}>
              <Text style={styles.fontStyle1}>Prior Review::</Text>
              {rating(performance.data ? performance.prior_score : 0)}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={styles.fontStyle1}>YTD Review:</Text>
              {rating(performance.data ? performance.data.ytd_star_rating : 0)}
            </View>
          </>
        )}
      </View>
    </View>
  </>
)

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
      <Text style={styles.fontStyle1}>&nbsp;{scoreRate}</Text>
    </View>
  )
}

const scorecardTitle = (title, mainHeader) => (
  <>
    {headerTitle(mainHeader)}
    <View>
      <Text style={styles.fontStyle2}>{title}</Text>
    </View>
    <View wrap style={{ display: 'flex' }}>
      <View style={styles.listHeader} fixed>
        <View style={{ flex: 1, marginRight: '10px' }}>
          <Text style={styles.fontStyle1}>Include</Text>
        </View>
        <View style={{ flex: 4 }}>
          <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>Quota</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>Target</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fontStyle1}>Actual</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>Rating</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.fontStyle1, { textAlign: 'right' }]}>Comment</Text>
        </View>
      </View>
    </View>
  </>
)

const scorecardData = (scorecards, selectedMonth, newLimit, subtitle, mainHeader) =>
  scorecards.map((item, index) => {
    const quotas = item.quotas

    return (
      <View key={`quota${index}`}>
        {scorecardTitle(subtitle ? subtitle : item.title, mainHeader)}
        {quotas.map((quota, index) => {
          const { starRating, actualValue, data, incomplete } = calcDetail(quota, selectedMonth)
          if (newLimit < 3 && isNil(actualValue)) return null
          if (starRating < newLimit) {
            const stars = arrangeQuota(quota.data.star_values, quota.data.quota_direction)
            return (
              <View wrap style={{ display: 'flex' }} key={`q${index}`}>
                <View fixed style={styles.listHeader}>
                  <View style={{ flex: 1 }}>
                    <Image
                      src={actualValue !== null ? '/images/task-50.png' : '/images/circle.png'}
                      style={actualValue !== null ? styles.checked : styles.unChecked}
                    />
                  </View>
                  <View style={{ flex: 4 }}>
                    <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>{quota.name}</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>
                      {getUnit(stars[0].value, quota.data.target_types)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>
                      {isNil(actualValue) ? 'NA' : getUnit(actualValue, quota.data.target_types)}
                    </Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    {incomplete ? (
                      <Text style={styles.fontStyle1}>Incomplete</Text>
                    ) : (
                      <>{actualValue ? rating(starRating) : <Text style={styles.fontStyle1}>NA</Text>}</>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fontStyle1, { textAlign: 'right', paddingRight: '4px' }]}>
                      {data && data.comments ? data.comments.length : 0}
                    </Text>
                  </View>
                </View>
              </View>
            )
          }
          return null
        })}
      </View>
    )
  })

const monthRating = (quota, selectedMonth, index) => {
  const limit = 6
  let quotaLength = 0

  let totalRating = 0
  quota.forEach(quota => {
    const { starRating, actualValue } = calcDetail(quota, selectedMonth)
    if (actualValue && !isNil(starRating) && starRating < limit) {
      totalRating += starRating
      quotaLength += 1
    }
  })
  const score = quotaLength === 0 ? 0 : (totalRating / quotaLength).toFixed(1)
  return (
    <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: '15px' }} key={`mn${index}`}>
      <View style={{ flex: 6 }} />
      <View style={{ flex: 2 }}>
        <Text style={styles.title}>Monthly rating: &nbsp;</Text>
      </View>
      <View style={{ flex: 1, textAlign: 'left' }}>{rating(score)}</View>
    </View>
  )
}

const taskData = (tasks, user, projects) => (
  <View>
    {headerTitle('Plan: Tasks & Training')}
    <View style={{ paddingBottom: 18 }}>
      <Text style={styles.fontStyle2}>Tasks</Text>
    </View>
    {tasks && tasks.length !== 0 ? (
      tasks.map((task, index) => {
        const { data, status, project_id } = task
        const { name, due_date } = data
        const dueDate = moment.unix(due_date).format('M/D/YY')
        const project = find(propEq('id', project_id), projects)
        let type = isNil(project_id) ? 'General' : (project && project.name) || 'General'
        const completed = equals(status, 3)

        if (task.user_id === user.id) {
          return (
            <View key={`task${index}`}>
              <View fixed style={styles.listHeader}>
                <View style={{ flex: 1 }}>
                  <Image
                    src={completed ? '/images/task-50.png' : '/images/circle.png'}
                    style={completed ? styles.checked : styles.unChecked}
                  />
                </View>
                <View style={{ flex: 4 }}>
                  <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>{type}</Text>
                  <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>{name}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>{dueDate}</Text>
                </View>
              </View>
            </View>
          )
        }
      })
    ) : (
      <View>
        <Text style={[styles.fontStyle1, { paddingBottom: '10px', paddingTop: '10px' }]}>No Task Available</Text>
      </View>
    )}
  </View>
)

const coachingNotes = note => (
  <View style={{ paddingBottom: '10px' }}>
    {headerTitle('Coaching Notes:')}
    <Text style={[styles.fontStyle1, { paddingBottom: '10px' }]}>{note ? note : 'No coaching notes were saved.'}</Text>
  </View>
)

const trainingData = (trainings, users) => (
  <View wrap break style={{ paddingBottom: 18 }}>
    <View>
      <Text style={[styles.fontStyle2, { paddingBottom: '18', marginTop: '10px' }]}>Training</Text>
    </View>
    {trainings && trainings.length !== 0 ? (
      trainings.map((training, index) => {
        const { data, status, due_at, user_id } = training
        const { name, due_date } = data
        const completed = equals(status, 3)
        const dueDate = isNil(due_at) ? moment.unix(due_date).format('M/D/YY') : moment(due_at).format('M/D/YY')
        const user = find(propEq('id', user_id), users) || {}

        if (training.user_id === user.id) {
          return (
            <View key={`training${index}`}>
              <View fixed style={styles.listHeader}>
                <View style={{ flex: 1 }}>
                  <Image
                    src={completed ? '/images/task-50.png' : '/images/circle.png'}
                    style={completed ? styles.checked : styles.unChecked}
                  />
                </View>
                <View style={{ flex: 4 }}>
                  <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>{name}</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>{dueDate}</Text>
                </View>
              </View>
            </View>
          )
        }
      })
    ) : (
      <View>
        <Text style={[styles.fontStyle1, { paddingBottom: '10px', paddingTop: '10px' }]}>No Training Available</Text>
      </View>
    )}
  </View>
)

const agreeSubData = (data, title) => (
  <View wrap break style={{ paddingBottom: 18 }}>
    <Text style={[styles.fontStyle2, { paddingBottom: 10 }]}>{title}</Text>
    <Text style={[styles.fontStyle1, { marginLeft: 25 }]}>{data.name}</Text>
    <View style={[styles.fontStyle1, { display: 'flex', flexDirection: 'row' }]}>
      <Text style={[styles.fontStyle1, { marginRight: 10 }]}>Date :</Text>
      <Text style={styles.fontStyle1}>
        {moment
          .utc(data.time)
          .local()
          .format('MMM DD YY')}
      </Text>
    </View>
    <View style={[styles.fontStyle1, { display: 'flex', flexDirection: 'row' }]}>
      <Text style={[styles.fontStyle1, { marginRight: 10 }]}>Time :</Text>
      <Text style={styles.fontStyle1}>
        {moment
          .utc(data.time)
          .local()
          .format('hh: mm A')}
      </Text>
    </View>
    <View style={[styles.fontStyle1, { display: 'flex', flexDirection: 'row' }]}>
      <Text style={[styles.fontStyle1, { marginRight: 20 }]}>IP : </Text>
      <Text style={styles.fontStyle1}>{data.ip}</Text>
    </View>
  </View>
)

const agreedData = agreed => (
  <View>
    {headerTitle('Agreed:')}
    <View style={[styles.fontStyle1, { display: 'flex', flexDirection: 'row' }]}>
      <View style={{ flex: 2 }}>{agreeSubData(agreed.supervisor, 'Supervisor')}</View>
      <View style={{ flex: 2 }}>{agreeSubData(agreed.employee, 'Employee')}</View>
    </View>
  </View>
)

export default function IndividualMonthPdf(pdfData) {
  const { avgStars, completed, data, manager, note, projects, reviews, selectedMonth, user, users } = pdfData
  const { performance, scorecards } = data
  const { tasks, trainings } = performance
  const agreed = performance.data.agreed

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header style={{ paddingTop: 20 }} Pagetitle="Performance Review" />
        <View>
          {headerTitle('Performance Review')}
          {headerData(
            `${user.profile.first_name} ${user.profile.last_name}`,
            user.job.name,
            user.hired_at,
            manager,
            reviews,
            performance,
            avgStars
          )}
          {scorecardData(scorecards, selectedMonth, 6, '', 'Scorecard')}
          <View>{scorecards.map((quota, index) => monthRating(quota.quotas, selectedMonth, index))}</View>
          {scorecardData(scorecards, selectedMonth, 2, 'Quotas Below Minimum', 'Coaching Worksheet')}
          {coachingNotes(note)}
          {taskData(reviews.tasks && reviews.tasks.length !== 0 ? reviews.tasks : tasks, user, projects)}
          {trainingData(reviews.trainings && reviews.trainings.length !== 0 ? reviews.trainings : trainings, users)}
          {completed && agreed && agreedData(agreed)}
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
