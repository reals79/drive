import React from 'react'
import PropTypes from 'prop-types'
import originalMoment from 'moment'
import { extendMoment } from 'moment-range'
import classNames from 'classnames'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import { DatePicker, Dropdown } from '@components'

const moment = extendMoment(originalMoment)

const CHART = [
  { country: 'Category Listing', litres: 38 },
  { country: 'Company Products', litres: 10 },
  { country: 'Search Results', litres: 4 },
  { country: 'Dealer Statisfaction Awards', litres: 14 },
  { country: 'Featured Products', litres: 7 },
  { country: 'Recently Updated', litres: 4 },
  { country: 'Related Products', litres: 9 },
]
const REVIEWS = [
  { id: 0, name: 'New Reviews' },
  { id: 1, name: 'Avg Ratings' },
  { id: 2, name: 'Recommended %' },
  { id: 3, name: 'NPS' },
]
const EXPOSURE = [
  { id: 0, name: 'Impressions' },
  { id: 1, name: 'PDP Views' },
  { id: 2, name: 'Avg Page time' },
  { id: 3, name: 'Total Page time' },
]

class Visibility extends React.Component {
  constructor(props) {
    super(props)
    this.chart = { data: [] }
    this.chart1 = { data: [] }
  }

  componentDidMount() {
    this.chart = am4core.create('chartdiv', am4charts.PieChart)

    // Add data
    this.chart.data = CHART

    // Add and configure Series
    const pieSeries = this.chart.series.push(new am4charts.PieSeries())
    pieSeries.dataFields.value = 'litres'
    pieSeries.dataFields.category = 'country'
    this.chart.innerRadius = am4core.percent(40)

    pieSeries.ticks.template.disabled = true
    pieSeries.alignLabels = false
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%"
    pieSeries.labels.template.radius = am4core.percent(-30)
    pieSeries.labels.template.fill = am4core.color('white')

    // Create chart instance
    this.chart1 = am4core.create('chartdiv1', am4charts.XYChart)
    this.chart1.paddingRight = 20

    // Add data
    this.chart1.data = [
      {
        date: new Date(2018, 3, 20),
        value: 90,
        value2: 45,
      },
      {
        date: new Date(2018, 3, 21),
        value: 102,
        value2: 90,
      },
      {
        date: new Date(2018, 3, 22),
      },
      {
        date: new Date(2018, 3, 23),
        value: 125,
      },
      {
        date: new Date(2018, 3, 24),
        value: 55,
        value2: 90,
      },
      {
        date: new Date(2018, 3, 25),
        value: 81,
        value2: 60,
      },
      {
        date: new Date(2018, 3, 26),
      },
      {
        date: new Date(2018, 3, 27),
        value: 63,
        value2: 87,
      },
      {
        date: new Date(2018, 3, 28),
        value: 113,
        value2: 62,
      },
    ]

    // Create axes
    var dateAxis = this.chart1.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.minGridDistance = 50
    dateAxis.renderer.grid.template.location = 0.5
    dateAxis.startLocation = 0.5
    dateAxis.endLocation = 0.5

    // Create value axis
    var valueAxis = this.chart1.yAxes.push(new am4charts.ValueAxis())

    // Create series
    var series1 = this.chart1.series.push(new am4charts.LineSeries())
    series1.dataFields.valueY = 'value'
    series1.dataFields.dateX = 'date'
    series1.strokeWidth = 3
    series1.tensionX = 0.8
    series1.bullets.push(new am4charts.CircleBullet())
    series1.connect = false

    var series2 = this.chart1.series.push(new am4charts.LineSeries())
    series2.dataFields.valueY = 'value2'
    series2.dataFields.dateX = 'date'
    series2.strokeWidth = 3
    series2.tensionX = 0.8
    series2.bullets.push(new am4charts.CircleBullet())
  }

  render() {
    const { date, product, products, onDateChange } = this.props
    return (
      <div className="card mt-3">
        <p className="dsl-b24 bold">Visibility</p>
        <div className="d-flex justify-content-between border-bottom py-3">
          <Dropdown
            className="visibility-product"
            data={products}
            defaultIds={[0]}
            getValue={e => e.name}
            returnBy="data"
            onChange={e => console.log(e)}
          />
          <DatePicker
            calendar="range"
            append="caret"
            format="MMM D, YY"
            as="span"
            align="right"
            value={date}
            closeAfterSelect
            onSelect={onDateChange}
          />
        </div>
        <div className="mt-4">
          <p className="dsl-b18 bold">Reviews</p>
          <div className="d-flex">
            <div className="d-flex-1">
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">New Reviews</span>
                <span className="value dsl-b16">15</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Avg Ratings</span>
                <span className="value dsl-b16">4.3</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Recommended %</span>
                <span className="value dsl-b16">93%</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">NPS</span>
                <span className="value dsl-b16">7.4</span>
              </div>
            </div>
            <div className="d-flex-2">
              <Dropdown
                className="visibility-product"
                data={REVIEWS}
                defaultIds={[0]}
                getValue={e => e.name}
                returnBy="data"
                onChange={e => console.log(e)}
              />
              <div className="visibility-review" id="chartdiv1" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="dsl-b18 bold">Exposure</p>
          <div className="d-flex">
            <div className="d-flex-1">
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Impressions</span>
                <span className="value dsl-b16">15675</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">PDP Views</span>
                <span className="value dsl-b16">1234</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Avg Page time</span>
                <span className="value dsl-b16">1.45</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Total Page time</span>
                <span className="value dsl-b16">1974</span>
              </div>
            </div>
            <div className="d-flex-2">
              <Dropdown
                className="visibility-product"
                data={EXPOSURE}
                defaultIds={[0]}
                getValue={e => e.name}
                returnBy="data"
                onChange={e => console.log(e)}
              />
              <div className="visibility-review" id="chartdiv1" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="dsl-b18 bold">Sources</p>
          <div className="d-flex">
            <div className="d-flex-1">
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Category Listing</span>
                <span className="value dsl-b16">3453</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Company Products</span>
                <span className="value dsl-b16">951</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Search Results</span>
                <span className="value dsl-b16">2654</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Dealer Statisfaction Awards</span>
                <span className="value dsl-b16">1543</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Featured Products</span>
                <span className="value dsl-b16">2343</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Recently Updated</span>
                <span className="value dsl-b16">450</span>
              </div>
              <div className="visibility-item mt-3">
                <span className="title dsl-m12">Related Products</span>
                <span className="value dsl-b16">1242</span>
              </div>
            </div>
            <div className="d-flex-2 d-flex">
              <div className="pt-3">
                {CHART.map((item, index) => (
                  <div className="visibility-item mt-2" key={`vc${index}`}>
                    <div className="circle" />
                    <span className="title dsl-m12">{item.country}</span>
                    <span className="value dsl-b16">{item.litres}</span>
                  </div>
                ))}
              </div>
              <div className="visibility-success" id="chartdiv" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Visibility.propTypes = {
  date: PropTypes.any,
  products: PropTypes.array,
  onDateChange: PropTypes.func,
}

Visibility.defaultProps = {
  date: moment.range(
    moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    moment()
      .endOf('month')
      .format('YYYY-MM-DD')
  ),
  product: [0],
  products: [
    { id: 0, name: 'All Products' },
    { id: 1, name: 'Modules' },
    { id: 2, name: 'Tracks' },
  ],
  onDateChange: () => {},
}

export default Visibility
