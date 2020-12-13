import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button, Dropdown, Icon, Input } from '@components'
import './AddProduct.scss'
import { convertUrl } from '~/services/util'

class AddProduct extends Component {
  state = {
    from: this.props.from,
    search: '',
    selected: null,
    productName: '',
    productDescription: '',
    selectedCategory: null,
    isCompany: false,
    isSubmitted: false,
    companyName: '',
    companyInfo: '',
  }

  componentDidMount() {
    this.props.onSearch({})
  }

  handleSubmit = () => {
    const {
      selected,
      companyName,
      companyInfo,
      productName,
      productDescription,
      selectedCategory,
      isSubmitted,
    } = this.state
    const companyData = {
      company: {
        name: companyName,
        data: {
          description: companyInfo,
          contact: {
            email: '',
            phone: '',
          },
          website: '',
        },
      },
    }
    const payload = {
      data: {
        product: {
          parent_id: isSubmitted ? null : selected.id,
          name: productName,
          data: {
            category: selectedCategory,
            description: productDescription,
            contact: isSubmitted ? { email: '', phone: '' } : selected.data.contact,
            website: '',
          },
        },
      },
      companyData: isSubmitted ? companyData : null,
      after: {
        type: 'MODAL_REQUEST',
        payload: {
          type: 'Show Success',
          data: {
            before: {
              message: 'Your product has been added. Do you want to claim it?',
              info:
                'The product you added is staying unclaimed. You need to claim it in order to get best features for it.',
            },
          },
          callBack: {
            onLater: this.handleClickLater,
            onClaim: this.handleClickClaim,
          },
        },
      },
    }
    this.props.onSaveProduct(payload)
  }

  handleClickLater = () => {
    this.props.onClose()
  }

  handleClickClaim = () => {
    this.props.onClose()
  }

  handleAddCompany = () => {
    this.setState({ isCompany: true })
  }

  handleSearch = search => {
    this.setState({ search })
    this.props.onSearch({ payload: { search } })
  }

  handleSelectItem = item => e => {
    e.preventDefault()
    this.setState({ selected: item })
  }

  handleChangeName = productName => {
    const { isCompany } = this.state
    if (isCompany) {
      this.setState({ companyName: productName })
    } else {
      this.setState({ productName })
    }
  }

  handleChangeDescription = productDescription => {
    const { isCompany } = this.state
    if (isCompany) {
      this.setState({ companyInfo: productDescription })
    } else {
      this.setState({ productDescription })
    }
  }

  handleSelectCategory = e => {
    const selectedCategory = e[0]
    this.setState({ selectedCategory })
  }

  handleClickPrevious = () => {
    this.setState({ isCompany: false })
  }

  handleClickNext = () => {
    const { companyName } = this.state
    const selected = {
      name: companyName,
      products: [],
    }
    this.setState({ isCompany: false, isSubmitted: true, selected })
  }

