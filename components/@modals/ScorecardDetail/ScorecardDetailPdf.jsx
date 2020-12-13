import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import { range } from 'ramda'
import moment from 'moment'
import { PdfHeader as Header } from '@components'
import { getUnit } from '~/services/util'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    alignItems: 'stretch',
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0px',
    paddingBottom: '3px',
    paddingTop: '10px',
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
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '10px',
    marginRight: '10px',
    marginLeft: '10px',
    borderBottomWidth: 0.25,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: 55,
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
    height: '13px',
    width: '13px',
    color: 'black',
    border: '2px',
    borderStyle: 'solid',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  scorecardTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Roboto',
  },
  fontStyle1: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
  },
  fontStyle2: {
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
const rating = score => {
  const ratingArray = range(0, 5)
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {ratingArray.map((i, index) => {
        return (
          <Image
            src={i >= score ? '/images/ratings_active.png' : '/images/star.png'}
            key={index}
            style={styles.ratings}
          />
        )
      })}
    </View>
  )
}

export default function ScorecardDetailPDf({ data, date }) {
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle="Scorecard Preview"
          date={moment(date.end).format('MMM YYYY')}
          fixed
        />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader} fixed>
            <Text style={styles.scorecardTitle}>{data.title}</Text>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 9 }}>
              <Text style={styles.fontStyle1}>{`Quotas (${data.quotas.length})`}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={[styles.fontStyle1, { textAlign: 'right' }]}>Target</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={[styles.fontStyle1, { textAlign: 'right' }]}>Actual</Text>
            </View>
            <View style={{ flex: 2 }} />
            <View style={{ flex: 3, marginRight: 5 }}>
              <Text style={styles.fontStyle1}>Rating Scale</Text>
            </View>
          </View>
          {data.quotas.map((item, index) => {
            const { quota_direction, star_values, target_types } = item.data
            let pageBreak = false
            if (pageIndex == 8) {
              pageBreak = true
              pageIndex = 1
            }
            pageIndex++
            return (
              <View style={styles.listItem} key={index} wrap break={pageBreak}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fontStyle2}>{index + 1}</Text>
                </View>
                <View style={{ flex: 9 }}>
                  <Text style={styles.fontStyle2}>{item.name}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>
                    {getUnit(quota_direction == 1 ? star_values[5] : star_values[0], target_types)}
                  </Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>
                    {getUnit(star_values[5], target_types)}
                  </Text>
                  <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>
                    {getUnit(star_values[3], target_types)}
                  </Text>
                  <Text style={[styles.fontStyle2, { textAlign: 'right' }]}>
                    {getUnit(star_values[2], target_types)}
                  </Text>
                </View>
                <View style={{ flex: 2 }} />
                <View style={{ flex: 3, marginRight: 5 }}>
                  {rating(5)}
                  {rating(3)}
                  {rating(2)}
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
