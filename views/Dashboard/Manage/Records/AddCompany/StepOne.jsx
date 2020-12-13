import React from 'react'
import { useImmer } from 'use-immer'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CompanyBio, FranchCard, VendorCard } from '@components'
import { getVendorCategories } from './selector'
import { noop } from '~/services/util'

const StepOne = ({ venCategories, onNext }) => {
  const [bio, updateBio] = useImmer({})
  const [franchises, updateFranchises] = useImmer([])
  const [vendorStack, updateVendorStack] = useImmer({})
  const handleInputChange = (name, value) => {
    updateBio(draft => {
      draft[name] = value
    })
  }

  const handleChecked = (franchisee, checked) => {
    if (checked) {
      updateFranchises(draft => {
        draft.push(franchisee.label)
      })
    } else {
      const fchIdx = franchises.indexOf(franchisee.label)
      if (fchIdx === -1) return

      updateFranchises(draft => {
        draft.splice(fchIdx, 1)
      })
    }
  }

  const handleVendorChanged = (vName, value) => {
    updateVendorStack(draft => {
      draft[vName] = value
    })
  }

  const handleNext = () => {
    const payload = { bio, franchises, vendorStack }
    onNext(payload)
  }

  const handleThummbnail = attachment => {
    updateBio(draft => {
      draft.avatar = attachment
    })
  }

  return (
    <>
      <CompanyBio bio={bio} onInput={handleInputChange} onThumbnail={handleThummbnail} />
      <FranchCard franchises={franchises} onChecked={handleChecked} />
      <VendorCard venCategories={venCategories} onVendorChange={handleVendorChanged} onNext={handleNext} />
    </>
  )
}

StepOne.propTypes = {
  onNext: PropTypes.func,
  onThumbnail: PropTypes.func,
  venCategories: PropTypes.arrayOf(PropTypes.object),
}

StepOne.defaultProps = {
  onNext: noop,
  onThumbnail: noop,
}

const mapStateToProps = state => ({
  venCategories: getVendorCategories(state),
})

export default connect(mapStateToProps, null)(StepOne)
