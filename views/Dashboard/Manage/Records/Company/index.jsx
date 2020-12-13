import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  clone,
  compose,
  equals,
  filter,
  find,
  includes,
  isEmpty,
  isNil,
  prop,
  propEq,
  remove,
  sortBy,
  toLower,
} from 'ramda'
import queryString from 'query-string'
import { Avatar, Dropdown, Filter } from '@components'
import AppActions from '~/actions/app'
import DevActions from '~/actions/develop'
import MngActions from '~/actions/manage'
import { convertUrl } from '~/services/util'
import About from './About'
import Employees from './Employees'
import './Company.scss'

const Menu = [
  { id: 0, value: 'About' },
  { id: 1, value: 'Settings' },
  { id: 2, value: 'Org Chart' },
  { id: 3, value: 'Library' },
  { id: 4, value: 'Employees' },
]

class Company extends Component {
  state = {
    detail: {},
    employees: [],
    editing: queryString.parse(this.props.location.search).edit || '',
    page: 'about',
    search: '',
    selectedVendor: { selected: -1, status: 'normal' },
    avatarUploaded: null,
    vendors: (this.props.company && this.props.company.data && this.props.company.data.vendors) || [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const company = nextProps.company ? nextProps.company : {}

    const sortByName = sortBy(compose(toLower, prop('name')))
    let employees = sortByName(nextProps.employees)
    employees = filter(item => !isNil(item.id), employees)
    employees = filter(item => includes(toLower(prevState.search), toLower(item.name)), employees)

    return { company, employees }
  }

  componentDidMount() {
    this.props.getCompany(this.props.companyId)
    this.props.fetchUsers()
    this.props.getCompanyVendor(this.props.companyId)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!equals(prevProps.company, this.props.company) || isEmpty(prevState.detail)) {
      const company = this.props.company ? this.props.company : {}
      const profile = company.data ? company.data.profile : {}
      const address = profile.address ? profile.address : {}

      const detail = {
        name: company.name,
        website: profile.url,
        zip: address.zip,
        city: address.city,
        state: address.state,
        street: address.street,
        phone: profile.primary_phone,
        avgNewMo: profile.avg_new_mo,
        avgUsedMo: profile.avg_used_mo,
        franchises: profile.franchise,
        countsOfEmployees: profile.employees_count,
      }

      this.setState({ detail })
    }
  }

  handleOpenVendor = (selected, e) => {
    const { company } = this.state
    this.setState({ selectedVendor: { selected, status: e } })
    this.props.getCompanyVendor(company.data.vendors[selected].company.id)
  }

  handleChangeProduct = (companyId, productId, status) => {
    const { vendors } = this.state
    const { vendorProducts } = this.props
    let vendorStack = clone(vendors)

    if (status) {
      vendorStack[companyId].products.push({
        id: vendorProducts[productId].id,
        name: vendorProducts[productId].name,
        slug: vendorProducts[productId].slug,
      })
    } else {
      vendorStack[companyId].products.forEach((item, index) => {
        if (equals(item.id, vendorProducts[productId].id)) {
          vendorStack[companyId].products = remove(index, 1, vendorStack[companyId].products)
        }
      })
    }
    this.setState({ editing: 'vendor', vendors: vendorStack })
  }

  handleAboutChange = (key, value) => {
    const { detail } = this.state
    detail[key] = value
    this.setState({ detail })
  }

