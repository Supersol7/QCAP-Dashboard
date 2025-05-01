"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock } from "lucide-react"

interface StakingModalProps {
  isOpen: boolean
  onClose: () => void
  onStake: (amount: number) => Promise<void>
  onUnstake: (amount: number) => Promise<void>
  stakedAmount: number
  qcapBalance: number
  stakingRewards: number
}

export function StakingModal({
  isOpen,
  onClose,
  onStake,
  onUnstake,
  stakedAmount,
  qcapBalance,
  stakingRewards,
}: StakingModalProps) {
  const [stakeAmount, setStakeAmount] = useState<string>("100")
  const [unstakeAmount, setUnstakeAmount] = useState<string>("0")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("stake")

  const handleStake = async () => {
    try {
      setIsLoading(true)
      await onStake(Number(stakeAmount))
      setStakeAmount("100")
    } catch (error) {
      console.error("Failed to stake QCAP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnstake = async () => {
    try {
      setIsLoading(true)
      await onUnstake(Number(unstakeAmount))
      setUnstakeAmount("0")
    } catch (error) {
      console.error("Failed to unstake QCAP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaxStake = () => {
    setStakeAmount(qcapBalance.toString())
  }

  const handleMaxUnstake = () => {
    setUnstakeAmount(stakedAmount.toString())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1424] text-white border-[#1a2035]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">QCAP Staking</DialogTitle>
          <DialogDescription className="text-gray-400">Stake your QCAP tokens to earn rewards</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="bg-[#1a2035] p-4 rounded-md">
            <div className="text-sm text-gray-400">Total Staked</div>
            <div className="text-xl font-bold mt-1">{stakedAmount.toLocaleString()} QCAP</div>
          </div>
          <div className="bg-[#1a2035] p-4 rounded-md">
            <div className="text-sm text-gray-400">Rewards Earned</div>
            <div className="text-xl font-bold mt-1 text-green-500">{stakingRewards.toLocaleString()} QCAP</div>
          </div>
        </div>

        <Tabs defaultValue="stake" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-[#1a2035]">
            <TabsTrigger value="stake" className="data-[state=active]:bg-[#0066FF]">
              Stake
            </TabsTrigger>
            <TabsTrigger value="unstake" className="data-[state=active]:bg-[#0066FF]">
              Unstake
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stake" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Available Balance:</span>
                <span>{qcapBalance.toLocaleString()} QCAP</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-[#1a2035] border-[#2a3045] text-white pr-20"
                  min="1"
                  max={qcapBalance}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    variant="ghost"
                    onClick={handleMaxStake}
                    className="h-full px-3 text-xs text-[#0066FF] hover:text-blue-400"
                  >
                    MAX
                  </Button>
                  <div className="px-3 pointer-events-none text-gray-400 bg-[#1a2035] border-l border-[#2a3045] h-full flex items-center">
                    QCAP
                  </div>
                </div>
              </div>
              <div className="bg-[#1a2035] p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Staking APR:</span>
                  <span className="text-green-500">7%</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Lock Period:</span>
                  <span>7 days</span>
                </div>
              </div>
              <Button
                onClick={handleStake}
                disabled={isLoading || !stakeAmount || Number(stakeAmount) <= 0 || Number(stakeAmount) > qcapBalance}
                className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white"
              >
                {isLoading ? "Processing..." : "Stake QCAP"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="unstake" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Staked Balance:</span>
                <span>{stakedAmount.toLocaleString()} QCAP</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="bg-[#1a2035] border-[#2a3045] text-white pr-20"
                  min="1"
                  max={stakedAmount}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    variant="ghost"
                    onClick={handleMaxUnstake}
                    className="h-full px-3 text-xs text-[#0066FF] hover:text-blue-400"
                  >
                    MAX
                  </Button>
                  <div className="px-3 pointer-events-none text-gray-400 bg-[#1a2035] border-l border-[#2a3045] h-full flex items-center">
                    QCAP
                  </div>
                </div>
              </div>
              <div className="bg-[#1a2035] p-3 rounded-md flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-500">7 day unstaking period applies</span>
              </div>
              <Button
                onClick={handleUnstake}
                disabled={
                  isLoading || !unstakeAmount || Number(unstakeAmount) <= 0 || Number(unstakeAmount) > stakedAmount
                }
                className="w-full bg-[#0066FF] hover:bg-[#0052cc] text-white"
              >
                {isLoading ? "Processing..." : "Unstake QCAP"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
