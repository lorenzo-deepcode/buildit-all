// import validateToken from './validate-token'

import * as constants from 'Constants/token-states'

describe('validate-token', () => {
  describe('#validateToken(token)', () => {
    beforeEach(() => {
      jest.resetModules()
    })

    it('returns `TOKEN_MISSING` when no token is passed', () => {
      const { validateToken } = require('./validate-token')

      const actual = validateToken()
      expect(actual).to.equal(constants.TOKEN_MISSING)
    })

    it('returns `TOKEN_BADLY_FORMED` when badly formed token is passed', () => {
      const { validateToken } = require('./validate-token')

      const actual = validateToken('blarp')
      expect(actual).to.equal(constants.TOKEN_BADLY_FORMED)
    })

    it('returns `TOKEN_EXPIRED` when an expired token is passed', () => {
      jest.doMock('./decode-jwt', () => ({ decodeJWT: () => ({ exp: (Date.now() / 1000) - 1000 })}))

      const { validateToken } = require('./validate-token')
      const actual = validateToken('avalidtoken')

      expect(actual).to.equal(constants.TOKEN_EXPIRED)
    })

    it('returns `TOKEN_VALID` when an expired token is passed', () => {
      jest.doMock('./decode-jwt', () => ({ decodeJWT: () => ({ exp: (Date.now() / 1000) + 1000 })}))

      const { validateToken } = require('./validate-token')
      const actual = validateToken('avalidtoken')

      expect(actual).to.equal(constants.TOKEN_VALID)
    })
  })
})
