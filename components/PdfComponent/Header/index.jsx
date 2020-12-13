import React from 'react'
import { View, StyleSheet, Image, Text, Font } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  headerColumn: {
    flexDirection: 'column',
    flex: 9,
  },
  image: {
    width: '130pt',
    height: '30pt',
    margin: '10px 30px 0 10px',
  },
  content: {
    flexDirection: 'row',
    marginBottom: '10',
    marginTop: '12',
  },
  dateColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  date: {
    marginRight: 10,
    fontSize: 10,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  subtitleContent: {
    flex: 5,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  blankColumn: {
    flex: 1,
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

export default function PdfHeader(props) {
  const { title, date, Pagetitle } = props

  return (
    <View {...props}>
      <View style={styles.headerColumn}>
        <Image style={styles.image} src="\images\logos\pdf-logo.png" />
      </View>
      <View style={styles.content}>
        <View style={styles.blankColumn} />
        <View style={styles.subtitleContent}>
          <Text style={styles.subtitle}>{Pagetitle}</Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <View style={{ marginLeft: '10px' }}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  )
}
