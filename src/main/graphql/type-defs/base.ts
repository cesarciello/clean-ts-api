import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    _: String
  }

  type Mutation {
    accessToken: String!
    name: String!
  }
`
