import React from 'react'
import { Document, Font, pdf, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { isEmpty, isNil } from 'ramda'
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
    margin: '10px 10px 0 10px',
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
    marginTop: '10px',
    marginRight: '10px',
    marginLeft: '10px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
    minHeight: 30,
    maxHeight: 50,
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
  listItemFont: { fontSize: '10', fontWeight: 'light', fontFamily: 'Roboto' },
  listTitle: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' },
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

export default function CompanyQuotaPdf(props) {
  const {
    quotaReports: { quota_templates },
    type,
    date,
  } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const titleType = type == 'scorecard' ? 'Scorecard ' : type == 'program' ? 'Program ' : ''
  const pageTitle = `Reports - Quotas - ${titleType}Quotas`
  let pageIndex = 1
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header Pagetitle={pageTitle} style={{ paddingTop: '10px' }} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>Actuals</Text>
            </View>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 5 }}>
              <Text style={styles.listTitle}>Quotas</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Employees</Text>
              <Text style={styles.listTitle}>Assigned</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Actuals</Text>
              <Text style={styles.listTitle}>Saved</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>% Actuals</Text>
              <Text style={styles.listTitle}>Saved</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Low</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>High</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right', paddingRight: 5 }}>
              <Text style={styles.listTitle}>Average</Text>
            </View>
          </View>
          {isNil(quota_templates) || isEmpty(quota_templates) ? (
            <View style={{ flex: 4, textAlign: 'center' }}>
              <Text style={styles.listItemFont}>No programs assigned.</Text>
            </View>
          ) : (
            quota_templates?.map((quota, index) => {
              const { name, data, users, actual_count } = quota
              const { actual_saved_percentage, high, low, average } = data
              let pageBreak = false
              if (pageIndex === 13) {
                pageBreak = true
                pageIndex = 1
              }
              pageIndex++
              return (
                <View style={styles.listItem} key={`crd${index}`} wrap break={pageBreak}>
                  <View style={{ flex: 5 }}>
                    <Text style={styles.listItemFont}>{name}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{users.length || 'NA'}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{actual_count || 0}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{Number(actual_saved_percentage).toFixed(2) || 'NA'}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{Number(low).toFixed(2) || 'NA'}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right' }}>
                    <Text style={styles.listItemFont}>{Number(high).toFixed(2) || 'NA'}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: 'right', paddingRight: 5 }}>
                    <Text style={styles.listItemFont}>{Number(average).toFixed(2) || 'NA'}</Text>
                  </View>
                </View>
              )
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
