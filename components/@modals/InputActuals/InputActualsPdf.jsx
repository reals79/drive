import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import { range } from 'ramda'
import moment from 'moment'
import { PdfHeader as Header } from '@components'
import { TARGET_UNIT } from '~/services/config'
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
  checked: {
    height: '14px',
    width: '14px',
  },
  unChecked: {
    height: '16px',
    width: '16px',
  },
  ratings: {
    height: '20px',
    width: '20px',
    color: 'black',
    border: '1px',
    borderStyle: 'solid',
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

export default function InputActualsPdf({ scorecards, date, user, selected, actuals }) {
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle="Input Actuals"
          title={user.name || `${user.profile.first_name} ${user.profile.last_name}`}
          date={moment(date).format('MMM YYYY')}
          fixed
        />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 1 }}>
              <Text style={styles.fontStyle1}>Include</Text>
            </View>
            <View style={{ flex: 5 }}>
              <Text style={styles.fontStyle1}>Quotas</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fontStyle1, { textAlign: 'center' }]}>Target</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fontStyle1, { textAlign: 'center' }]}>Actual</Text>
            </View>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={[styles.fontStyle1, { textAlign: 'center' }]}>Rating</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text style={[styles.fontStyle1, { textAlign: 'left' }]}>Scale</Text>
            </View>
          </View>
          {scorecards.map(scorecard =>
            scorecard.quotas.map((item, index) => {
              if (selected ? selected == item.id : true) {
                const target = item.data.star_values
                  ? item.data.star_values[5]
                  : item.data.quota_target
                const targetUnit = TARGET_UNIT[item.data.target_types]
                const include = actuals[item.id]
                const rating = include.actual ? quotaCalc(item, include.actual) : 0
                const ratingArray = range(0, 5)
                let pageBreak = false
                if (pageIndex == 13) {
                  pageBreak = true
                  pageIndex = 1
                }
                pageIndex++
                return (
                  <View style={styles.listItem} key={index} wrap break={pageBreak}>
                    <View style={{ flex: 1 }}>
                      <Image
                        src={include.checked ? '/images/task-50.png' : '/images/circle.png'}
                        style={include.checked ? styles.checked : styles.unChecked}
                      />
                    </View>
                    <View style={{ flex: 5 }}>
                      <Text style={styles.fontStyle2}>{item.name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fontStyle2, { textAlign: 'center' }]}>
                        {`${target}${targetUnit}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fontStyle2, { textAlign: 'center' }]}>
                        {include.checked ? Number(include.actual).toString() : 'NA'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      {include.checked && (
                        <Text style={[styles.fontStyle2, { textAlign: 'center' }]}>
                          {include.actual ? rating : 'Incomplete'}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
                      {include.checked &&
                        (include.actual
                          ? ratingArray.map((i, index) => (
                              <Image
                                src={
                                  i >= rating ? '/images/ratings_active.png' : '/images/star.png'
                                }
                                key={index}
                                style={styles.ratings}
                              />
                            ))
                          : 'Incomplete')}
                    </View>
                  </View>
                )
              }
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
