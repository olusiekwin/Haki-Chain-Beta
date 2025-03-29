/**
 * Centralized mock data for development and testing
 * This replaces multiple separate mock data files
 */

// Mock users
export const mockUsers = [
  {
    id: "1",
    name: "John Lawyer",
    email: "john@example.com",
    role: "lawyer",
    profilePicture: "/placeholder.svg?height=100&width=100",
    specialization: "Human Rights",
    experience: 5,
    rating: 4.8,
  },
  {
    id: "2",
    name: "NGO Organization",
    email: "ngo@example.com",
    role: "ngo",
    profilePicture: "/placeholder.svg?height=100&width=100",
    mission: "Protecting human rights globally",
    founded: 2010,
  },
  {
    id: "3",
    name: "Donor Person",
    email: "donor@example.com",
    role: "donor",
    profilePicture: "/placeholder.svg?height=100&width=100",
    donationsMade: 12,
    totalDonated: 5000,
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profilePicture: "/placeholder.svg?height=100&width=100",
  },
]

// Mock bounties
export const mockBounties = [
  {
    id: "1",
    title: "Human Rights Violation Case in Region X",
    description: "We need legal assistance to document and file a case regarding human rights violations in Region X.",
    reward: 1000,
    currency: "HAKI",
    status: "open",
    createdBy: "2", // NGO
    assignedTo: null,
    createdAt: "2023-01-15T10:30:00Z",
    deadline: "2023-03-15T10:30:00Z",
    tags: ["human rights", "documentation", "legal filing"],
  },
  {
    id: "2",
    title: "Environmental Law Consultation",
    description: "Seeking legal advice on environmental regulations affecting indigenous communities.",
    reward: 750,
    currency: "HAKI",
    status: "assigned",
    createdBy: "2", // NGO
    assignedTo: "1", // Lawyer
    createdAt: "2023-02-10T14:20:00Z",
    deadline: "2023-04-10T14:20:00Z",
    tags: ["environmental", "indigenous", "consultation"],
  },
  {
    id: "3",
    title: "Refugee Status Application Support",
    description: "Need assistance with refugee status applications for 10 families.",
    reward: 1200,
    currency: "HAKI",
    status: "completed",
    createdBy: "2", // NGO
    assignedTo: "1", // Lawyer
    createdAt: "2022-11-05T09:15:00Z",
    deadline: "2023-01-05T09:15:00Z",
    completedAt: "2022-12-20T16:45:00Z",
    tags: ["refugee", "immigration", "application"],
  },
]

// Mock milestones
export const mockMilestones = [
  {
    id: "1",
    bountyId: "2",
    title: "Initial consultation",
    description: "Conduct initial consultation with community representatives",
    amount: 250,
    status: "completed",
    dueDate: "2023-02-25T14:20:00Z",
    completedAt: "2023-02-23T11:30:00Z",
  },
  {
    id: "2",
    bountyId: "2",
    title: "Legal research",
    description: "Research applicable environmental regulations and precedents",
    amount: 250,
    status: "in_progress",
    dueDate: "2023-03-15T14:20:00Z",
  },
  {
    id: "3",
    bountyId: "2",
    title: "Final report",
    description: "Prepare and present final legal recommendations",
    amount: 250,
    status: "pending",
    dueDate: "2023-04-05T14:20:00Z",
  },
]

// Mock transactions
export const mockTransactions = [
  {
    id: "1",
    type: "donation",
    amount: 2000,
    currency: "HAKI",
    from: "3", // Donor
    to: "2", // NGO
    status: "completed",
    timestamp: "2023-01-10T08:45:00Z",
    description: "Donation to support human rights cases",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "2",
    type: "milestone_payment",
    amount: 250,
    currency: "HAKI",
    from: "2", // NGO
    to: "1", // Lawyer
    status: "completed",
    timestamp: "2023-02-24T15:20:00Z",
    description: "Payment for completing milestone: Initial consultation",
    bountyId: "2",
    milestoneId: "1",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "3",
    type: "bounty_payment",
    amount: 1200,
    currency: "HAKI",
    from: "2", // NGO
    to: "1", // Lawyer
    status: "completed",
    timestamp: "2022-12-21T10:15:00Z",
    description: "Payment for completing bounty: Refugee Status Application Support",
    bountyId: "3",
    txHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
]

// Mock conversations
export const mockConversations = [
  {
    id: "1",
    participants: ["1", "2"], // Lawyer and NGO
    title: "Human Rights Case Discussion",
    lastMessage: {
      id: "101",
      sender: "1",
      content: "I've reviewed the documents you sent. Can we schedule a call to discuss?",
      timestamp: "2023-02-28T14:30:00Z",
      read: false,
    },
    unreadCount: 1,
    updatedAt: "2023-02-28T14:30:00Z",
  },
  {
    id: "2",
    participants: ["2", "3"], // NGO and Donor
    title: "Donation Follow-up",
    lastMessage: {
      id: "201",
      sender: "2",
      content: "Thank you for your generous donation! Here's how we're planning to use the funds.",
      timestamp: "2023-02-25T09:15:00Z",
      read: true,
    },
    unreadCount: 0,
    updatedAt: "2023-02-25T09:15:00Z",
  },
]

// Mock messages
export const mockMessages = {
  "1": [
    // Conversation 1
    {
      id: "100",
      conversationId: "1",
      sender: "2", // NGO
      content: "Hello, we need assistance with a human rights case. I've attached some documents for your review.",
      timestamp: "2023-02-27T10:45:00Z",
      read: true,
      attachments: [
        {
          id: "1001",
          name: "case_details.pdf",
          url: "/placeholder.svg?height=200&width=150",
          type: "application/pdf",
          size: 1024000,
        },
      ],
    },
    {
      id: "101",
      conversationId: "1",
      sender: "1", // Lawyer
      content: "I've reviewed the documents you sent. Can we schedule a call to discuss?",
      timestamp: "2023-02-28T14:30:00Z",
      read: false,
      attachments: [],
    },
  ],
  "2": [
    // Conversation 2
    {
      id: "200",
      conversationId: "2",
      sender: "3", // Donor
      content: "I'd like to make a donation to support your human rights work.",
      timestamp: "2023-02-24T16:20:00Z",
      read: true,
      attachments: [],
    },
    {
      id: "201",
      conversationId: "2",
      sender: "2", // NGO
      content: "Thank you for your generous donation! Here's how we're planning to use the funds.",
      timestamp: "2023-02-25T09:15:00Z",
      read: true,
      attachments: [
        {
          id: "2001",
          name: "fund_allocation.pdf",
          url: "/placeholder.svg?height=200&width=150",
          type: "application/pdf",
          size: 512000,
        },
      ],
    },
  ],
}

