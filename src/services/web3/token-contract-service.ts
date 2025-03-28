import { getContract } from "../../utils/web3-provider"
import { tokenContract } from "../../contracts/contract-config"

export interface TokenInfo {
  symbol: string
  name: string
  totalSupply: string
  decimals: number
}

const TokenContractService = {
  getContract: () => {
    return getContract(tokenContract)
  },

  getTokenInfo: async (): Promise<TokenInfo> => {
    const contract = getContract(tokenContract)

    const [symbol, name, totalSupply, decimals] = await Promise.all([
      contract.methods.symbol().call(),
      contract.methods.name().call(),
      contract.methods.totalSupply().call(),
      contract.methods.decimals().call(),
    ])

    return {
      symbol,
      name,
      totalSupply,
      decimals: Number(decimals),
    }
  },

  getBalance: async (address: string): Promise<string> => {
    const contract = getContract(tokenContract)
    const balance = await contract.methods.balanceOf(address).call()
    return balance
  },

  transfer: async (from: string, to: string, amount: string): Promise<string> => {
    const contract = getContract(tokenContract)
    const tx = await contract.methods.transfer(to, amount).send({ from })
    return tx.transactionHash
  },

  approve: async (from: string, spender: string, amount: string): Promise<string> => {
    const contract = getContract(tokenContract)
    const tx = await contract.methods.approve(spender, amount).send({ from })
    return tx.transactionHash
  },

  getAllowance: async (owner: string, spender: string): Promise<string> => {
    const contract = getContract(tokenContract)
    const allowance = await contract.methods.allowance(owner, spender).call()
    return allowance
  },
}

export default TokenContractService

