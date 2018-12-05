import { decodeJWT } from './decode-jwt'

describe('decode-jwt', () => {
  describe('#decodeJWT(jwt)', () => {
    it('returns null with no arguments', () => {
      const actual = decodeJWT()
      expect(actual).to.be.null
    })

    it ('returns null with invalid arguments', () => {
      const actual = decodeJWT('fish')
      expect(actual).to.be.null
    })
  })
})
