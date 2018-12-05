import React from 'react'

import { CSSTransition } from 'react-transition-group'

import {
  slideOverAppear as appear,
  slideOverAppearActive as appearActive,
  slideOverEnter as enter,
  slideOverEnterActive as enterActive,
  slideOverExit as exit,
  slideOverExitActive as exitActive,
} from 'Styles/slide-over.scss'

const slideOverClassNames = { appear, appearActive, enter, enterActive, exit, exitActive }

const SlideOver = ({ children, ...props }) => (
  <CSSTransition
    { ...props }
    classNames={slideOverClassNames}
    timeout={500}
  >
    { children }
  </CSSTransition>
)

export default SlideOver
