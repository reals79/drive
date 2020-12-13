import React from 'react'
import { Document, Font, pdf, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { split } from 'ramda'
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
  listTitle: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto' },
  listSubItem: { fontSize: '12', fontWeight: 'light', fontFamily: 'Roboto' },
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

export default function QuotaDetailPdf(props) {
  const { date, tab, employeeDetails } = props
  const startDate = moment(date.start).format('MMM DD')
  const endDate = moment(date.end).format('MMM DD')
  const pageTitle = `Reports - Quotas - ${tab}Quotas- QuotaDetail`

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header Pagetitle={pageTitle} style={{ paddingTop: '10px' }} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex' }}>
          <View style={styles.mainHeader} fixed>
            <View style={{ flex: 4 }}>
              <Text style={styles.title}>{employeeDetails.name}</Text>
            </View>
          </View>
          <View style={styles.listHeader} fixed>
            <View style={{ flex: 4, textAlign: 'left' }}>
              <Text style={styles.listTitle}> Employee</Text>
            </View>
            <View style={{ flex: 4, textAlign: 'left' }}>
              <Text style={styles.listTitle}> Assignment</Text>
            </View>
            <View style={{ flex: 3, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Since</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Average</Text>
              <Text style={styles.listTitle}>Actuals</Text>
            </View>
            <View style={{ flex: 3, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Recent</Text>
              <Text style={styles.listTitle}>Actuals</Text>
            </View>
            <View style={{ flex: 2, textAlign: 'right' }}>
              <Text style={styles.listTitle}>Acutal</Text>
            </View>
          </View>
          {employeeDetails?.users?.map((empQuota, index) => (
            <View style={styles.listHeader} fixed key={index}>
              <View style={{ flex: 4, textAlign: 'left' }}>
                <Text style={styles.listSubItem}>
                  {empQuota.profile?.first_name + ' ' + empQuota.profile?.last_name}
                </Text>
              </View>
              <View style={{ flex: 4, textAlign: 'left' }}>
                <Text style={styles.listSubItem}>
                  {empQuota?.quota_source ? split(':', empQuota?.quota_source)[0] : 'Not Assign'}
                </Text>
              </View>
              <View style={{ flex: 3, textAlign: 'right' }}>
                <Text style={styles.listSubItem}>
                  {empQuota.assigned ? moment(empQuota.assigned).format('MMM DD, YYYY') : 'N/A'}
                </Text>
              </View>
              <View style={{ flex: 2, textAlign: 'right' }}>
                <Text style={styles.listSubItem}>{empQuota.actual_average}</Text>
              </View>
              <View style={{ flex: 3, textAlign: 'right' }}>
                <Text style={styles.listSubItem}>
                  {empQuota.last_saved ? moment(empQuota.last_saved).format('MMM, YYYY') : 'N/A'}
                </Text>
              </View>
              <View style={{ flex: 2, textAlign: 'right' }}>
                <Text style={styles.listSubItem}>{empQuota.recent_actual || 0}</Text>
              </View>
            </View>
          ))}
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
