import { getAPIEndpoint, deriveAPIEndpoint } from './get-location'

describe('BookIt API URL tests', () => {

  describe('#getApiEndpoint()', () => {
    it('returns localhost when window.location is not defined', () => {
      window._location = window.location
      delete window.location

      const actual = getAPIEndpoint()

      expect(actual).to.equal('http://localhost:8080')

      window.location = window._location
      delete window._location
    })

    it('returns a domain when window.location is defined', () => {
      window.location = { origin: 'http://bookit-client-react.buildit.tools' }

      const actual = getAPIEndpoint()

      expect(actual).to.equal('http://bookit-api.buildit.tools')
    })
  })

  describe('derives an non-production environment api endpoint', () => {
    it('generates the integration URL', () => {
      const state = deriveAPIEndpoint('integration-bookit-client-react.buildit.tools')
      expect(state).to.be.equal('integration-bookit-api.buildit.tools')
    })
  })

  describe('derives a production environment api endpoint', () => {
    it('generates the production URL', () => {
      const state = deriveAPIEndpoint('bookit-client-react.buildit.tools')
      expect(state).to.be.equal('bookit-api.buildit.tools')
    })
  })

  describe('derives a production environment api endpoint', () => {
    it('generates the production URL', () => {
      const state = deriveAPIEndpoint('bookit-client-react.buildit.tools')
      expect(state).to.be.equal('bookit-api.buildit.tools')
    })
  })

  describe('derives a local api endpoint', () => {
    it('generates the localhost URL', () => {
      const state = deriveAPIEndpoint('http://localhost:3001')
      expect(state).to.be.equal('http://localhost:8080')
    })
  })
})
