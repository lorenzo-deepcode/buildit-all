import * as Azure from './azure'

jest.mock('./decode-jwt', () => ({
  decodeJWT: jest.fn()
    .mockReturnValue({ tid: 'abc' })
    .mockReturnValueOnce({ tid: '9188040d-6c67-4c5b-b112-36a304b66dad' }),
}))

jest.mock('./storage', () => ({
  getStoredAuthentication: jest.fn()
    .mockReturnValue({ tid: '9188040d-6c67-4c5b-b112-36a304b66dad' }),
}))

describe('azure', () => {
  describe('#authenticationRedirectUrl()', () => {
    it('returns the URL for authentication requests to redirect to', () => {
      const actual = Azure.authenticationRedirectUrl()

      expect(actual).to.exist
      expect(actual).to.have.string('/openid-complete')
    })
  })

  describe('#getDomainHint(jwt)', () => {
    it('returns `consumers` when `tid` in the provided JWT matches a hard-coded claim', () => {
      const actual = Azure.getDomainHint('jwt')

      expect(actual).to.equal('consumers')
    })
    it('returns `organizations` when `tid` in the provided JWT does not match a hard-coded claim', () => {
      const actual = Azure.getDomainHint('jwt')

      expect(actual).to.equal('organizations')
    })
  })

  describe('signinRequestUrl(prompt, login_hint, domain_hint)', () => {
    it('returns the URL to prompt the user to login', () => {
      const actual = Azure.signinRequestUrl('login', 'tester@testing.com')

      expect(actual).to.have.string('prompt=login')
    })

    it('returns the URL to silently reauthorize the user', () => {
      const actual = Azure.signinRequestUrl('none', 'tester@testing.com')

      expect(actual).to.have.string('prompt=none')
    })

    it('returns adds login_hint if passed', () => {
      const actual = Azure.signinRequestUrl('login', 'tester@testing.com')

      expect(actual).to.have.string('login_hint=tester%40testing.com')
    })

    it('does not return the login_hint if it was not passed', () => {
      const actual = Azure.signinRequestUrl('login')

      expect(actual).to.not.have.string('login_hint=tester%40testing.com')
    })

    it('returns adds domain_hint if passed', () => {
      const actual = Azure.signinRequestUrl('login', 'tester@testing.com', 'consumers')

      expect(actual).to.have.string('domain_hint=consumers')
    })

    it('does not return the domain_hint if it was not passed', () => {
      const actual = Azure.signinRequestUrl('login', 'tester@testing.com')

      expect(actual).to.not.have.string('domain_hint=consumers')
    })
  })

  describe('refreshRequestUrl(login_hint, domain_hint)', () => {
    it('uses domain_hint when passed', () => {
      const actual = Azure.refreshRequestUrl('tester@testing.com', 'organizations')

      expect(actual).to.have.string('domain_hint=organizations')
    })
    it('uses domain_hint from `getStoredAuthentication` when not passed', () => {
      const actual = Azure.refreshRequestUrl('tester@testing.com')

      expect(actual).to.have.string('domain_hint=organizations')
    })
  })
})
