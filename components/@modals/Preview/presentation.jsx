import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-bootstrap'
import Lightbox from 'react-image-lightbox'
import { length } from 'ramda'
import { Button, Icon } from '@components'
import { convertUrl } from '~/services/util'
import './Preview.scss'

const Presentation = ({ images, index, isOpen, onOpen, onClose, onPrev, onNext }) => (
  <>
    <Image
      className="border-5 d-flex-1 cursor-pointer"
      src={convertUrl(images[index])}
      onClick={onOpen}
    />
    <div className="presentation-footer">
      <Button type="link" className="controls px-0" />
      <div className="d-flex align-items-center justify-content-center">
        <Button type="link" className="controls align-items-center" onClick={onPrev}>
          <Icon name="fas fa-chevron-left" size={12} color="#fff" />
        </Button>
        <div className="dsl-w14 mx-1">
          {index + 1} of {length(images)}
        </div>
        <Button type="link" className="controls align-items-center" onClick={onNext}>
          <Icon name="fas fa-chevron-right" size={12} color="#fff" />
        </Button>
      </div>
      <Button type="link" className="controls align-items-center px-0" onClick={onOpen}>
        <Icon name="fas fa-expand-alt" size={12} color="#fff" />
      </Button>
    </div>
    {isOpen && (
      <Lightbox
        reactModalStyle={{ overlay: { zIndex: 9999 } }}
        mainSrc={convertUrl(images[index])}
        nextSrc={convertUrl(images[(index + 1) % length(images)])}
        prevSrc={convertUrl(images[(index + length(images) - 1) % length(images)])}
        onCloseRequest={onClose}
        onMovePrevRequest={onPrev}
        onMoveNextRequest={onNext}
      />
    )}
  </>
)

Presentation.propTypes = {
  images: PropTypes.array,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
}

Presentation.defaultProps = {
  images: [],
  index: 0,
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onPrev: () => {},
  onNext: () => {},
}

export default memo(Presentation)
