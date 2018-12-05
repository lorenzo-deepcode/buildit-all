import { fork } from 'redux-saga/effects'

import { sagas as api } from 'Redux/api'
import { sagas as auth } from 'Redux/auth'
import { sagas as booking } from 'Redux/booking'

import { rootSaga } from 'Redux/root-saga'

describe('root-saga', () => {
  describe('#rootSaga()', () => {
    it('forks when called', () => {
      const saga = rootSaga()

      expect(saga.next().value).to.deep.equal(fork(api))
      expect(saga.next().value).to.deep.equal(fork(auth))
      expect(saga.next().value).to.deep.equal(fork(booking))
      expect(saga.next().done).to.be.true
    })
  })
})
