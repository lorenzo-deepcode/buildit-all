// Hello. This is _required_ for React 16, because every javascript developer
// is dumb as crap.
// This module needs to be imported ASAP inside `setup-test-framework.js`.
//
// No need to import anything specific, just that it be imported is enough
// to squelch the spurious warnings about requestAnimationFrame not being
// global or not shimmed or whatever.
//
// Eventually this issue will be fixed, within jest itself, but until it
// is, we need this.
const raf = global.requestAnimationFrame = callback => setTimeout(callback, 0)

module.exports = raf
