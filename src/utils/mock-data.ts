// Mock data for testing Web2 phase

export const mockBounties = [
  {
    id: "1",
    title: "Draft a Non-Disclosure Agreement",
    description: "Need a standard NDA for a software development project.",
    reward: 500,
    status: "open",
    createdAt: "2023-06-15T10:30:00Z",
    createdBy: "0x123456789abcdef",
    tags: ["contract", "nda", "legal"],
  },
  {
    id: "2",
    title: "Review Terms of Service",
    description: "Need legal review of ToS for a new SaaS platform.",
    reward: 750,
    status: "in_progress",
    createdAt: "2023-06-10T14:20:00Z",
    createdBy: "0x987654321fedcba",
    tags: ["tos", "review", "saas"],
  },
  {
    id: "3",
    title: "Create Privacy Policy",
    description: "Need a GDPR-compliant privacy policy for a mobile app.",
    reward: 600,
    status: "completed",
    createdAt: "2023-06-05T09:15:00Z",
    createdBy: "0xabcdef123456789",
    tags: ["privacy", "gdpr", "policy"],
  },
]

export const mockTokens = [
  {
    id: "1",
    symbol: "HAKI",
    name: "Haki Token",
    price: "1.25",
    change24h: "+5.2",
    volume24h: "1250000",
    marketCap: "12500000",
    logoUrl: "/assets/haki-token.png",
  },
  {
    id: "2",
    symbol: "LEX",
    name: "Legal Exchange Token",
    price: "0.75",
    change24h: "-2.1",
    volume24h: "850000",
    marketCap: "7500000",
    logoUrl: "/assets/lex-token.png",
  },
  {
    id: "3",
    symbol: "JUST",
    name: "Justice Token",
    price: "2.30",
    change24h: "+1.8",
    volume24h: "1750000",
    marketCap: "23000000",
    logoUrl: "/assets/just-token.png",
  },
]

export const mockWalletInfo = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  balance: "1.25",
  tokens: [
    {
      symbol: "HAKI",
      balance: "1000",
    },
    {
      symbol: "LEX",
      balance: "500",
    },
    {
      symbol: "JUST",
      balance: "250",
    },
  ],
}

export const mockTransactions = [
  {
    id: "1",
    from: "0x1234567890abcdef1234567890abcdef12345678",
    to: "0xabcdef1234567890abcdef1234567890abcdef12",
    amount: "100",
    timestamp: "2023-06-15T10:30:00Z",
    status: "completed",
    type: "send",
  },
  {
    id: "2",
    from: "0xfedcba0987654321fedcba0987654321fedcba09",
    to: "0x1234567890abcdef1234567890abcdef12345678",
    amount: "50",
    timestamp: "2023-06-14T15:45:00Z",
    status: "completed",
    type: "receive",
  },
  {
    id: "3",
    from: "0x1234567890abcdef1234567890abcdef12345678",
    to: "0x5678901234abcdef5678901234abcdef56789012",
    amount: "75",
    timestamp: "2023-06-13T09:20:00Z",
    status: "pending",
    type: "send",
  },
]

export const mockUser = {
  id: "1",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

