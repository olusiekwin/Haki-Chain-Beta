haki-platform/
├── frontend/               # React frontend application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # UI components
│       ├── contexts/       # React contexts (auth, etc.)
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
│
├── backend/                # Django backend application
│   ├── haki/               # Main Django project
│   ├── users/              # User management app
│   ├── bounties/           # Bounties management app
│   ├── payments/           # Payment processing app
│   ├── blockchain/         # Blockchain integration app (bridge to Web3)
│   └── ai/                 # AI services app
│
└── contracts/              # Hedera smart contracts
    ├── escrow/             # Escrow contract
    ├── token/              # Token contract
    ├── reputation/         # Reputation contract
    └── scripts/            # Deployment scripts

