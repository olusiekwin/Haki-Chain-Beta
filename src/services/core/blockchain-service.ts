import { Web3Service } from "./web3-service"
import { SyncService } from "./sync-service"
import { ConfigService } from "./config-service"

/**
 * Unified blockchain service that handles all blockchain interactions
 * This replaces the separate hedera-service.ts, token-service.ts, escrow-service.ts, etc.
 */
export class BlockchainService {
  private web3Service: Web3Service
  private syncService: SyncService
  private config: ConfigService

  constructor() {
    this.web3Service = new Web3Service()
    this.syncService = new SyncService()
    this.config = new ConfigService()
  }

  // Token operations
  async transferTokens(recipient: string, amount: number): Promise<string> {
    const txId = await this.web3Service.executeContract(this.config.getTokenContractAddress(), "transfer", [
      recipient,
      amount,
    ])

    // Sync with backend
    await this.syncService.recordTokenTransfer({
      txId,
      recipient,
      amount,
      status: "pending",
    })

    return txId
  }

  // Escrow operations
  async createEscrow(bountyId: string, amount: number): Promise<string> {
    const txId = await this.web3Service.executeContract(this.config.getEscrowContractAddress(), "createEscrow", [
      bountyId,
      amount,
    ])

    // Sync with backend
    await this.syncService.recordEscrowCreation({
      txId,
      bountyId,
      amount,
      status: "pending",
    })

    return txId
  }

  async releaseEscrow(escrowId: string): Promise<string> {
    const txId = await this.web3Service.executeContract(this.config.getEscrowContractAddress(), "releaseEscrow", [
      escrowId,
    ])

    // Sync with backend
    await this.syncService.updateEscrowStatus({
      escrowId,
      status: "released",
      txId,
    })

    return txId
  }

  // Bounty operations
  async createBounty(bountyData: any): Promise<string> {
    const txId = await this.web3Service.executeContract(this.config.getBountyContractAddress(), "createBounty", [
      bountyData.id,
      bountyData.amount,
      bountyData.deadline,
    ])

    // Sync with backend
    await this.syncService.recordBountyCreation({
      txId,
      bountyId: bountyData.id,
      status: "pending",
    })

    return txId
  }

  async completeBounty(bountyId: string): Promise<string> {
    const txId = await this.web3Service.executeContract(this.config.getBountyContractAddress(), "completeBounty", [
      bountyId,
    ])

    // Sync with backend
    await this.syncService.updateBountyStatus({
      bountyId,
      status: "completed",
      txId,
    })

    return txId
  }

  // Wallet operations
  async connectWallet(): Promise<{ accountId: string }> {
    return this.web3Service.connectWallet()
  }

  async getWalletBalance(): Promise<number> {
    return this.web3Service.getTokenBalance(this.config.getTokenContractAddress())
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService()

