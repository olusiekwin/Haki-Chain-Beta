import { apiService } from "./api-service"

/**
 * Service for synchronizing on-chain and off-chain data
 */
export class SyncService {
  /**
   * Record a token transfer in the backend
   */
  async recordTokenTransfer(data: {
    txId: string
    recipient: string
    amount: number
    status: string
  }): Promise<any> {
    return apiService.post("/blockchain/transactions/token/", data)
  }

  /**
   * Record an escrow creation in the backend
   */
  async recordEscrowCreation(data: {
    txId: string
    bountyId: string
    amount: number
    status: string
  }): Promise<any> {
    return apiService.post("/blockchain/transactions/escrow/", data)
  }

  /**
   * Update escrow status in the backend
   */
  async updateEscrowStatus(data: {
    escrowId: string
    status: string
    txId: string
  }): Promise<any> {
    return apiService.put(`/blockchain/transactions/escrow/${data.escrowId}/`, data)
  }

  /**
   * Record a bounty creation in the backend
   */
  async recordBountyCreation(data: {
    txId: string
    bountyId: string
    status: string
  }): Promise<any> {
    return apiService.post("/blockchain/transactions/bounty/", data)
  }

  /**
   * Update bounty status in the backend
   */
  async updateBountyStatus(data: {
    bountyId: string
    status: string
    txId: string
  }): Promise<any> {
    return apiService.put(`/blockchain/transactions/bounty/${data.bountyId}/`, data)
  }

  /**
   * Check transaction status
   */
  async checkTransactionStatus(txId: string): Promise<any> {
    return apiService.get(`/blockchain/transactions/${txId}/`)
  }

  /**
   * Sync all pending transactions
   */
  async syncPendingTransactions(): Promise<any> {
    return apiService.post("/blockchain/sync/pending/")
  }
}

// Export a singleton instance
export const syncService = new SyncService()

