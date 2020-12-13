import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion'
import { Icon } from '@components'
import './Accordion.scss'

function CoreAccordion(props) {
  const { className, icon, title, subTitle, size, type, expanded, children } = props

  return (
    <Accordion className={`core-accordion ${className} ${size} ${type}`}>
      <AccordionItem expanded={expanded}>
        <AccordionItemTitle>
          <div className="u-position-relative">
            <div className="d-flex align-items-center">
              {icon && <Icon name={`${icon} mr-2`} size={16} color="#c3c7cc" />}
              <p className="dsl-l14 text-400 mb-0">{title}</p>
            </div>
            <div className="accordion__arrow" role="presentation" />
            {subTitle}
          </div>
        </AccordionItemTitle>
        <AccordionItemBody>{children}</AccordionItemBody>
      </AccordionItem>
    </Accordion>
  )
}

CoreAccordion.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.node,
  icon: PropTypes.string,
  expanded: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'regular']),
  type: PropTypes.oneOf(['primary', 'secondary']),
}

CoreAccordion.defaultProps = {
  className: '',
  title: 'Settings',
  subTitle: null,
  icon: 'far fa-cog',
  expanded: false,
  size: 'small',
  type: 'primary',
}

export default CoreAccordion
