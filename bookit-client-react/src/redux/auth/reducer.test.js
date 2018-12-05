import { Map } from 'immutable'

import { tokens, user, refreshAuthentication } from './reducer'

jest.mock('Utils', () => ({
  decodeJWT: jest.fn()
    .mockReturnValue({ preferred_username: 'tester@test.com', oid: 'abc123' })
    .mockReturnValueOnce(null),
}))

describe('auth/reducer', () => {
  describe('tokens', () => {
    it('handles SET_AUTHENTICATION_TOKEN', () => {
      const state = tokens(Map({ authn: null }), { type: 'SET_AUTHENTICATION_TOKEN', payload: 'lemoncurry' })

      expect(state.get('authn')).to.equal('lemoncurry')
    })
  })

  describe('user', () => {
    it('handles SET_AUTHENTICATION_TOKEN without a user', () => {
      const state = user(Map(), { type: 'SET_AUTHENTICATION_TOKEN', payload: 'token' })

      expect(state.get('email', null)).to.be.null
      expect(state.get('oid', null)).to.be.null
    })
    it('handles SET_AUTHENTICATION_TOKEN with a user', () => {
      const state = user(Map(), { type: 'SET_AUTHENTICATION_TOKEN', payload: 'token' })

      expect(state.get('email')).to.equal('tester@test.com')
      expect(state.get('oid')).to.equal('abc123')
    })
  })

  describe('refreshAuthentication', () => {
    it('handles REFRESH_AUTH_REQUEST', () => {
      const state = refreshAuthentication(false, { type: 'REFRESH_AUTH_REQUEST' })
      expect(state).to.equal(true)
    })

    it('handles REFRESH_AUTH_SUCCESS', () => {
      const state = refreshAuthentication(true, { type: 'REFRESH_AUTH_SUCCESS' })
      expect(state).to.equal(false)
    })

    it('handles REFRESH_AUTH_FAILURE', () => {
      const state = refreshAuthentication(true, { type: 'REFRESH_AUTH_FAILURE' })
      expect(state).to.equal(false)
    })
  })
})
