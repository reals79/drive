import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import './PieChart.scss'

const CHART = [
  { country: 'Various', litres: 64 },
  { country: 'Cooker', litres: 12 },
  { country: 'Tester', litres: 14 },
  { country: 'Manager', litres: 17 },
  { country: 'Admin', litres: 18 },
  { country: 'Owner', litres: 36 },
]

const PieChart = () => {
  useEffect(() => {
    const chart = am4core.create('donuts', am4charts.PieChart)

    // Add data
    chart.data = CHART

    const colorSetTitle = new am4core.ColorSet()
    colorSetTitle.list = ['#376caf', '#376caf', '#376caf', '#376caf', '#376caf', '#376caf'].map(function(color) {
      return new am4core.color(color)
    })
    const colorSetValue = new am4core.ColorSet()
    colorSetValue.list = ['#376caf', '#376caf', '#376caf', '#376caf', '#376caf', '#376caf'].map(function(color) {
      return new am4core.color(color)
    })

    // Add and configure Series
    const pieSeriesTitle = chart.series.push(new am4charts.PieSeries())
    pieSeriesTitle.dataFields.value = 'litres'
    pieSeriesTitle.dataFields.category = 'country'
    chart.innerRadius = am4core.percent(40)
    pieSeriesTitle.labels.template.text = '{category}'
    pieSeriesTitle.labels.template.fontSize = 12
    pieSeriesTitle.radius = '40'
    pieSeriesTitle.colors = colorSetTitle

    //////////
    const pieSeriesValue = chart.series.push(new am4charts.PieSeries())
    pieSeriesValue.dataFields.value = 'litres'
    pieSeriesValue.dataFields.category = 'country'
    pieSeriesValue.ticks.template.disabled = true
    pieSeriesValue.alignLabels = false
    pieSeriesValue.labels.template.text = "{value.percent.formatNumber('#.0')}"
    pieSeriesValue.labels.template.radius = am4core.percent(-25)
    pieSeriesValue.labels.template.fill = am4core.color('black')
    pieSeriesValue.labels.template.fontSize = 12
    pieSeriesValue.radius = '40'
    pieSeriesValue.innerRadius = '0'
    pieSeriesValue.colors = colorSetValue
    pieSeriesValue.slices.template.stroke = am4core.color('#ffffff')
    pieSeriesValue.slices.template.strokeWidth = 0.5
    pieSeriesValue.slices.template.strokeOpacity = 1
    pieSeriesValue.stroke = am4core.color('#ffffff')
    //////////

    const label = pieSeriesTitle.createChild(am4core.Label)
    label.text = '494'
    label.horizontalCenter = 'middle'
    label.verticalCenter = 'middle'
    label.fontSize = 14
  }, [])

  return <div className="ds-donuts" id="donuts" />
}

export default memo(PieChart)
