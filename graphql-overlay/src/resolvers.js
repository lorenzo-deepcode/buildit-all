import fetch from 'node-fetch'
import { key } from '../conf'

const resolveFunctions = {

  Query: {
    
    tags() {
      return fetch(`http://content.guardianapis.com/tags?api-key=${key}`)
        .then(res => res.json())
        .then(res => res.response.results)
    },
    
    section(_, {id}) {
      return fetch(`https://content.guardianapis.com/sections?q=${id}&api-key=${key}`)
        .then(res => res.json())
        .then(res => res.response.results[0])
    },
    
    sections (_, {limit = 0}) {
      return fetch(`https://content.guardianapis.com/sections?api-key=${key}`)
        .then(res => res.json())
        .then(res => res.response.results.filter((section, index) => index < limit))
    },
    
  },
  
  Section: {
    
    articles ({id: sectionId}, {query}) {
      return fetch(`https://content.guardianapis.com/search?q=${query}&section=${sectionId}&api-key=${key}`)
        .then(res => res.json())
        .then(res => res.response.results)
    },
    
  }

}

export default resolveFunctions