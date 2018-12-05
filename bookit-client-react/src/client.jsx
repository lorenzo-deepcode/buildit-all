import React from 'react'
import { render } from 'react-dom'

import { AppContainer } from 'react-hot-loader'

import Root from 'Containers/Root'

import 'Styles/client.scss'

const renderRoot = (RootComponent: any) => {
  render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    document.getElementById('root')
  )
}

renderRoot(Root)

if (module.hot) {
  module.hot.accept('Containers/Root', () => renderRoot(Root))
}
