import { getContract } from "../../utils/web3-provider"
import { marketplaceContract } from "../../contracts/contract-config"

export interface TokenListing {
  id: string
  seller: string
  tokenId: string
  amount: string
  price: string
  status: number // 0: Active, 1: Sold, 2: Cancelled
}

const MarketplaceContractService = {
  getContract: () => {
    return getContract(marketplaceContract)
  },

  createListing: async (from: string, tokenId: string, amount: string, price: string): Promise<string> => {
    const contract = getContract(marketplaceContract)
    const tx = await contract.methods.createListing(tokenId, amount, price).send({ from })
    return tx.transactionHash
  },

  buyToken: async (from: string, listingId: string, value: string): Promise<string> => {
    const contract = getContract(marketplaceContract)
    const tx = await contract.methods.buyToken(listingId).send({ from, value })
    return tx.transactionHash
  },

  cancelListing: async (from: string, listingId: string): Promise<string> => {
    const contract = getContract(marketplaceContract)
    const tx = await contract.methods.cancelListing(listingId).send({ from })
    return tx.transactionHash
  },

  getListing: async (listingId: string): Promise<TokenListing> => {
    const contract = getContract(marketplaceContract)
    const listing = await contract.methods.getListing(listingId).call()
    return listing
  },

  getAllListings: async (): Promise<TokenListing[]> => {
    const contract = getContract(marketplaceContract)
    const count = await contract.methods.getListingCount().call()

    const listings = []
    for (let i = 0; i < count; i++) {
      const listingId = await contract.methods.listingIds(i).call()
      const listing = await contract.methods.getListing(listingId).call()
      listings.push(listing)
    }

    return listings
  },

  getActiveListings: async (): Promise<TokenListing[]> => {
    const allListings = await MarketplaceContractService.getAllListings()
    return allListings.filter((listing) => listing.status === 0)
  },
}

export default MarketplaceContractService

