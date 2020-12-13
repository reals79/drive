import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import { equals, filter, includes, join, range, values } from 'ramda'
import moment from 'moment'
import { PdfHeader as Header } from '@components'
import { quotaCalc } from '~/services/util'

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
  ratings: {
    height: '13px',
    width: '13px',
    color: 'black',
    border: '2px',
    borderStyle: 'solid',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  checked: {
    height: '14px',
    width: '14px',
  },
  unChecked: {
    height: '16px',
    width: '16px',
  },
  scorecardTitle: {
    paddingTop: '5px',
    PaddingBottom: '10px',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    textTransform: 'capitalize',
  },
  fontStyle1: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
  },
  fontStyle2: {
    fontSize: '10',
    fontWeight: 'light',
    fontFamily: 'Roboto',
  },
  fontStyle3: {
    fontSize: '12',
    fontWeight: 'light',
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

const rating = scoreRate => {
  const ratingArray = range(0, 5)
  return (
    <View style={{ flex: 1, flexDirection: 'row', textAlign: 'left', display: 'flex-start', paddingRight: '10px' }}>
      {ratingArray.map((i, index) => {
        return (
          <Image
            src={i >= Math.ceil(scoreRate) ? '/images/ratings_active.png' : '/images/star.png'}
            key={index + 'rate'}
            style={styles.ratings}
          />
        )
      })}
      {/*<Text style={styles.fontStyle1}>&nbsp;{scoreRate}</Text>*/}
    </View>
  )
}

const MontlyRatingAndQuota = (MonthRate, title) => (
  <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: '15px' }}>
    <View style={{ flex: 6 }} />
    <View style={{ flex: 2 }}>
      <Text style={styles.title}>
        {title} &nbsp;{MonthRate}
      </Text>
    </View>
    <View style={{ flex: 1, textAlign: 'left' }}>{rating(MonthRate)}</View>
  </View>
)

const mainScoreHeader = (userName, activeTab, mainScorecard) => (
  <>
    <Text style={{ fontSize: '14', fontWeight: 'bold', fontFamily: 'Roboto' }}>{userName}</Text>
    <Text style={styles.scorecardTitle}>{activeTab}</Text>
    {activeTab === 'results' && (
      <>
        <Text style={{ fontSize: '14', fontWeight: 'bold', fontFamily: 'Roboto' }}>Scorecard</Text>
        <Text style={{ fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' }}>
          {mainScorecard[0].title} | Assigned: {moment(mainScorecard[0].created_at).format('MMM DD, YY')}
        </Text>
      </>
    )}
  </>
)

const scorecardHeader = activeTab => (
  <View wrap style={{ display: 'flex' }}>
    <View style={styles.listHeader} fixed>
      <View style={{ flex: 2 }}>
        <Text style={styles.fontStyle2}>Incl.</Text>
      </View>
      <View style={{ flex: 6 }}>
        <Text style={styles.fontStyle2}>Quotas</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>Target</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>Actual</Text>
      </View>
      {equals(activeTab, 'results') && (
        <View style={{ flex: 1 }}>
          <Text style={[styles.fontStyle2, { textAlign: 'right', paddingLeft: '10px' }]}>Score</Text>
        </View>
      )}
    </View>
  </View>
)

const scorecardContent = (actuals, item, activeTab) => (
  <View style={styles.listHeader} fixed>
    <View style={{ flex: 2 }}>
      <Image
        src={actuals[item.id].checked ? '/images/task-50.png' : '/images/circle.png'}
        style={actuals[item.id].checked ? styles.checked : styles.unChecked}
      />
    </View>
    <View style={{ flex: 6 }}>
      <Text style={styles.fontStyle3}>{item.name}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>
        {item.data.star_values ? item.data.star_values[5] : item.data.quota_target}
      </Text>
    </View>
    <View style={{ flex: 1 }}>
      {actuals[item.id].checked ? (
        <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>
          {actuals[item.id].actual == '0' ? '0' : Number(actuals[item.id].actual)}
        </Text>
      ) : (
        <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>NA</Text>
      )}
    </View>
    {equals(activeTab, 'results') && rating(actuals[item.id].actual ? quotaCalc(item, actuals[item.id].actual) : 0)}
  </View>
)

const ActualsData = (userName, activeTab, scorecards, progress, actuals, totalscore = 0) => (
  <View>
    {mainScoreHeader(userName, activeTab, scorecards)}
    {scorecardHeader(activeTab)}
    {scorecards.map(scorecard =>
      scorecard.quotas.map((item, index) => {
        const ratings = actuals[item.id].actual ? quotaCalc(item, actuals[item.id].actual) : 0
        if (actuals[item.id].checked) totalscore += Number(ratings)
        return (
          <View wrap style={{ display: 'flex' }} key={index}>
            {scorecardContent(actuals, item, activeTab)}
          </View>
        )
      })
    )}
    <View style={{ textAlign: 'right' }}>
      <Text style={styles.fontStyle3}>Actual Saved :{progress}%</Text>
    </View>
  </View>
)

const ResultCareerData = (userName, activeTab, scorecards, mainScorecard, progress, actuals) => (
  <View>
    <Text style={{ fontSize: '14', fontWeight: 'bold', fontFamily: 'Roboto' }}>Career</Text>
    <Text style={styles.fontStyle2}>
      {mainScorecard[0].title} | Assigned: {moment(mainScorecard[0].created_at).format('MMM DD, YY')}
    </Text>
    <View wrap style={{ display: 'flex' }}>
      <View style={styles.listHeader} fixed>
        <View style={{ flex: 1 }}>
          <Text style={styles.fontStyle2}>Incl.</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={styles.fontStyle2}>Quotas</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>History</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>Target</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>Actual</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>Status</Text>
        </View>
      </View>
    </View>
    {scorecards.map((item, index) => {
      const target = item.data.star_values ? item.data.star_values[5] : item.data.quota_target
      let actual = []
      item.actuals.forEach(item => item.actual && actual.push(Number(item.actual.toString())))

      return (
        <View wrap style={{ display: 'flex' }} key={index}>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 2 }}>
              <Image
                src={actuals[item.id].checked ? '/images/task-50.png' : '/images/circle.png'}
                style={actuals[item.id].checked ? styles.checked : styles.unChecked}
              />
            </View>
            <View style={{ flex: 3 }}>
              <Text style={[styles.fontStyle3, { textAlign: 'left' }]}>{item.name}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>
                {actuals[item.id].checked ? join(', ', actual) : 'NA'}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>
                {actuals[item.id].checked ? target : 'NA'}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>
                {actuals[item.id].checked
                  ? actuals[item.id].actual == '0'
                    ? '0'
                    : Number(actuals[item.id].actual)
                  : 'NA'}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              {item.archived == '2' ? (
                <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>Archived</Text>
              ) : (
                <Text style={[styles.fontStyle3, { textAlign: 'right' }]}>In Progress</Text>
              )}
            </View>
          </View>
        </View>
      )
    })}
    <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: '15px' }}>
      <View style={{ flex: 6 }} />
      <View style={{ flex: 2 }}>
        <Text style={styles.title}>
          Quotas Archived: &nbsp;
          {Number(
            (
              (100 * filter(e => e.archived == '2', values(mainScorecard[0].quotas)).length) /
              mainScorecard[0].quotas.length
            )
              .toFixed(2)
              .toString()
          )}
          %
        </Text>
      </View>
    </View>
  </View>
)

