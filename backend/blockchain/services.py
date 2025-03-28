import os
from hedera import (
    Client,
    AccountId,
    PrivateKey,
    Hbar,
    TransferTransaction,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    TokenId
)

class HederaService:
    def __init__(self):
        # Get environment variables
        self.account_id = os.getenv('HEDERA_ACCOUNT_ID')
        self.private_key = os.getenv('HEDERA_PRIVATE_KEY')
        self.network = os.getenv('HEDERA_NETWORK', 'testnet')
        
        # Initialize client
        if not self.account_id or not self.private_key:
            raise ValueError("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set")
        
        # Create client based on network
        if self.network == 'mainnet':
            self.client = Client.forMainnet()
        else:
            self.client = Client.forTestnet()
        
        # Set operator
        self.client.setOperator(
            AccountId.fromString(self.account_id),
            PrivateKey.fromString(self.private_key)
        )
    
    def transfer_hbar(self, recipient_id, amount):
        """
        Transfer HBAR from operator account to recipient
        
        Args:
            recipient_id (str): Recipient account ID
            amount (float): Amount of HBAR to transfer
            
        Returns:
            dict: Transaction details
        """
        try:
            # Create transfer transaction
            transaction = (
                TransferTransaction()
                .addHbarTransfer(AccountId.fromString(self.account_id), Hbar(-amount))
                .addHbarTransfer(AccountId.fromString(recipient_id), Hbar(amount))
                .setTransactionMemo("Haki Platform Transfer")
            )
            
            # Submit transaction
            transaction_response = transaction.execute(self.client)
            
            # Get receipt
            receipt = transaction_response.getReceipt(self.client)
            
            return {
                'transaction_id': transaction_response.transactionId.toString(),
                'status': receipt.status.toString(),
                'amount': amount
            }
        except Exception as e:
            raise Exception(f"Failed to transfer HBAR: {str(e)}")
    
    def create_token(self, name, symbol, initial_supply=0):
        """
        Create a new token
        
        Args:
            name (str): Token name
            symbol (str): Token symbol
            initial_supply (int): Initial token supply
            
        Returns:
            dict: Token details
        """
        try:
            # Create token
            transaction = (
                TokenCreateTransaction()
                .setTokenName(name)
                .setTokenSymbol(symbol)
                .setTokenType(TokenType.FUNGIBLE_COMMON)
                .setDecimals(0)
                .setInitialSupply(initial_supply)
                .setTreasuryAccountId(AccountId.fromString(self.account_id))
                .setSupplyType(TokenSupplyType.INFINITE)
                .setSupplyKey(PrivateKey.fromString(self.private_key).getPublicKey())
                .freezeWith(self.client)
            )
            
            # Sign and submit transaction
            signed_tx = transaction.sign(PrivateKey.fromString(self.private_key))
            transaction_response = signed_tx.execute(self.client)
            
            # Get receipt
            receipt = transaction_response.getReceipt(self.client)
            token_id = receipt.tokenId.toString()
            
            return {
                'token_id': token_id,
                'name': name,
                'symbol': symbol,
                'initial_supply': initial_supply
            }
        except Exception as e:
            raise Exception(f"Failed to create token: {str(e)}")
    
    def mint_tokens(self, token_id, amount):
        """
        Mint new tokens
        
        Args:
            token_id (str): Token ID
            amount (int): Amount of tokens to mint
            
        Returns:
            dict: Transaction details
        """
        try:
            # Mint tokens
            transaction = (
                TokenMintTransaction()
                .setTokenId(TokenId.fromString(token_id))
                .setAmount(amount)
                .freezeWith(self.client)
            )
            
            # Sign and submit transaction
            signed_tx = transaction.sign(PrivateKey.fromString(self.private_key))
            transaction_response = signed_tx.execute(self.client)
            
            # Get receipt
            receipt = transaction_response.getReceipt(self.client)
            
            return {
                'transaction_id': transaction_response.transactionId.toString(),
                'status': receipt.status.toString(),
                'token_id': token_id,
                'amount': amount
            }
        except Exception as e:
            raise Exception(f"Failed to mint tokens: {str(e)}")

# Create singleton instance
hedera_service = HederaService()

