import * as Storage from './storage'

describe('storage', () => {
  const map = { 'some key': 'some value', 'another key': 'another value', 'third key': 'third value' }
  const keys = Object.keys(map)
  const entries = Object.entries(map)

  const value = 'some value'
  const key = 'some key'

  describe('#storeItem(key, item)', () => {
    it('stores an item into localStorage', () => {
      expect(Storage.storeItem(key, value)).to.not.throw
    })
  })

  describe('#getItem(key)', () => {
    it('gets an item by key', () => {
      Storage.storeItem(key, value)

      expect(Storage.getItem(key)).to.equal(value)
    })

    it('returns undefined if value cannot be parsed as JSON', () => {
      localStorage._store['_bookit|badvalue'] = '{ "foo": true ]'

      expect( Storage.getItem('badvalue')).to.be.undefined
    })
  })

  describe('#getItems(...items)', () => {
    it('gets items from a list', () => {
      entries.forEach(([ key, value ]) => Storage.storeItem(key, value))

      expect(Storage.getItems(...keys)).to.deep.equal(map)
    })
  })

  describe('#clearItem(...items)', () => {
    Storage.clearItem(...keys)

    expect(Storage.getItems(...keys)).to.deep.equal({})
  })

  describe('#setStoredAuthenticationauthn(authn)', () => {
    it('sets a token', () => {
      expect(Storage.setStoredAuthentication('token')).to.not.throw
    })
  })

  describe('#getStoredAuthentication()', () => {
    it('retrieves a token', () => {
      expect(Storage.getStoredAuthentication()).to.equal('token')
    })
  })

  describe('#clearStoredAuthentication()', () => {
    it('clears a token', () => {
      Storage.clearStoredAuthentication()
      expect(Storage.getStoredAuthentication()).to.be.undefined
    })
  })
})