  handleDrop = file => {
    const reader = new FileReader()
    reader.onload = e => {
      this.setState({ avatarUploaded: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  handleAboutEdit = (e, section) => {
    if (e === 'edit') this.setState({ editing: section })
  }

  handleFilter = (type, e) => {
    if (isNil(e[0])) return

    if (type === 'company') {
      this.props.getCompany(e[0].id)
      this.setState({ company: e[0] })
    }
  }

  handlePagination = e => {
    this.setState({ page: toLower(e[0].value) })
  }

  handleDiscard = () => {
    const { company } = this.props
    const vendors = company.data ? company.data.vendors : []
    const profile = company.data ? company.data.profile : []
    const address = profile.address ? profile.address : []
    const detail = {
      name: company.name,
      website: profile.url,
      zip: address.zip,
      city: address.city,
      state: address.state,
      street: address.street,
      phone: profile.primary_phone,
      avgNewMo: profile.avg_new_mo,
      avgUsedMo: profile.avg_used_mo,
      franchises: profile.franchise,
      countsOfEmployees: profile.employees_count,
    }
    const selectedVendor = { selected: -1, status: 'normal' }
    this.setState({ detail, vendors, editing: '', selectedVendor })
  }

  handleAboutSubmit = () => {
    const { company, detail, vendors } = this.state
    const payload = {
      company: {
        ...company,
        id: company.id,
        parent_id: company.parent_id,
        name: detail.name,
        data: {
          ...company.data,
          profile: {
            url: detail.website,
            address: {
              zip: detail.zip,
              city: detail.city,
              state: detail.state,
              street: detail.street,
            },
            primary_phone: detail.phone,
            avg_new_mo: detail.avgNewMo,
            avg_used_mo: detail.avgUsedMo,
            franchise: detail.franchises,
            employees_count: detail.countsOfEmployees,
          },
          vendors: vendors,
        },
      },
    }
    this.props.updateCompany(payload, company.id)
    this.setState({ editing: '' })
  }

  render() {
    const { detail, editing, page, selectedVendor, vendors } = this.state
    const { employees } = this.state
    const { companies, companyId, editable, vendorProducts, userRole, creatable } = this.props
    const logo = convertUrl(detail.logo, '/images/default_company.svg')
    const company = find(propEq('id', companyId), companies)
    const departments = company.departments
    const managers = company.managers
    const roles = company.job_roles

    return (
      <div className="company-info">
        <Filter
          filters={['company']}
          addTitle={creatable ? 'Company' : null}
          mountEvent
          onAdd={() => this.props.history.push('/hcm/record-add-company')}
          onChange={this.handleFilter}
        />
        <div className="info">
          <div className="top">
            <div className="left">
              <Avatar
                url={logo}
                upload={!isEmpty(editing)}
                size="extraLarge"
                type="logo"
                borderWidth={3}
                backgroundColor="#FFFFFF"
                borderColor="#e0e0e0"
                onDrop={this.handleDrop}
              />
            </div>
            <div className="right">
              <p className="dsl-w24 mt-auto mb-4">{detail.name}</p>
            </div>
          </div>
          <div className="bottom">
            <div className="tab active">
              <Dropdown
                defaultIds={[0]}
                data={Menu}
                width={120}
                align="left"
                placeholder="Profile"
                returnBy="data"
                onChange={this.handlePagination}
              />
            </div>
            <div className="gap" />
            <div className="tab">
              <span className="dsl-w14">Blog</span>
              <span className="dsl-w10 text-200 ml-2">(0)</span>
            </div>
            <div className="gap" />
            <div className="tab">
              <span className="dsl-w14">Connections</span>
              <span className="dsl-w10 text-200 ml-2">(0)</span>
            </div>
            <div className="gap" />
            <div className="tab">
              <span className="dsl-w14">Recommendations</span>
              <span className="dsl-w10 text-200 ml-2">(0)</span>
            </div>
          </div>
        </div>

        {page === 'about' && (
          <About
            userRole={userRole}
            data={detail}
            vendors={vendors}
            vendorProducts={vendorProducts}
            editing={editing}
            editable={editable}
            selectedVendor={selectedVendor}
            onChange={this.handleAboutChange}
            onChangeProduct={this.handleChangeProduct}
            onDiscard={this.handleDiscard}
            onEdit={this.handleAboutEdit}
            onOpenVendor={this.handleOpenVendor}
            onSubmit={this.handleAboutSubmit}
          />
        )}
        {page === 'employees' && (
          <Employees
            employees={employees}
            companies={companies}
            departments={departments}
            managers={managers}
            roles={roles}
            editable={editable}
            history={this.props.history}
            onModal={this.props.toggleModal}
            onTerminate={this.props.terminate}
          />
        )}
      </div>
    )
  }
}

Company.propTypes = {
  userRole: PropTypes.number,
  editable: PropTypes.bool.isRequired,
  companyId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  vendorProducts: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  getCompanyVendor: PropTypes.func.isRequired,
  creatable: PropTypes.bool.isRequired,
}

Company.defaultProps = {
  userRole: 1,
  editable: false,
  companyId: null,
  userId: null,
  fetchUsers: () => {},
  terminate: () => {},
}

const mapStateToProps = state => ({
  userRole: state.app.app_role_id,
  editable: state.app.app_role_id < 4,
  companyId: state.app.company_info.id,
  company: state.app.companyDetail,
  userId: state.app.id,
  companies: state.app.companies,
  employees: state.app.employees,
  companyInfo: state.app.company_info,
  vendorProducts: state.app.vendor,
  creatable: state.app.primary_role_id < 2,
})

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(AppActions.postmulticompanydataRequest()),
  updateUsers: (payload, companyId) => dispatch(AppActions.postcompanyusersRequest(payload, companyId)),
  getCompany: companyId => dispatch(AppActions.getcompanyRequest(companyId)),
  getCompanyVendor: vendorId => dispatch(AppActions.fetchcompanyvendorRequest(vendorId)),
  updateCompany: (payload, companyId) => dispatch(DevActions.postcompanyinfoRequest(payload, companyId)),
  upload: payload => dispatch(AppActions.uploadRequest(payload)),
  terminate: (companyId, payload) => dispatch(MngActions.postterminateemployeeRequest(companyId, payload)),
  toggleModal: e => dispatch(AppActions.modalRequest(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Company)
