import tokenAbi from "../../contracts/abis/HakiToken.json"
import escrowAbi from "../../contracts/abis/HakiEscrow.json"
import bountyAbi from "../../contracts/abis/HakiBounty.json"
import reputationAbi from "../../contracts/abis/HakiReputation.json"
import multiSigAbi from "../../contracts/abis/HakiMultiSig.json"

/**
 * ABI Service - Manages contract ABIs and provides utilities for encoding/decoding
 */
class AbiService {
  private abis: Record<string, any> = {
    token: tokenAbi,
    escrow: escrowAbi,
    bounty: bountyAbi,
    reputation: reputationAbi,
    multisig: multiSigAbi,
  }

  /**
   * Get the ABI for a specific contract type
   */
  getAbi(contractType: "token" | "escrow" | "bounty" | "reputation" | "multisig"): any[] {
    return this.abis[contractType]
  }

  /**
   * Get the function signature from an ABI
   */
  getFunctionSignature(
    contractType: "token" | "escrow" | "bounty" | "reputation" | "multisig",
    functionName: string,
  ): string {
    const abi = this.getAbi(contractType)
    const functionAbi = abi.find((item) => item.type === "function" && item.name === functionName)

    if (!functionAbi) {
      throw new Error(`Function ${functionName} not found in ${contractType} ABI`)
    }

    const inputs = functionAbi.inputs || []
    const types = inputs.map((input: any) => input.type)

    return `${functionName}(${types.join(",")})`
  }

  /**
   * Decode function result using ABI
   */
  decodeFunctionResult(
    contractType: "token" | "escrow" | "bounty" | "reputation" | "multisig",
    functionName: string,
    data: string,
  ): any {
    // This is a simplified implementation
    // In a real implementation, you would use ethers.js or web3.js to decode the result
    return data
  }
}

export const abiService = new AbiService()

