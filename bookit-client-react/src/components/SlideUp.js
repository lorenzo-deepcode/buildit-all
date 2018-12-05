import React from 'react'

import { CSSTransition } from 'react-transition-group'

import {
  slideUpAppear as appear,
  slideUpAppearActive as appearActive,
  slideUpEnter as enter,
  slideUpEnterActive as enterActive,
  slideUpExit as exit,
  slideUpExitActive as exitActive,
} from 'Styles/slide-up.scss'

const slideUpClassNames = { appear, appearActive, enter, enterActive, exit, exitActive }

const SlideUp = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={1000}
    classNames={slideUpClassNames}
  >
    { children }
  </CSSTransition>
)

export default SlideUp
