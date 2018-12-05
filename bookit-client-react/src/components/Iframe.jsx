import React from 'react'
import PropTypes from 'prop-types'

const iframeStyle = {
  position: 'absolute',
  display: 'block',
  visibility: 'hidden',
}

export const Iframe = ({ iframeRef, ...props }) => (
  <iframe
    {...props}
    ref={iframeRef}
    style={iframeStyle}
    height='0'
    width='0'
    frameBorder='0'
    target='_parent'
    allowFullScreen={false}
  />
)

Iframe.propTypes = {
  iframeRef: PropTypes.func,
}

export default Iframe
