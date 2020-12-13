import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import moment from 'moment'
import { isNil, find, propEq } from 'ramda'
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
  listHeaderTitle: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' },
  listItemFont: { fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' },
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

export default function SchedulePdf(props) {
  const { date, schedules, employee } = props
  const startDate = moment(date.start).format('MMM-DD')
  const endDate = moment(date.end).format('MMM-DD')
  const pageTitle = 'Report - Training Schedule'
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          Pagetitle={pageTitle}
          style={{ paddingTop: '20px', paddingBottom: '20px' }}
          date={`${startDate} - ${endDate}`}
          fixed
        />

        {schedules.length === 0 ? (
          <View wrap style={{ display: 'flex', paddingBottom: 20 }}>
            <View style={styles.listHeader} fixed>
              <View style={{ flex: 4, textAlign: 'center' }}>
                <Text style={styles.listHeaderTitle}>No Training Schedule Assigned</Text>
              </View>
            </View>
          </View>
        ) : (
          <View wrap style={{ display: 'flex' }}>
            <View style={styles.mainHeader} fixed>
              <View style={{ flex: 4 }}>
                <Text style={styles.title}>Training Schedule Report</Text>
              </View>
            </View>
            <View style={styles.listHeader} fixed>
              <View style={{ flex: 3.5 }}>
                <Text style={styles.listHeaderTitle}>Schedule</Text>
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.listHeaderTitle}>Manager</Text>
              </View>
              <View style={{ flex: 1, textAlign: 'right' }}>
                <Text style={styles.listHeaderTitle}>StartDate</Text>
              </View>
              <View style={{ flex: 1, textAlign: 'right' }}>
                <Text style={styles.listHeaderTitle}>EndDate</Text>
              </View>
              <View style={{ flex: 0.8, textAlign: 'right', paddingRight: 5 }}>
                <Text style={styles.listHeaderTitle}>Assigned</Text>
              </View>
            </View>
            {schedules.map(function(item, index) {
              const user = find(propEq('id', item.user_id), employee) || {}
              const title = isNil(item.title) ? 'No Schedule Assigned' : item.title
              const started = isNil(item.start_at) ? 'N/A' : moment(item.start_at).format('MMM D,YY')
              const endDate = isNil(item.end_at) ? 'N/A' : moment(item.end_at).format('MMM D,YY')
              let pageBreak = false
              if (pageIndex === 13) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++
              return (
                <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                  <View style={{ flex: 3.5 }}>
                    <Text style={styles.listItemFont}>{title}</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <Text style={styles.listItemFont}>{user.name}</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{started}</Text>
                  </View>
                  <View style={{ flex: 1, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{endDate}</Text>
                  </View>
                  <View style={{ flex: 0.8, textAlign: 'right', paddingRight: '5px' }}>
                    <Text style={styles.listItemFont}>{item.stats.assigned}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        <Text
          fixed
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  ).toBlob()
}
