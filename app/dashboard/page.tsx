"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VotingDashboard from "@/components/dashboard/voting-dashboard"
import AllocationDashboard from "@/components/dashboard/allocation-dashboard"
import GeneralDataDashboard from "@/components/dashboard/general-data-dashboard"
import QearnDashboard from "@/components/dashboard/qearn-dashboard"
import { PurchaseQcapModal } from "@/components/dashboard/purchase-qcap-modal"
import { MuslimIdModal } from "@/components/dashboard/muslim-id-modal"
import { TransferStocksModal } from "@/components/dashboard/transfer-stocks-modal"
import { SubmitProposalModal } from "@/components/dashboard/submit-proposal-modal"
import { ProposalDetailsModal } from "@/components/dashboard/proposal-details-modal"

import { Button } from "@/components/ui/button"
import { Plus, FileText, Wallet, Menu, UserCircle, ArrowRightLeft, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {

  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isMuslimIdModalOpen, setIsMuslimIdModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isSubmitProposalModalOpen, setIsSubmitProposalModalOpen] = useState(false)
  const [isProposalDetailsModalOpen, setIsProposalDetailsModalOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleConnectWallet = async () => {
    if (isWalletConnected) {
      setIsWalletConnected(false)
      setWalletAddress("")
    } else {
      try {
        // In a real implementation, this would use Web3 libraries to connect to a wallet
        setIsWalletConnected(true)
        setWalletAddress("GVWPFG...CHCNJ") // Mock address
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    }
  }

  const handlePurchaseQcap = async (amount: number) => {
    console.log(`Purchasing ${amount} QCAP`)
    // Implement actual purchase logic here
    return new Promise<void>((resolve) => setTimeout(resolve, 1500))
  }

  const handleRegisterMuslimId = async (name: string) => {
    console.log(`Registering MuslimID for ${name} with wallet ${walletAddress}`)
    // Implement actual registration logic here
    return new Promise<void>((resolve) => setTimeout(resolve, 1500))
  }

  const handleTransferStocks = async (fromSC: string, toSC: string, amount: number) => {
    console.log(`Transferring ${amount} stocks from ${fromSC} to ${toSC}`)
    // Implement actual transfer logic here
    return new Promise<void>((resolve) => setTimeout(resolve, 1500))
  }

  const handleSubmitProposal = async (proposalData: any) => {
    console.log("Submitting proposal:", proposalData)
    // Implement actual proposal submission logic here
    return new Promise<void>((resolve) => setTimeout(resolve, 1500))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.gif"
              alt="QCAP Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div className="text-primary font-bold text-2xl glow-text">QCAP</div>
            <div className="text-xl font-bold hidden sm:block">Analytics Dashboard</div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="outline" className="gap-2 border-primary/50 hover:border-primary">
              <FileText className="h-4 w-4" />
              <span>Whitepaper</span>
            </Button>
            <Button 
              onClick={handleConnectWallet}
              className={
                isWalletConnected ? "w-full gap-2 glow-effect bg-green-600" : "w-full gap-2 border-primary/50"
              }
            >
              {isWalletConnected ? (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  {walletAddress}
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="sm:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur">
            <div className="container py-4 space-y-2">
              <Button variant="outline" className="w-full gap-2 border-primary/50 hover:border-primary">
                <FileText className="h-4 w-4" />
                <span>Whitepaper</span>
              </Button>
              <Button 
                onClick={handleConnectWallet}
                className={
                  isWalletConnected ? "w-full gap-2 glow-effect" : "w-full gap-2 border-primary/50 hover:border-primary"
                }
              >
                {isWalletConnected ? (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    {walletAddress}
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 container py-6">
        
          {isWalletConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <>
                <Button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="bg-[#1a2035] hover:bg-[#2a3045] text-white h-auto py-4 flex flex-col items-center"
                >
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="text-lg font-medium">Purchase QCAP</span>
                  <span className="text-xs text-gray-400 mt-1">Buy QCAP tokens</span>
                </Button>

                <Button
                  onClick={() => setIsMuslimIdModalOpen(true)}
                  className="bg-[#1a2035] hover:bg-[#2a3045] text-white h-auto py-4 flex flex-col items-center"
                >
                  <UserCircle className="w-6 h-6 mb-2" />
                  <span className="text-lg font-medium">MuslimID</span>
                  <span className="text-xs text-gray-400 mt-1">Register your wallet as MuslimID</span>
                </Button>

                <Button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="bg-[#1a2035] hover:bg-[#2a3045] text-white h-auto py-4 flex flex-col items-center"
                >
                  <ArrowRightLeft className="w-6 h-6 mb-2" />
                  <span className="text-lg font-medium">Transfer Stocks</span>
                  <span className="text-xs text-gray-400 mt-1">Transfer between SCs</span>
                </Button>

                <Button
                  onClick={() => setIsSubmitProposalModalOpen(true)}
                  className="bg-[#1a2035] hover:bg-[#2a3045] text-white h-auto py-4 flex flex-col items-center"
                >
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-lg font-medium">Submit Proposal</span>
                  <span className="text-xs text-gray-400 mt-1">Create a new proposal</span>
                </Button>
              </>
            </div>
          ) : (
            <div className="bg-[#1a2035] rounded-lg p-6 mb-6 flex flex-col items-center justify-center">
              <AlertCircle className="w-12 h-12 text-blue-500 mb-3" />
              <h3 className="text-xl font-medium mb-2">Wallet Not Connected</h3>
              <p className="text-gray-400 text-center mb-4">
                Connect your wallet to access QCAP features including purchasing, MuslimID registration, stock transfers,
                and proposal submission.
              </p>
              <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            </div>
          )}

        <Tabs defaultValue="voting" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-secondary">            
            <TabsTrigger value="voting" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Voting System
            </TabsTrigger>
            <TabsTrigger value="allocation" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Allocation
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              General Data
            </TabsTrigger>
            <TabsTrigger value="qearn" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Qearn
            </TabsTrigger>
          </TabsList>
          <TabsContent value="voting">
            <VotingDashboard isWalletConnected={isWalletConnected} />
          </TabsContent>
          <TabsContent value="allocation" className="space-y-4">
            <AllocationDashboard />
          </TabsContent>
          <TabsContent value="general" className="space-y-4">
            <GeneralDataDashboard />
          </TabsContent>
          <TabsContent value="qearn" className="space-y-4">
            <QearnDashboard />
          </TabsContent>
        </Tabs>
      </main>
      <PurchaseQcapModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchase={handlePurchaseQcap}
      />

      <MuslimIdModal
        isOpen={isMuslimIdModalOpen}
        onClose={() => setIsMuslimIdModalOpen(false)}
        currentWalletAddress={walletAddress}
        onRegister={handleRegisterMuslimId}
      />

      <TransferStocksModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransfer={handleTransferStocks}
      />

      <SubmitProposalModal
        isOpen={isSubmitProposalModalOpen}
        onClose={() => setIsSubmitProposalModalOpen(false)}
        onSubmit={handleSubmitProposal}
      />

    </div>    
  )
} 