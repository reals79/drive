import React from 'react'
import PropTypes from 'prop-types'
import { equals } from 'ramda'
import { VendorCompanyDetail, Button, EditDropdown, Input } from '@components'
import { CompanyMenuItems } from '~/services/config'
import './Company.scss'

function About(props) {
  const {
    userRole,
    data,
    vendors,
    vendorProducts,
    editing,
    editable,
    selectedVendor,
    onEdit,
    onChange,
    onOpenVendor,
    onChangeProduct,
    onDiscard,
    onSubmit,
  } = props

  return (
    <>
      <div className="card">
        <div className="d-flex justify-content-between mb-2">
          <span className="dsl-b22 bold">About</span>
          <EditDropdown options={CompanyMenuItems[userRole]} onChange={e => onEdit(e, 'about')} />
        </div>
        <Input
          title="Name"
          value={data.name}
          disabled={!equals('about', editing)}
          onChange={e => onChange('name', e)}
        />
        <Input
          title="Street"
          value={data.street}
          disabled={!equals('about', editing)}
          onChange={e => onChange('street', e)}
        />
        <Input
          title="City"
          value={data.city}
          disabled={!equals('about', editing)}
          onChange={e => onChange('city', e)}
        />
        <Input
          title="State"
          value={data.state}
          disabled={!equals('about', editing)}
          onChange={e => onChange('state', e)}
        />
        <Input title="Zip" value={data.zip} disabled={!equals('about', editing)} onChange={e => onChange('zip', e)} />
        <Input
          title="Phone"
          value={data.phone}
          disabled={!equals('about', editing)}
          onChange={e => onChange('phone', e)}
        />
        <Input
          title="Website"
          value={data.website}
          disabled={!equals('about', editing)}
          onChange={e => onChange('website', e)}
        />
        <Input
          title="Avg New/mo"
          value={data.avgNewMo}
          disabled={!equals('about', editing)}
          onChange={e => onChange('avgNewMo', e)}
        />
        <Input
          title="Avg Used/mo"
          value={data.avgUsedMo}
          disabled={!equals('about', editing)}
          onChange={e => onChange('avgUsedMo', e)}
        />
        <Input
          title="Franchises"
          value={data.franchises}
          disabled={!equals('about', editing)}
          onChange={e => onChange('franchises', e)}
        />
        <Input
          title="# of Employees"
          value={data.countsOfEmployees}
          disabled={!equals('about', editing)}
          onChange={e => onChange('countsOfEmployees', e)}
        />
        {equals('about', editing) && (
          <div className="d-flex justify-content-end mt-3">
            <Button type="medium" className="mr-3" name="Discard" onClick={onDiscard} />
            <Button name="Save" onClick={onSubmit} />
          </div>
        )}
      </div>
      <div className="card">
        <div className="d-flex justify-content-between mb-2">
          <span className="dsl-b22 bold">Vendor Stack</span>
          {/* <Dropdown
            className="ellipsis"
            data={MenuItems}
            defaultIds={[0]}
            align="right"
            caret="dots-without-title"
            iconColor="#c3c7cc"
            iconSize={15}
            selectable={false}
            placeholder=""
            onChange={this.handleDropdown.bind(this, 'vendor')}
          /> */}
        </div>
        <VendorCompanyDetail
          editable={editable}
          vendors={vendors}
          vendorProducts={vendorProducts}
          selected={selectedVendor}
          onOpen={onOpenVendor}
          onChange={onChangeProduct}
        />
        {equals('edit', selectedVendor.status) && (
          <div className="d-flex justify-content-end mt-3">
            <Button type="medium" className="mr-3" name="Discard" onClick={onDiscard} />
            <Button name="Save" onClick={onSubmit} />
          </div>
        )}
      </div>
    </>
  )
}

About.propTypes = {
  userRole: PropTypes.number.isRequired,
  data: PropTypes.any.isRequired,
  vendorProducts: PropTypes.array,
  selectedVendor: PropTypes.object,
  editing: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onOpenVendor: PropTypes.func.isRequired,
  onChangeProduct: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

About.defaultProps = {
  userRole: 1,
  data: {},
  vendorProducts: {},
  selectedVendor: { selected: -1, status: 'normal' },
  editing: '',
  onChange: () => {},
  onEdit: () => {},
  onOpenVendor: () => {},
  onChangeProduct: () => {},
  onSubmit: () => {},
}

export default About
