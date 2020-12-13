import React from 'react'
import posed, { PoseGroup } from 'react-pose'

const DELAY = 2000

const PopupContainer = posed.div({
  enter: { opacity: 1, y: ({ enter }) => enter, transition: DELAY },
  exit: { opacity: 0, y: ({ exit }) => exit, transition: DELAY },
})

const Popup = ({ className, style, opened, enter, exit, children }) => (
  <PoseGroup enter={enter} exit={exit} flipMove={false}>
    {opened && (
      <PopupContainer key="shade" className={className} style={style}>
        {children}
      </PopupContainer>
    )}
  </PoseGroup>
)

export { Popup }
