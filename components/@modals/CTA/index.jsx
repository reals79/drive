import React from 'react'
import PropTypes from 'prop-types'
import renderHTML from 'react-render-html'
import './CTAModal.scss'

class CTAModal extends React.PureComponent {
  componentDidMount() {
    const script1 = document.createElement('script')
    script1.src = 'https://paperform.co/__embed'
    script1.async = true

    document.body.appendChild(script1)
  }

  render() {
    return (
      <div className="cta-modal">
        <div className="content">
          {renderHTML(`
          <div data-paperform-id="ybn1jnym"></div>
        `)}
        </div>
      </div>
    )
  }
}

CTAModal.propTypes = {
  description: PropTypes.string,
  onChange: PropTypes.func,
}

CTAModal.defaultProps = {
  description: ' ',
  onChange: () => {},
}

export default CTAModal
