import { Map } from 'immutable'

import {
  getUser,
  getTokens,
  getUserId,
  getUserEmail,
  getAuthenticationToken,
  isRefreshingAuthentication,
} from './selectors'

describe('auth selectors', () => {
  describe('#getUser(state)', () => {
    it('returns correct state', () => {
      const state = { user: true }
      expect(getUser(state)).to.be.true
    })
  })

  describe('#getTokens(state)', () => {
    it('returns correct state', () => {
      const state = { tokens: true }
      expect(getTokens(state)).to.be.true
    })
  })

  describe('#getUserId(state)', () => {
    it('returns correct state', () => {
      const state = { user: Map({ oid: '123' }) }
      expect(getUserId(state)).to.equal('123')
    })
  })

  describe('#getUserEmail(state)', () => {
    it('returns correct state', () => {
      const state = { user: Map({ email: 'tester@test.com' }) }
      expect(getUserEmail(state)).to.equal('tester@test.com')
    })
  })

  describe('#getAuthenticationToken(state)', () => {
    it('returns correct state', () => {
      const state = { tokens: Map({ authn: 'abc' }) }
      expect(getAuthenticationToken(state)).to.equal('abc')
    })
  })

  describe('#isRefreshingAuthentication(state)', () => {
    it('returns correct state', () => {
      const state = { refreshAuthentication: true }
      expect(isRefreshingAuthentication(state)).to.be.true
    })
  })
})
