// Mock data for development and testing

// User data
export const mockUsers = [
  {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe",
    wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
    profile_image: "/placeholder.svg?height=100&width=100",
    is_verified: true,
    created_at: "2023-01-15T08:30:00Z",
  },
  {
    id: 2,
    username: "janedoe",
    email: "jane@example.com",
    first_name: "Jane",
    last_name: "Doe",
    wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    profile_image: "/placeholder.svg?height=100&width=100",
    is_verified: true,
    created_at: "2023-02-20T10:15:00Z",
  },
]

// Bounty data
export const mockBounties = [
  {
    id: 1,
    title: "Draft a Non-Disclosure Agreement",
    description:
      "Need a standard NDA for a software development project. The agreement should protect proprietary information shared between parties.",
    reward: 500,
    status: "open",
    created_by: 1,
    created_by_username: "johndoe",
    assigned_to: null,
    is_on_chain: true,
    blockchain_tx_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockchain_id: "1",
    tags: ["contract", "nda", "confidentiality"],
    created_at: "2023-03-10T09:00:00Z",
    updated_at: "2023-03-10T09:00:00Z",
  },
  {
    id: 2,
    title: "Review Software License Agreement",
    description:
      "Need a legal expert to review and suggest modifications to a software license agreement for a SaaS product.",
    reward: 750,
    status: "in_progress",
    created_by: 2,
    created_by_username: "janedoe",
    assigned_to: 1,
    is_on_chain: true,
    blockchain_tx_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockchain_id: "2",
    tags: ["license", "software", "review"],
    created_at: "2023-03-15T14:30:00Z",
    updated_at: "2023-03-16T10:45:00Z",
  },
  {
    id: 3,
    title: "Create Terms of Service for Mobile App",
    description:
      "Need comprehensive terms of service for a mobile application that collects user data and offers in-app purchases.",
    reward: 1000,
    status: "open",
    created_by: 1,
    created_by_username: "johndoe",
    assigned_to: null,
    is_on_chain: false,
    blockchain_tx_hash: null,
    blockchain_id: null,
    tags: ["terms", "mobile", "privacy"],
    created_at: "2023-03-20T11:15:00Z",
    updated_at: "2023-03-20T11:15:00Z",
  },
  {
    id: 4,
    title: "Draft Employment Contract",
    description:
      "Need a standard employment contract for a tech company hiring software developers. Should include IP assignment and non-compete clauses.",
    reward: 850,
    status: "completed",
    created_by: 2,
    created_by_username: "janedoe",
    assigned_to: 1,
    is_on_chain: true,
    blockchain_tx_hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    blockchain_id: "3",
    tags: ["employment", "contract", "ip"],
    created_at: "2023-03-05T08:45:00Z",
    updated_at: "2023-03-25T16:30:00Z",
  },
]

// Token transaction data
export const mockTokenTransactions = [
  {
    id: 1,
    transaction_id: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    transaction_type: "token_transfer",
    from_user: 1,
    to_user: 2,
    amount: 500,
    bounty: null,
    created_at: "2023-03-12T10:30:00Z",
  },
  {
    id: 2,
    transaction_id: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    transaction_type: "bounty_creation",
    from_user: 1,
    to_user: null,
    amount: 500,
    bounty: 1,
    created_at: "2023-03-10T09:05:00Z",
  },
  {
    id: 3,
    transaction_id: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    transaction_type: "bounty_completion",
    from_user: null,
    to_user: 1,
    amount: 850,
    bounty: 4,
    created_at: "2023-03-25T16:25:00Z",
  },
]

// Token balance data
export const mockTokenBalances = [
  {
    id: 1,
    user: 1,
    balance: 5350,
    updated_at: "2023-03-25T16:30:00Z",
  },
  {
    id: 2,
    user: 2,
    balance: 2500,
    updated_at: "2023-03-25T16:30:00Z",
  },
]

// Marketplace listings
export const mockMarketplaceListings = [
  {
    id: 1,
    title: "Standard NDA Template",
    description: "A comprehensive non-disclosure agreement template suitable for most business relationships.",
    price: 100,
    seller: 1,
    seller_username: "johndoe",
    category: "templates",
    file_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    preview_url: "/placeholder.svg?height=300&width=400",
    is_on_chain: true,
    blockchain_tx_hash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
    created_at: "2023-03-01T08:00:00Z",
    updated_at: "2023-03-01T08:00:00Z",
  },
  {
    id: 2,
    title: "Software License Agreement Bundle",
    description: "A collection of software license agreements for different types of software products.",
    price: 250,
    seller: 2,
    seller_username: "janedoe",
    category: "bundles",
    file_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    preview_url: "/placeholder.svg?height=300&width=400",
    is_on_chain: true,
    blockchain_tx_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    created_at: "2023-03-05T09:30:00Z",
    updated_at: "2023-03-05T09:30:00Z",
  },
]

