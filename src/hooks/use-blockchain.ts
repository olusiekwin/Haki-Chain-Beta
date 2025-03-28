import { useFeatures } from "./use-features"
import { useWeb3 } from "./use-web3"
import { useMockWeb3 } from "./use-mock-web3"

// Combined hook that uses either real Web3 or mock Web3 based on feature flag
export const useBlockchain = () => {
  const { isBlockchainEnabled } = useFeatures()

  // Use real Web3 if blockchain feature is enabled, otherwise use mock
  const realWeb3 = useWeb3()
  const mockWeb3 = useMockWeb3()

  return isBlockchainEnabled ? realWeb3 : mockWeb3
}

