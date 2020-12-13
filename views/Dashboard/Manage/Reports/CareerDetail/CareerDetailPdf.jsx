import React from 'react'
import { Page, Text, View, Document, StyleSheet, Font, pdf, Image } from '@react-pdf/renderer'
import { equals, isNil, values } from 'ramda'
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
    marginBottom: '10px',
    paddingBottom: '10px',
    paddingTop: '10px',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '10px',
    borderBottomWidth: 1,
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
  title: {
    fontSize: '16',
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
  fontStyle3: {
    fontSize: '14',
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

const emptyStats = {
  courses: { complete: 0, completion: 0, expired: 0, pending: 0, total: 0 },
  habits: {
    day: { complete: 0, total: 0, completion: 0, items: {} },
    week: { complete: 0, total: 0, completion: 0, items: {} },
    month: { complete: 0, total: 0, completion: 0, items: {} },
  },
  modules: { complete: 0, completion: 0, expired: 0, pending: 0, total: 0 },
  quotas: { total: 0, complete: 0, pending: 0, completion: 0 },
}

const getTableHeader = headerNameArray => {
  return (
    <View style={styles.listHeader}>
      <View style={{ flex: 8 }}>
        <Text style={styles.fontStyle1}>{headerNameArray[0]}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={[styles.fontStyle1, { textAlign: 'right', marginRight: 10 }]}>{headerNameArray[1]}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={[styles.fontStyle1, { textAlign: 'right', marginRight: 10 }]}>{headerNameArray[2]}</Text>
      </View>
    </View>
  )
}

const getTableData = (data, pageBreak, index) => {
  return (
    <View style={styles.listItem} key={`career${index}`} wrap break={pageBreak}>
      <View style={{ flex: 8, flexDirection: 'row' }}>
        <Image
          src={data[0] ? '/images/task-50.png' : '/images/circle.png'}
          style={data[0] ? styles.checked : styles.unChecked}
        />
        <Text style={[styles.fontStyle2, { marginLeft: 5 }]}>{data[1]}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={[styles.fontStyle2, { textAlign: 'right', marginRight: 10 }]}>{data[2]}</Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={[styles.fontStyle2, { textAlign: 'right', marginRight: 10 }]}>{data[3]}</Text>
      </View>
    </View>
  )
}

export default function CareerDetailPdf({ program, current, contentLevel, levels, stats, userName }) {
  let pageIndex = 1
  let pageBreak = false
  const { quotas } = levels[current - 1]
  const levelStats = stats.levels[current] || emptyStats
  const dailyItems = isNil(levelStats.habits.day.items) ? [] : values(levelStats.habits.day.items)
  const weeklyItems = isNil(levelStats.habits.week.items) ? [] : values(levelStats.habits.week.items)
  const monthlyItems = isNil(levelStats.habits.month.items) ? [] : values(levelStats.habits.month.items)
  let habits = []
  dailyItems.map(item => habits.push({ data: item, type: 'Daily Habit' }))
  weeklyItems.map(item => habits.push({ data: item, type: 'Weekly Habit' }))
  monthlyItems.map(item => habits.push({ data: item, type: 'Monthly Habit' }))
  return pdf(
    <Document>
      <Page size="letter" style={styles.container} wrap>
        <Header
          style={{ paddingTop: 20 }}
          Pagetitle="Reports - Individual Career Report"
          date={moment(new Date()).format('MMM DD, YY')}
          fixed
        />
        <View>
          <View style={{ margin: 10 }}>
            <View style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Text style={styles.title}>{userName}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }}>
              <Text style={[styles.fontStyle1, { width: 100 }]}>Title</Text>
              <Text style={[styles.fontStyle1, { fontWeight: 'bold' }]}>{program.data.levels[contentLevel].title}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }}>
              <Text style={[styles.fontStyle1, { width: 100 }]}>Est. Completion</Text>
              <Text style={[styles.fontStyle1, { fontWeight: 'bold' }]}>
                {moment(program.estimated_completion).format('MMM DD, YY')}
              </Text>
            </View>
          </View>
          {isNil(levels[current - 1]) ? (
            <View>
              <Text style={[styles.fontStyle2, { textAlign: 'center' }]}> No career contents.</Text>
            </View>
          ) : (
            <View wrap style={{ display: 'flex', margin: 10 }}>
              <Text style={[styles.fontStyle3, { paddingTop: 5 }]}>Required Quotas</Text>
              {getTableHeader(['Quotas', 'Target', 'Actual'])}
              {quotas.length > 0 ? (
                quotas.map((quota, index) => {
                  const checked = !isNil(quota.completed_at)
                  const name = quota.name || quota.data.name
                  const target = quota.quota_target || quota.data.quota_target
                  const actual = quota.actuals && quota.actuals.length > 0 ? quota.actuals[0].actual : 'N/A'
                  if (pageIndex == 9) {
                    pageBreak = true
                    pageIndex = 1
                  }
                  pageIndex++
                  return getTableData([checked, name, target, actual], pageBreak, index)
                })
              ) : (
                <View>
                  <Text style={[styles.fontStyle2, { textAlign: 'center' }]}>No quotas available</Text>
                </View>
              )}
              <Text style={[styles.fontStyle3, { marginTop: 20 }]}>Required Habits</Text>
              {getTableHeader(['Habits', 'Target', 'Actual'])}
              {habits.length > 0 ? (
                habits.map((item, index) => {
                  const checked = equals(item.completion, 100)
                  const name = (item.data.name || item.data.data.name) + ' (' + item.type + ')'
                  const target = '60%'
                  const actual =
                    item.type == 'Daily Habit'
                      ? levelStats.habits.day.completion
                      : item.type == 'Weekly Habit'
                      ? levelStats.habits.week.completion
                      : levelStats.habits.month.completion
                  if (pageIndex == 9) {
                    pageBreak = true
                    pageIndex = 1
                  }
                  pageIndex++
                  return getTableData([checked, name, target, actual], pageBreak, index)
                })
              ) : (
                <View>
                  <Text style={[styles.fontStyle2, { textAlign: 'center' }]}>No habits available</Text>
                </View>
              )}
            </View>
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
