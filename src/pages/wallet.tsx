"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui"
import {
  Wallet,
  CreditCard,
  ArrowUpDown,
  DollarSign,
  Award,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Download,
  ExternalLink,
} from "lucide-react"
import { formatCurrency } from "@/utils/format-utils"

// Types
interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "conversion" | "reward"
  amount: number
  tokenAmount?: number
  date: string
  status: "pending" | "completed" | "failed"
  description: string
  txHash?: string
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  isDefault: boolean
}

const WalletPage: React.FC = () => {
  const [usdBalance, setUsdBalance] = useState(0)
  const [hakiBalance, setHakiBalance] = useState(0)
  const [hakiValue, setHakiValue] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

  // Conversion states
  const [convertAmount, setConvertAmount] = useState("")
  const [convertDirection, setConvertDirection] = useState<"toUSD" | "toHAKI">("toUSD")
  const [convertResult, setConvertResult] = useState("0")
  const [isConverting, setIsConverting] = useState(false)

  // Withdrawal states
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [selectedBankId, setSelectedBankId] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Add bank account states
  const [newBankName, setNewBankName] = useState("")
  const [newAccountNumber, setNewAccountNumber] = useState("")
  const [isAddingBank, setIsAddingBank] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // const walletResponse = await apiService.get('/wallet');
        // const transactionsResponse = await apiService.get('/wallet/transactions');
        // const bankAccountsResponse = await apiService.get('/wallet/bank-accounts');

        // For now, using mock data
        setUsdBalance(3750.25)
        setHakiBalance(1250)
        setHakiValue(1.25) // 1 HAKI = $1.25 USD
        setTransactions(mockTransactions)
        setBankAccounts(mockBankAccounts)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Calculate conversion result whenever amount or direction changes
    if (convertAmount && !isNaN(Number(convertAmount))) {
      const amount = Number(convertAmount)
      if (convertDirection === "toUSD") {
        setConvertResult((amount * hakiValue).toFixed(2))
      } else {
        setConvertResult((amount / hakiValue).toFixed(2))
      }
    } else {
      setConvertResult("0")
    }
  }, [convertAmount, convertDirection, hakiValue])

  const handleConvert = async () => {
    if (!convertAmount || isNaN(Number(convertAmount)) || Number(convertAmount) <= 0) {
      return
    }

    const amount = Number(convertAmount)
    setIsConverting(true)

    try {
      // In a real implementation, this would be an API call
      // await apiService.post('/wallet/convert', {
      //   amount,
      //   direction: convertDirection
      // });

      // Update balances based on conversion
      if (convertDirection === "toUSD") {
        // Converting HAKI to USD
        if (amount > hakiBalance) {
          throw new Error("Insufficient HAKI balance")
        }

        const usdAmount = amount * hakiValue
        setHakiBalance((prev) => prev - amount)
        setUsdBalance((prev) => prev + usdAmount)

        // Add transaction
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: "conversion",
          amount: usdAmount,
          tokenAmount: amount,
          date: new Date().toISOString(),
          status: "completed",
          description: `Converted ${amount} HAKI to ${formatCurrency(usdAmount)}`,
        }

        setTransactions((prev) => [newTransaction, ...prev])
      } else {
        // Converting USD to HAKI
        const usdAmount = amount
        const hakiAmount = amount / hakiValue

        if (usdAmount > usdBalance) {
          throw new Error("Insufficient USD balance")
        }

        setUsdBalance((prev) => prev - usdAmount)
        setHakiBalance((prev) => prev + hakiAmount)

        // Add transaction
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: "conversion",
          amount: usdAmount,
          tokenAmount: hakiAmount,
          date: new Date().toISOString(),
          status: "completed",
          description: `Converted ${formatCurrency(usdAmount)} to ${hakiAmount.toFixed(2)} HAKI`,
        }

        setTransactions((prev) => [newTransaction, ...prev])
      }

      // Reset form
      setConvertAmount("")

      // Show success message
      alert("Conversion successful!")
    } catch (error) {
      console.error("Error converting funds:", error)
      alert(`Failed to convert: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsConverting(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      return
    }

    if (!selectedBankId) {
      alert("Please select a bank account")
      return
    }

    const amount = Number(withdrawAmount)
    if (amount > usdBalance) {
      alert("Insufficient balance")
      return
    }

    setIsWithdrawing(true)

    try {
      // In a real implementation, this would be an API call
      // await apiService.post('/wallet/withdraw', {
      //   amount,
      //   bankAccountId: selectedBankId
      // });

      // Update balance
      setUsdBalance((prev) => prev - amount)

      // Add transaction
      const selectedBank = bankAccounts.find((bank) => bank.id === selectedBankId)
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: "withdrawal",
        amount: amount,
        date: new Date().toISOString(),
        status: "pending",
        description: `Withdrawal to ${selectedBank?.bankName} (${selectedBank?.accountNumber})`,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Reset form
      setWithdrawAmount("")

      // Show success message
      alert("Withdrawal initiated! Funds will be transferred within 1-3 business days.")
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      alert("Failed to withdraw funds. Please try again.")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleAddBankAccount = async () => {
    if (!newBankName.trim() || !newAccountNumber.trim()) {
      alert("Please fill in all fields")
      return
    }

    setIsAddingBank(true)

    try {
      // In a real implementation, this would be an API call
      // await apiService.post('/wallet/bank-accounts', {
      //   bankName: newBankName,
      //   accountNumber: newAccountNumber
      // });

      // Add new bank account
      const newBank: BankAccount = {
        id: `bank-${Date.now()}`,
        bankName: newBankName,
        accountNumber: newAccountNumber,
        isDefault: bankAccounts.length === 0,
      }

      setBankAccounts((prev) => [...prev, newBank])

      // Reset form
      setNewBankName("")
      setNewAccountNumber("")

      // Show success message
      alert("Bank account added successfully!")
    } catch (error) {
      console.error("Error adding bank account:", error)
      alert("Failed to add bank account. Please try again.")
    } finally {
      setIsAddingBank(false)
    }
  }

  const setDefaultBankAccount = (id: string) => {
    const updatedAccounts = bankAccounts.map((account) => ({
      ...account,
      isDefault: account.id === id,
    }))

    setBankAccounts(updatedAccounts)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-500" />
              USD Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{formatCurrency(usdBalance)}</div>
            <p className="text-sm text-muted-foreground">Available for withdrawal</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full">
              Withdraw to Bank
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-purple-500" />
              HAKI Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{hakiBalance.toFixed(2)} HAKI</div>
            <p className="text-sm text-muted-foreground">
              Current value: {formatCurrency(hakiBalance * hakiValue)}
              <span className="ml-2 text-xs px-2 py-1 bg-muted rounded-full">1 HAKI = {formatCurrency(hakiValue)}</span>
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full">
              Convert to USD
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions">
        <TabsList className="mb-6">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="convert">Convert</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div>
                        <div className="flex items-center">
                          {transaction.type === "deposit" && <DollarSign className="h-5 w-5 mr-2 text-green-500" />}
                          {transaction.type === "withdrawal" && <CreditCard className="h-5 w-5 mr-2 text-blue-500" />}
                          {transaction.type === "conversion" && (
                            <ArrowUpDown className="h-5 w-5 mr-2 text-orange-500" />
                          )}
                          {transaction.type === "reward" && <Award className="h-5 w-5 mr-2 text-purple-500" />}
                          <p className="font-medium">{transaction.description}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}{" "}
                          {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                        {transaction.txHash && (
                          <a
                            href={`https://hashscan.io/testnet/transaction/${transaction.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary flex items-center mt-1"
                          >
                            View on HashScan
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.type === "deposit" || transaction.type === "reward"
                              ? "text-green-500"
                              : transaction.type === "withdrawal"
                                ? "text-red-500"
                                : ""
                          }`}
                        >
                          {transaction.type === "deposit" || transaction.type === "reward"
                            ? "+"
                            : transaction.type === "withdrawal"
                              ? "-"
                              : ""}
                          {formatCurrency(transaction.amount)}
                        </p>
                        {transaction.tokenAmount && (
                          <p className="text-sm text-purple-500">
                            {transaction.type === "conversion" && transaction.tokenAmount > 0
                              ? transaction.amount > 0
                                ? "→ "
                                : "← "
                              : "+"}
                            {transaction.tokenAmount.toFixed(2)} HAKI
                          </p>
                        )}
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "success"
                              : transaction.status === "pending"
                                ? "outline"
                                : "destructive"
                          }
                          className="mt-1"
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="ghost" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Convert Tab */}
        <TabsContent value="convert">
          <Card>
            <CardHeader>
              <CardTitle>Convert Between USD and HAKI</CardTitle>
              <CardDescription>Convert your funds between USD and HAKI tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Current exchange rate: 1 HAKI = {formatCurrency(hakiValue)}. Conversion is instant with no fees.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Conversion Direction</label>
                    <Select
                      value={convertDirection}
                      onValueChange={(value) => setConvertDirection(value as "toUSD" | "toHAKI")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toUSD">HAKI to USD</SelectItem>
                        <SelectItem value="toHAKI">USD to HAKI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {convertDirection === "toUSD" ? "HAKI Amount" : "USD Amount"}
                    </label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(e.target.value)}
                        className="flex-1"
                      />
                      <span className="ml-2 text-sm font-medium">{convertDirection === "toUSD" ? "HAKI" : "USD"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available:{" "}
                      {convertDirection === "toUSD" ? `${hakiBalance.toFixed(2)} HAKI` : formatCurrency(usdBalance)}
                    </p>
                  </div>

                  <div className="flex justify-center my-4">
                    <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {convertDirection === "toUSD" ? "USD Amount" : "HAKI Amount"}
                    </label>
                    <div className="flex items-center">
                      <Input type="text" value={convertResult} readOnly className="flex-1 bg-muted" />
                      <span className="ml-2 text-sm font-medium">{convertDirection === "toUSD" ? "USD" : "HAKI"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleConvert}
                disabled={
                  !convertAmount ||
                  isNaN(Number(convertAmount)) ||
                  Number(convertAmount) <= 0 ||
                  isConverting ||
                  (convertDirection === "toUSD" && Number(convertAmount) > hakiBalance) ||
                  (convertDirection === "toHAKI" && Number(convertAmount) > usdBalance)
                }
              >
                {isConverting ? "Converting..." : "Convert"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Withdraw Tab */}
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw to Bank Account</CardTitle>
              <CardDescription>Withdraw your USD balance to your linked bank account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Withdrawals typically take 1-3 business days to process. Minimum withdrawal amount is $50.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (USD)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Available: {formatCurrency(usdBalance)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Account</label>
                    {bankAccounts.length === 0 ? (
                      <div className="p-4 border rounded-md text-center">
                        <p className="text-sm text-muted-foreground mb-2">No bank accounts linked</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Add Bank Account
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Bank Account</DialogTitle>
                              <DialogDescription>Add your bank account details for withdrawals</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Bank Name</label>
                                <Input
                                  value={newBankName}
                                  onChange={(e) => setNewBankName(e.target.value)}
                                  placeholder="Enter bank name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Account Number</label>
                                <Input
                                  value={newAccountNumber}
                                  onChange={(e) => setNewAccountNumber(e.target.value)}
                                  placeholder="Enter account number"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={handleAddBankAccount}
                                disabled={isAddingBank || !newBankName || !newAccountNumber}
                              >
                                {isAddingBank ? "Adding..." : "Add Bank Account"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.bankName} (*{account.accountNumber.slice(-4)}){account.isDefault && " (Default)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleWithdraw}
                disabled={
                  !withdrawAmount ||
                  isNaN(Number(withdrawAmount)) ||
                  Number(withdrawAmount) < 50 ||
                  Number(withdrawAmount) > usdBalance ||
                  !selectedBankId ||
                  isWithdrawing ||
                  bankAccounts.length === 0
                }
              >
                {isWithdrawing ? "Processing..." : "Withdraw Funds"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Bank Accounts Tab */}
        <TabsContent value="bank-accounts">
          <Card>
            <CardHeader>
              <CardTitle>Manage Bank Accounts</CardTitle>
              <CardDescription>Add and manage your linked bank accounts for withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankAccounts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No bank accounts linked</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Add Bank Account</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Bank Account</DialogTitle>
                          <DialogDescription>Add your bank account details for withdrawals</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Bank Name</label>
                            <Input
                              value={newBankName}
                              onChange={(e) => setNewBankName(e.target.value)}
                              placeholder="Enter bank name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Account Number</label>
                            <Input
                              value={newAccountNumber}
                              onChange={(e) => setNewAccountNumber(e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleAddBankAccount}
                            disabled={isAddingBank || !newBankName || !newAccountNumber}
                          >
                            {isAddingBank ? "Adding..." : "Add Bank Account"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <>
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            Account ending in {account.accountNumber.slice(-4)}
                          </p>
                          {account.isDefault && (
                            <Badge variant="outline" className="mt-1">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div>
                          {!account.isDefault && (
                            <Button variant="ghost" size="sm" onClick={() => setDefaultBankAccount(account.id)}>
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              const updatedAccounts = bankAccounts.filter((a) => a.id !== account.id)
                              setBankAccounts(updatedAccounts)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-4">
                          Add Another Bank Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Bank Account</DialogTitle>
                          <DialogDescription>Add your bank account details for withdrawals</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Bank Name</label>
                            <Input
                              value={newBankName}
                              onChange={(e) => setNewBankName(e.target.value)}
                              placeholder="Enter bank name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Account Number</label>
                            <Input
                              value={newAccountNumber}
                              onChange={(e) => setNewAccountNumber(e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleAddBankAccount}
                            disabled={isAddingBank || !newBankName || !newAccountNumber}
                          >
                            {isAddingBank ? "Adding..." : "Add Bank Account"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 2500,
    date: "2023-11-15T10:30:00Z",
    status: "completed",
    description: "Bounty completion payment",
    txHash: "0x1a2b3c4d5e6f",
  },
  {
    id: "2",
    type: "reward",
    amount: 500,
    tokenAmount: 400,
    date: "2023-11-15T10:30:05Z",
    status: "completed",
    description: "HAKI token reward",
    txHash: "0x2b3c4d5e6f7g",
  },
  {
    id: "3",
    type: "conversion",
    amount: 625,
    tokenAmount: 500,
    date: "2023-11-20T14:45:00Z",
    status: "completed",
    description: "Converted 500 HAKI to $625.00",
    txHash: "0x3c4d5e6f7g8h",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: 1000,
    date: "2023-11-25T09:15:00Z",
    status: "completed",
    description: "Withdrawal to Bank of America (*1234)",
  },
  {
    id: "5",
    type: "deposit",
    amount: 1500,
    date: "2023-12-05T11:20:00Z",
    status: "completed",
    description: "Milestone payment",
    txHash: "0x4d5e6f7g8h9i",
  },
  {
    id: "6",
    type: "reward",
    amount: 0,
    tokenAmount: 350,
    date: "2023-12-05T11:20:05Z",
    status: "completed",
    description: "HAKI token reward",
    txHash: "0x5e6f7g8h9i0j",
  },
  {
    id: "7",
    type: "withdrawal",
    amount: 750,
    date: "2023-12-10T16:30:00Z",
    status: "pending",
    description: "Withdrawal to Chase Bank (*5678)",
  },
]

const mockBankAccounts: BankAccount[] = [
  {
    id: "bank-1",
    bankName: "Bank of America",
    accountNumber: "****1234",
    isDefault: true,
  },
  {
    id: "bank-2",
    bankName: "Chase Bank",
    accountNumber: "****5678",
    isDefault: false,
  },
]

export default WalletPage

