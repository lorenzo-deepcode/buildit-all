import { call, put, all, take, fork, race, select } from 'redux-saga/effects'
import { cloneableGenerator } from 'redux-saga/utils'

import history from 'History'

import * as tokenStates from 'Constants/token-states'

import { clearStoredAuthentication, getStoredAuthentication, setStoredAuthentication, parseOauthFragment, validateToken } from 'Utils'

import { actionCreators, selectors } from 'Redux'

import { sagas as auth, loadLocalAuthenticationIntoState, clearAllAuth, settleAuthenticationToken, awaitLogout, preloadData, authFlow, awaitAuthentication, retrieveAuthenticationToken, watchForAuthentication } from './sagas'


describe('sagas/auth', () => {
  describe('#loadLocalAuthenticationIntoState', () => {
    it('calls `getStoredAuthentication` followed by putting `actionCreators.setAuthenticationToken`', () => {
      const saga = loadLocalAuthenticationIntoState()

      const authnToken = null
      expect(saga.next().value).toEqual(call(getStoredAuthentication))
      expect(saga.next(authnToken).value).toEqual(put.resolve(actionCreators.setAuthenticationToken(authnToken)))
      expect(saga.next().done).toBeTruthy()
    })
  })

  describe('#preloadData()', () => {
    it('dispatches parallel calls to load all relevant API data', () => {
      const saga = preloadData()
      const action = { payload: { result: { locations: [ 'abc', 'def', 'ghi' ] } } }

      expect(saga.next().value).to.exist
      expect(saga.next(action).value).to.deep.equal(take('GET_LOCATIONS_SUCCESS'))
      expect(saga.next(action).value).to.exist
      expect(saga.next().done).to.be.true
    })
  })

  describe('#clearAllAuth()', () => {
    it('makes calls to clear auth-related redux state and localStorage', () => {
      const saga = clearAllAuth()

      const expected = all([
        call(clearStoredAuthentication),
        put(actionCreators.clearAuthentication()),
      ])

      expect(saga.next().value).toEqual(expected)
      expect(saga.next().done).toBeTruthy()
    })
  })

  describe('#settleAuthenticationToken(token)', () => {
    it('calls store-related actions and apis', () => {
      const token = 'foo'
      const saga = settleAuthenticationToken(token)

      const expected = all([
        call(setStoredAuthentication, token),
        put(actionCreators.setAuthenticationToken(token)),
      ])

      expect(saga.next().value).toEqual(expected)
      expect(saga.next().done).toBeTruthy()
    })
  })

  describe('#awaitLogout()', () => {
    it('completely logs out the user', () => {
      const saga = awaitLogout()

      expect(saga.next().value).toEqual(take('LOGOUT_REQUEST'))
      expect(saga.next().value).toEqual(call(clearAllAuth))
      expect(saga.next().value).toEqual(put(actionCreators.logoutSuccess()))
      expect(saga.next().value).toEqual(call(authFlow))
      expect(saga.next().done).toBeTruthy()
    })
  })

  describe('#retrieveAuthenticationToken()', () => {
    it('retrieves a valid authentication token', () => {
      const saga = cloneableGenerator(retrieveAuthenticationToken)()

      const authnToken = 'token'

      expect(saga.next().value).toEqual(select(selectors.getAuthenticationToken))
      expect(saga.next(authnToken).value).toEqual(call(validateToken, authnToken))

      const validSaga = saga.clone()
      const invalidSaga = saga.clone()

      expect(validSaga.next(tokenStates.TOKEN_VALID).done).to.be.true
      expect(invalidSaga.next(tokenStates.TOKEN_BADLY_FORMED).done).to.be.true

      expect(saga.next(tokenStates.TOKEN_EXPIRED).value).toEqual(put(actionCreators.refreshAuthRequest()))

      expect(saga.next().value).toEqual(
        race({
          success: take('REFRESH_AUTH_SUCCESS'),
          failure: take('REFRESH_AUTH_FAILURE'),
        })
      )

      const refreshSaga = saga.clone()
      const failure = { payload: 'ERROR!' }

      expect(refreshSaga.next({ failure }).value).toEqual(call(console.log, 'FAILED TO REFRESH:', failure.payload))
      expect(refreshSaga.next().done).to.be.true

      const success = { payload: 'xyz' }
      const refreshedAuthnToken = 'token'

      expect(saga.next({ success }).value).toEqual(call(parseOauthFragment, success.payload, 'id_token'))
      expect(saga.next(refreshedAuthnToken).value).toEqual(call(settleAuthenticationToken, refreshedAuthnToken))
      expect(saga.next().done).to.be.true
    })
  })

  describe('#awaitAuthentication()', () => {
    it('waits for a request to start authentication', () => {
      const payload = 'payload'
      const authnToken = 'authnToken'
      const saga = awaitAuthentication()

      expect(saga.next().value).toEqual(take('AUTH_REQUEST'))
      expect(saga.next({ payload }).value).toEqual(call(parseOauthFragment, payload, 'id_token'))
      expect(saga.next(authnToken).value).toEqual(call(settleAuthenticationToken, authnToken))

      const next = saga.next()
      expect(next.value).toEqual(authnToken)
      expect(next.done).toBeTruthy()
    })
  })

  describe('#authFlow()', () => {
    it('starts the auth flow by retrieving the auth token and ends with awaiting logout', () => {
      const saga = cloneableGenerator(authFlow)()
      const authnToken = 'authnToken'
      expect(saga.next().value).to.deep.equal(call(retrieveAuthenticationToken))

      const failureSaga = saga.clone()
      // calling next on failureSaga after this point will yield the exact same call
      expect(failureSaga.next().value).to.deep.equal(call(history.replace, '/login'))
      expect(failureSaga.next(null).value).to.deep.equal(call(awaitAuthentication))

      expect(saga.next(authnToken).value).to.deep.equal(put(actionCreators.loginSuccess()))
      expect(saga.next().value).to.deep.equal(call(preloadData))
      expect(saga.next().value).to.deep.equal(select(selectors.getRouterLocation))
      const noLocationSaga = saga.clone()
      expect(saga.next().value).to.deep.equal(call(awaitLogout))

      expect(noLocationSaga.next({ pathname: '/' }).value).to.deep.equal(call(history.replace, '/home'))
      expect(saga.next().done).to.be.true
    })
  })

  describe('#watchForAuthentication', () => {
    it('loads the local auth into state then starts the auth flow', () => {
      const saga = cloneableGenerator(watchForAuthentication)()
      expect(saga.next().value).toEqual(call(loadLocalAuthenticationIntoState))
      expect(saga.next().value).toEqual(select(selectors.getRouterLocation))

      const locationSaga = saga.clone()
      const location = { pathname: '/openid-complete' }

      expect(locationSaga.next(location).done).to.be.true

      expect(saga.next().value).toEqual(call(authFlow))
      expect(saga.next().done).toBeTruthy()
    })
  })

  describe('#auth()', () => {
    it('forks watchForAuthentication()', () => {
      const saga = auth()

      expect(saga.next().value).to.deep.equal(fork(watchForAuthentication))
      expect(saga.next().done).to.be.true
    })
  })
})
