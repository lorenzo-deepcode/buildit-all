import React from 'react'
import PropTypes from 'prop-types'

const DEFAULT_OPTIONS = {
  toolbar: 'no',
  location: 'no',
  directories: 'no',
  status: 'no',
  menubar: 'no',
  scrollbars: 'no',
  width: 483,
  height: 600,
  top: (o, w) => ((w.innerHeight / 2) - (o.height / 2)) + (w.screenTop != undefined ? w.screenTop : screen.top),
  left: (o, w) => ((w.innerWidth / 2) - (o.width / 2)) + (w.screenLeft != undefined ? w.screenLeft : screen.left),
}

const ABOUT_BLANK = 'about:blank'

export default class WindowOpener extends React.Component {
  static defaultProps = {
    url: ABOUT_BLANK,
    name: 'window-opener',
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    options: PropTypes.object,
    onLoaded: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.windowLoaded = this.windowLoaded.bind(this)
    this.parentUnload = this.parentUnload.bind(this)

    this.state = { openedWindow: null }
  }

  componentDidMount() {
    const { openedWindow } = this.state
    if (!openedWindow) this.openWindow(openedWindow)
  }

  componentWillUnmount() {
    this.parentUnload()
  }

  createOptions() {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...this.props.options }

    return Object.keys(mergedOptions).map(
      key => key + '=' + (
        typeof mergedOptions[key] === 'function'
          ? mergedOptions[key].call(this, mergedOptions, window)
          : mergedOptions[key]
      )
    ).join(',')
  }

  windowLoaded(openedWindow) {
    this.props.onLoaded && this.props.onLoaded(openedWindow)
  }

  parentUnload() {
    const { openedWindow } = this.state
    openedWindow && openedWindow.close()
    window.removeEventListener('unload', this.parentUnload)
  }

  openWindow(openedWindow) {
    openedWindow = window.open(
      this.props.url,
      this.props.name,
      this.createOptions()
    )

    if (openedWindow) {
      window.addEventListener('unload', this.parentUnload)
      this.windowLoaded(openedWindow)
    }

    this.setState({ openedWindow })
  }


  render() {
    return null
  }
}