  render() {
    const { vrCategories, vrCompanies } = this.props
    const {
      selected,
      search,
      productName,
      productDescription,
      selectedCategory,
      isCompany,
      companyName,
      companyInfo,
    } = this.state
    const disabled = productName === '' || productDescription === '' || !selectedCategory
    const disabledNext = companyName === '' || companyInfo === ''

    return (
      <div className="add-product-modal modal-content">
        <div className="modal-header text-center bg-primary">
          <span className="dsl-w14">{`Add ${isCompany ? 'Company' : 'Product'}`}</span>
        </div>
        <div className="modal-body p-4">
          {isCompany ? (
            <>
              <Input
                className="mb-3"
                title="Company name"
                direction="vertical"
                value={companyName}
                onChange={this.handleChangeName}
              />
              <Input
                className="mb-3"
                as="textarea"
                rows={2}
                title="Info"
                direction="vertical"
                value={companyInfo}
                onChange={this.handleChangeDescription}
              />
              <div className="d-h-end">
                <Button className="d-center" type="link" onClick={this.handleClickPrevious}>
                  <Icon name="fal fa-arrow-left" size={13} color={'#376caf'} />
                  <p className="dsl-p13 ml-2 mb-0">Previous</p>
                </Button>
                <Button type="medium" disabled={disabledNext} name="NEXT" onClick={this.handleClickNext} />
              </div>
            </>
          ) : (
            <>
              <div className="d-h-between">
                <p className="dsl-m12 text-400 my-2">Select or search a company</p>
                {!selected && <Button type="link" name="+ Add Company" onClick={this.handleAddCompany} />}
              </div>
              {!selected && <Input className="mb-3" direction="vertical" value={search} onChange={this.handleSearch} />}
              {selected ? (
                <>
                  <div className="d-h-start mb-3">
                    <Avatar
                      url={convertUrl(selected.logo, '/images/default_company.svg')}
                      type="logo"
                      size="small"
                      backgroundColor="#f6f7f8"
                      borderColor="#f6f7f8"
                      borderWidth={1}
                    />
                    <div className="ml-2">
                      <p className="dsl-b14 text-400 mb-1">{selected.name}</p>
                      <p className="dsl-b13 mb-0">{`Products: ${selected.products.length}`}</p>
                    </div>
                  </div>
                  <Input
                    className="mb-3"
                    title="Enter product name"
                    direction="vertical"
                    value={productName}
                    onChange={this.handleChangeName}
                  />
                  <Input
                    className="mb-3"
                    as="textarea"
                    rows={4}
                    title="Enter product description"
                    direction="vertical"
                    value={productDescription}
                    onChange={this.handleChangeDescription}
                  />
                  <Dropdown
                    className="mb-4"
                    title="Select category"
                    direction="vertical"
                    width="fit-content"
                    data={vrCategories.all}
                    getValue={e => e.name}
                    onChange={this.handleSelectCategory}
                  />
                </>
              ) : (
                <div className="company-list mb-3">
                  {vrCompanies.data &&
                    vrCompanies.data.map(company => {
                      const { id, logo, name, products } = company
                      const isSelected = selected && selected.id ? selected.id === id : false
                      const url = convertUrl(logo, '/images/default_company.svg')
                      return (
                        <div
                          key={`product-${id}`}
                          className="d-h-between cursor-pointer py-2"
                          onClick={this.handleSelectItem(company)}
                        >
                          <div className="d-h-start">
                            <Avatar
                              url={url}
                              type="logo"
                              size="small"
                              backgroundColor="#f6f7f8"
                              borderColor="#f6f7f8"
                              borderWidth={1}
                            />
                            <div className="ml-2">
                              <p className="dsl-b14 text-400 mb-1">{name}</p>
                              <p className="dsl-b13 mb-0">{`Products: ${products.length}`}</p>
                            </div>
                          </div>
                          <div className={`item-plus ${isSelected ? 'selected' : ''}`}>
                            <Icon name="fal fa-plus" size={24} color={isSelected ? '#376caf' : '#c3c7cc'} />
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
              <div className="d-h-end">
                {selected ? (
                  <Button name="SAVE" disabled={disabled} onClick={this.handleSubmit} />
                ) : (
                  <Button name="SELECT" type="medium" disabled={!selected} onClick={this.handleSubmit} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
}

AddProduct.propTypes = {
  from: PropTypes.string,
  vrCategories: PropTypes.shape({
    all: PropTypes.array,
    popular: PropTypes.array,
  }),
  vrCompanies: PropTypes.shape({
    current_page: PropTypes.number,
    data: PropTypes.array,
    from: PropTypes.number,
    last_page: PropTypes.number,
    per_page: PropTypes.number,
    to: PropTypes.number,
    total: PropTypes.number,
  }),
  onSaveCompany: PropTypes.func,
  onSaveProduct: PropTypes.func,
  onSearch: PropTypes.func,
  onModal: PropTypes.func,
  onClose: PropTypes.func,
}

AddProduct.defaultProps = {
  from: 'product',
  vrCategories: {
    all: [],
    popular: [],
  },
  vrCompanies: {
    current_page: 1,
    data: [],
    from: 1,
    last_page: 1,
    per_page: 10,
    to: 0,
    total: 0,
  },
  onSaveCompany: () => {},
  onSaveProduct: () => {},
  onSearch: () => {},
  onModal: () => {},
  onClose: () => {},
}

export default AddProduct
