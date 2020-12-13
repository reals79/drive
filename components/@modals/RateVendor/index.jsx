import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'
import { find, propEq } from 'ramda'
import { Input, Button, Dropdown, Rating } from '@components'
import VenActions from '~/actions/vendor'
import { RATING_STATUS } from '~/services/constants'
import './RateVendor.scss'

const RateVendor = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.app.user)
  const companies = useSelector(state => state.vendor.vendorCompanies?.data)
  const categories = useSelector(state => state.vendor.categories?.all)
  const md = useSelector(state => state.app.modalData)
  const tab = md?.before?.tab || 'company'
  const defaultCompany = md?.before?.company
  const defaultCategory = md?.before?.category
  const defaultProduct = md?.before?.product

  const [active, setActive] = useState(tab)
  const [products, setProducts] = useState([])
  const [selectedCompany, setSelectedCompany] = useState([defaultCompany])
  const [selectedCategory, setSelectedCategory] = useState([defaultCategory])
  const [selectedProduct, setSelectedProduct] = useState([defaultProduct])
  const [rating, setRating] = useState(0)
  const [recommend, setRecommend] = useState(0)
  const [title, setTitle] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')

  useEffect(() => {
    if (selectedCompany[0]) {
      const selected = find(propEq('id', selectedCompany[0]), companies)
      setProducts(selected?.products)
    }
  }, [selectedCompany])

  useEffect(() => {
    if (selectedCategory[0]) {
      const payload = {
        categoryId: selectedCategory[0],
        payload: {},
        callback: selectCategoryCallback,
      }
      dispatch(VenActions.getcategoryproductsRequest(payload))
    }
  }, [selectedCategory])

  const selectCategoryCallback = e => {
    setProducts(e?.data)
  }

  const handleSelectTab = e => {
    setActive(e)
  }

  const handleChangeDropdown = selector => e => {
    switch (selector) {
      case 'company':
        setSelectedCompany(e)
        break
      case 'product':
        setSelectedProduct(e)
        break
      case 'category':
        setSelectedCategory(e)
        break
      default:
        break
    }
  }

  const handleChangeRate = e => {
    setRating(e)
  }

  const handleChangeRecommend = e => {
    setRecommend(e)
  }

  const handleSubmit = () => {
    const product = find(propEq('id', selectedProduct[0]), products)
    const phone = user?.profile?.phone
    const payload = {
      product_id: selectedProduct[0],
      summary: title,
      pros,
      cons,
      phone,
      likely: recommend,
      star_rating: rating,
      product_name: product?.name,
    }
    dispatch(VenActions.savevendorratingRequest(payload))
  }

  const RecommendSymbol = [...Array(10)].map((item, idx) => {
    let styleClass = `rate-vendor-modal-recommend-rate`
    if (idx + 1 === recommend) styleClass = `active ${styleClass}`
    return (
      <div key={`rating-${idx}`} className={styleClass}>
        {idx + 1}
      </div>
    )
  })

  const disabled = title === '' || rating === 0 || recommend === 0 || !selectedProduct[0]

  return (
    <div className="rate-vendor-modal modal-content">
      <div className="modal-header text-center bg-primary">
        <span className="dsl-w14">Rate a Vendor</span>
      </div>
      <div className="modal-body p-4">
        <Tabs defaultActiveKey="company" activeKey={active} onSelect={handleSelectTab}>
          <Tab eventKey="company" title="By Company">
            <Dropdown
              className="py-3 rate-vendor-modal-dropdown"
              title="Company"
              width="fit-content"
              data={companies}
              defaultIds={selectedCompany}
              getValue={e => e.name}
              onChange={handleChangeDropdown('company')}
            />
          </Tab>
          <Tab eventKey="category" title="By Category">
            <Dropdown
              className="py-3 rate-vendor-modal-dropdown"
              title="Category"
              width="fit-content"
              data={categories}
              defaultIds={selectedCategory}
              getValue={e => e.name}
              onChange={handleChangeDropdown('category')}
            />
          </Tab>
        </Tabs>
        <Dropdown
          className="py-3 rate-vendor-modal-dropdown"
          title="Product"
          width="fit-content"
          data={products}
          defaultIds={selectedProduct}
          getValue={e => e.name}
          onChange={handleChangeDropdown('product')}
        />
        <div className="d-h-start">
          <Rating
            className="py-3 rate-vendor-modal-rating"
            title="Star Rating"
            readonly={false}
            score={rating}
            size="large"
            fractions={2}
            onChange={handleChangeRate}
          />
          {RATING_STATUS[rating.toFixed(0)] && (
            <div className="rate-vendor-modal-status">
              <span className="dsl-b22">{RATING_STATUS[rating.toFixed(0)]}</span>
            </div>
          )}
        </div>
        <Rating
          className="py-3 rate-vendor-modal-rating"
          title="Likely to recommend?"
          readonly={false}
          showScore={false}
          score={recommend}
          size="large"
          topRate={10}
          empty={RecommendSymbol}
          full={RecommendSymbol}
          feedback={['Poor', 'Good', 'Excellent']}
          onChange={handleChangeRecommend}
        />
        <Input
          className="py-3 rate-vendor-modal-input"
          title="Preview Title"
          placeholder="Type here..."
          value={title}
          onChange={e => setTitle(e)}
        />
        <Input
          className="py-3 rate-vendor-modal-input"
          title="Pros"
          placeholder="Type here..."
          rows={3}
          as="textarea"
          value={pros}
          onChange={e => setPros(e)}
        />
        <Input
          title="Cons"
          className="py-3 rate-vendor-modal-input"
          rows={3}
          as="textarea"
          placeholder="Type here..."
          value={cons}
          onChange={e => setCons(e)}
        />
        <div className="d-h-end">
          <Button disabled={disabled} name="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

RateVendor.propTypes = {
  onClose: PropTypes.func.isRequired,
}

RateVendor.defaultProps = {
  onClose: () => {},
}

export default RateVendor
