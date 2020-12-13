import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf } from '@react-pdf/renderer'
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
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: '9px 10px 0px 10px',
    paddingBottom: '10px',
    paddingTop: '3px',
    borderBottomWidth: 1.3,
    borderBottomColor: 'gray',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginLeft: 10,
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
    minHeight: 35,
    maxHeight: 100,
  },
  emptyStyle: {
    flex: 2,
    fontSize: '12',
    fontWeight: 'light',
    fontFamily: 'Roboto',
    textAlign: 'center',
    paddingBottom: '5px',
    paddingTop: '5px',
  },
  listDisplayFlex2: {
    flex: 2,
  },
  fontStyleHead4: {
    fontSize: '10',
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    textAlign: 'right',
  },
  fontStyle4: {
    fontSize: '12',
    fontWeight: 'light',
    fontFamily: 'Roboto',
    textAlign: 'right',
  },
  fontStyleHead5: { fontSize: '10', fontWeight: 'normal', fontFamily: 'Roboto', textAlign: 'left' },
  fontStyle5: {
    fontSize: '12',
    fontWeight: 'light',
    fontFamily: 'Roboto',
    textAlign: 'left',
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

const getTableData = (title, data, pageIndex, page) => {
  return (
    <View style={{ marginBottom: '15px' }} wrap break={page}>
      <View fixed style={{ paddingBottom: 3 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View fixed style={styles.tableHeader}>
        <View style={{ flex: 6 }}>
          <Text style={styles.fontStyleHead5}>Training</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Modules</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Completed</Text>
        </View>
        <View style={styles.listDisplayFlex2}>
          <Text style={styles.fontStyleHead4}>Past Due</Text>
        </View>
      </View>
      {data.length > 0 ? (
        data.map((item, index) => {
          let pageBreak = false
          if (pageIndex % 9 == 0 && pageIndex !== 0 && index !== 0) {
            pageBreak = true
          }
          pageIndex++
          const { data, children_complete, children_past_due } = item
          const { child_count, name } = data
          return (
            <View key={index} style={styles.listItem} break={pageBreak}>
              <View style={{ flex: 6 }}>
                <Text style={styles.fontStyle5}>{name}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{child_count || 0}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{children_complete}</Text>
              </View>
              <View style={styles.listDisplayFlex2}>
                <Text style={styles.fontStyle4}>{children_past_due}</Text>
              </View>
            </View>
          )
        })
      ) : (
        <Text style={styles.emptyStyle}>There is no assigned training to show</Text>
      )}
    </View>
  )
}

export default function TrainingCompetencyPdf(props) {
  const { date, activeTab, process, skills, productKnowledge, temperment } = props
  const startDate = moment(date.start).format('MMM-DD')
  const endDate = moment(date.end).format('MMM-DD')
  const title =
    activeTab === 'overall'
      ? 'Total Assigned'
      : activeTab === 'career'
      ? 'Career'
      : activeTab === 'manager'
      ? 'Manager'
      : 'Self'
  const pageTitle = `Reports - Training Competency - ${title}`
  let pageIndex = 0

  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header Pagetitle={pageTitle} style={{ paddingTop: '20px' }} date={`${startDate} - ${endDate}`} fixed />
        <View wrap style={{ display: 'flex', paddingBottom: 20, paddingTop: 12 }}>
          <Text style={styles.title}>{`Training Competency ${title}`}</Text>
        </View>
        <View wrap style={{ display: 'flex', paddingBottom: 5 }}>
          {getTableData('Process', process, pageIndex, false)}
          {getTableData('Skills', skills, process.length, process.length % 10 > 7)}
          {getTableData(
            'Product Knowledge',
            productKnowledge,
            skills.length + process.length,
            (skills.length + process.length) % 10 > 7
          )}
          {getTableData(
            'Temperment',
            temperment,
            process.length + skills.length + productKnowledge.length,
            (process.length + skills.length + productKnowledge.length) % 10 > 7
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
