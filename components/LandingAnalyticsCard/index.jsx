import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { length } from 'ramda'
import { Icon, Button } from '@components'
import './LandingAnalyticsCard.scss'

const data = {
  basic: {
    title: 'Basic',
    icon: 'fas fa-check',
    price: 'FREE',
    description: 'Compare your store against national averages, or other stores in your group.',
    info: [
      'Website Benchmarking',
      'Facebook Benchmarking',
      'Twitter Benchmarking',
      'Inventory Benchmarking',
      'Alerts & Notification',
      'Two Simultaneous Benchmarks',
    ],
    submit: 'GET FREE',
  },
  advanced: {
    title: 'Advanced',
    icon: 'fas fa-check-double',
    price: '$399',
    subTitle: '/month',
    description:
      'Advanced, franchise specific benchmarks for more detailed insight and goal tracking.',
    info: [
      'Everything from The Basic',
      'Index of Top 10% of Performers',
      'Domestic Dealer Index',
      'Import Dealer Index',
      'Luxury Dealer Index',
      'Your Franchise National Average',
      'Set & Manage Goals',
    ],
    submit: 'GET ADVANCED',
  },
  premium: {
    title: 'Premium',
    icon: 'fas fa-shield-check',
    price: '$599',
    subTitle: '/month',
    description:
      'Regional specific indexes to benchmark against your backyard + task and project management.',
    info: [
      'Everything from The Advanced',
      'Regional Average for Local Insight',
      'Regional Domestic',
      'Regional Import',
      'Regional Luxury',
      'Regional Top 10% Index for your Franchise',
      'Task & Project Management',
    ],
    submit: 'GET PREMIUM',
  },
  enterprise: {
    title: 'Enterprise API',
    icon: 'fas fa-shield-check',
    price: '',
    subTitle: 'Inquire for Pricing',
    description:
      'Export vendor agnostic market indexes to add market context to your dashboards and tools.',
    info: [
      'Set Up Your Own Plan',
      'Select Franchise',
      'Determine Geography',
      'Choose Marketing Channel',
      'Export Feed through API and Plug into your Software',
      'And even more...',
    ],
    submit: 'CONTACT US',
  },
}

const LandingAnalyticsCard = ({ onDemoNow, type, active = false }) => (
  <div className={`landing-analytics-card ${active ? 'active' : ''}`}>
    {active && <div className="highlight-text">Most popular</div>}
    <div className="circle">
      <Icon name={data[type].icon} size={30} color="#fff" />
    </div>
    <div className="title">{data[type].title}</div>
    <div className="sub-title">
      <span>{data[type].price}</span>
      {data[type].subTitle}
    </div>
    <p className="mt-4 normal truncate">{data[type].description}</p>
    <div className="split" />
    <div className="line-block">
      {data[type].info.map((item, index) => (
        <div className="line" key={index}>
          <Icon name="fas fa-check" size={12} color="#343f4b" />
          <div className={`info normal ${length(item) > 30 ? 'truncate-two' : 'truncate-one'}`}>
            {item}
          </div>
        </div>
      ))}
    </div>
    <div className="submit-btn">
      <Button className="wrap-btn" onClick={() => onDemoNow()} name={data[type].submit} />
    </div>
  </div>
)

export default memo(LandingAnalyticsCard)
