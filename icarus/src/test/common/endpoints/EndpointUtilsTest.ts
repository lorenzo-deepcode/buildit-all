import { expect } from 'chai';
import 'mocha';
import { callback } from "../../../main/common/Api"
import { parseBody, xAccessTokenHeader, complete } from "../../../main/common/endpoints/EndpointUtils"
import { stringify as formStringify} from "querystring"

describe('Endpoint utils', () => {

  describe('promise complete', () => {

    it('should call the callback with result when the promise resolve', (done) => {
      const cb:callback = (error: any, result: any) => {
        try {
          expect(result).is.ok;
          expect(result).is.equal('expected-result');
          expect(error).is.null
          done() 
        } catch(e) {
          done(e)
        }
      }

      complete(cb, Promise.resolve('expected-result'))
    })

    it('should call the callback with a statusCode 500 response when the promise is rejected', (done) => {
      const cb:callback = (error: any, result: any) => {
        try {
          expect(result).is.ok;
          expect(result.statusCode).is.equal(500);
          expect(error).is.null
          done() 
        } catch(e) {
          done(e)
        }
      }

      complete(cb, Promise.reject('an-error'))
    })
  })

  describe('parse body', () => {

    it('should parse JSON event body', () => {
      const event = {
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            foo: 'bar',
            baz: '42'
          }),
        }

      const result = parseBody(event)

      expect(result).has.property('foo')
      expect(result.foo).is.equal('bar')
      expect(result).has.property('baz')
      
    })

    it('should parse x-www-form-urlencoded body', () => {
      
              const event = {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
      
                  body: formStringify({
                    foo: 'bar',
                    baz: '42'
                  }),
                }
      
                const result = parseBody(event)
                
              expect(result).has.property('foo')
              expect(result.foo).is.equal('bar')
              expect(result).has.property('baz')          
      })   
  })
    

  describe('acccess token extractor ', () => {
    it('should extract X-AccessToken header', () => {
      const event = {
        headers: {
          'X-AccessToken': 'the-access-token'
        },
      }

      const result = xAccessTokenHeader(event)

      expect(result).is.ok
      expect(result).is.equal('the-access-token')
    })

    it('should extract X-AccessToken header, when header name is mixed case', () => {
      const event = {
        headers: {
          'X-acceSStokeN': 'the-access-token'
        },
      }

      const result = xAccessTokenHeader(event)

      expect(result).is.ok
      expect(result).is.equal('the-access-token')
    })    
  })
})