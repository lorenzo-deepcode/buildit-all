import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'

const typeDefs = `

type Tag {
  id: String!,
  type: String!,
  webTitle: String!,
  sectionName: String!,
  sectionId: String!,
  webUrl: String!,
  apiUrl: String!,
}

type Section {
  id: String!,
  webTitle: String!,
  webUrl: String!,
  apiUrl: String!,
  articles(query: String!): [Content]
}

type Content {
  id: String!,
  webTitle: String!,
  webUrl: String!,
  apiUrl: String!,
  sectionId: String!
}

type Query {
  tags: [Tag],
  section (id: String!): Section,
  sections (limit: Int): [Section],
}

`

module.exports = makeExecutableSchema({ typeDefs, resolvers, })