const ResultScoreData = (userName, activeTab, scorecards, progress, actuals, mainScorecard, totalscore = 0) => (
  <View>
    {mainScoreHeader(userName, activeTab, mainScorecard)}
    {scorecardHeader(activeTab)}
    {scorecards.map((item, index) => {
      const ratings = actuals[item.id].actual ? quotaCalc(item, actuals[item.id].actual) : 0
      if (actuals[item.id].checked) totalscore += Number(ratings)
      return (
        <View wrap style={{ display: 'flex' }} key={index}>
          {scorecardContent(actuals, item, activeTab)}
        </View>
      )
    })}
    {MontlyRatingAndQuota(
      Number((totalscore / mainScorecard[0].quotas.length).toFixed(1).toString()),
      'Monthly rating:'
    )}
  </View>
)

export default function SaveActualsdf(pdfData) {
  const { activeTab, date, actuals, scorecards, user } = pdfData

  const userName = user.name || `${user.profile?.first_name} ${user.profile?.last_name}`
  const newDate = moment(date).format('MMM YYYY')
  const checkedItems = filter(e => e.checked && e.actual, values(actuals))
  const progress = Math.round((100 * checkedItems.length) / values(actuals).length)
  const _scorecards = filter(e => includes('Scorecard', e?.source || []), scorecards[0].quotas)
  const _career = filter(e => includes('Career', e?.source || []), scorecards[0].quotas)

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header style={{ paddingTop: 20 }} Pagetitle="Save Actuals" date={`${newDate}`} fixed />
        {equals(activeTab, 'actuals') && ActualsData(userName, activeTab, scorecards, progress, actuals)}
        {equals(activeTab, 'results') &&
          _scorecards.length > 0 &&
          ResultScoreData(userName, activeTab, _scorecards, progress, actuals, scorecards)}
        {equals(activeTab, 'results') &&
          _career.length > 0 &&
          ResultCareerData(userName, activeTab, _career, scorecards, progress, actuals)}
      </Page>
    </Document>
  ).toBlob()
}
