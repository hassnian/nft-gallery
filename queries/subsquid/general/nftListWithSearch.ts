import { graphql } from '@/queries/clients/graphqlClients'
import { nftFragment } from '@/queries/fragments/typed/nft'
import { nftDetailsFragment } from '@/queries/fragments/typed/nftDetails'
import { baseMetaFragment } from '@/queries/fragments/typed/baseMeta'

export default graphql(`
query nftListWithSearch(
  $first: Int!
  $offset: Int
  $denyList: [String!]
  $search: [NFTEntityWhereInput!]
  $orderBy: [NFTEntityOrderByInput!] = [blockNumber_DESC]
) {
  nFTEntities: nftEntities(
    orderBy: $orderBy
    limit: $first
    offset: $offset
    where: {
      burned_eq: false
      issuer_not_in: $denyList
      metadata_not_eq: ""
      AND: $search
    }
  ) {
    ...nft
    ...nftDetails
    royalty
    recipient
    createdAt
    collection {
      id
      name
      floorPrice: nfts(
        where: { burned_eq: false, price_gt: "0" }
        orderBy: price_ASC
        limit: 1
      ) {
        price
      }
    }
    meta {
      ...baseMeta
    }
    token {
      id
    }
  }
  nftEntitiesConnection(
    where: {
      burned_eq: false
      issuer_not_in: $denyList
      metadata_not_eq: ""
      AND: $search
    }
    orderBy: blockNumber_DESC
  ) {
    totalCount
  }
}
`,
[nftFragment, nftDetailsFragment, baseMetaFragment],
)
