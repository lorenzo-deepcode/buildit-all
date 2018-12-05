import { parseOauthFragment } from './parse-oauth-fragment'

describe('parse-oauth-fragment', () => {
  describe('#parseOauthFragment(qs, ...keys)', () => {
    it('fails when passed an invalid value', () => {
      const actual  = parseOauthFragment(null)
      expect(actual).to.be.undefined
    })

    it('returns the value for a single key', () => {
      const actual  = parseOauthFragment('?foo=test&bar=baz', 'foo')
      expect(actual).to.equal('test')
    })

    it('returns the value for multiple keys', () => {
      const actual  = parseOauthFragment('?foo=test&bar=baz', 'foo', 'bar')
      expect(actual).to.deep.equal({ foo: 'test', bar: 'baz' })
    })
  })
})
