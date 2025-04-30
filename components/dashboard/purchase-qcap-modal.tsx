"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PurchaseQcapModalProps {
  isOpen: boolean
  onClose: () => void
  onPurchase: (amount: number) => Promise<void>
}

export function PurchaseQcapModal({ isOpen, onClose, onPurchase }: PurchaseQcapModalProps) {
  const [amount, setAmount] = useState<string>("100")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePurchase = async () => {
    try {
      setIsLoading(true)
      await onPurchase(Number(amount))
      onClose()
    } catch (error) {
      console.error("Failed to purchase QCAP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1424] text-white border-[#1a2035]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Purchase QCAP</DialogTitle>
          <DialogDescription className="text-gray-400">Enter the amount of QCAP you want to purchase</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 flex items-center">
              <div className="relative flex-1">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-[#1a2035] border-[#2a3045] text-white pr-20"
                  min="1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 bg-[#1a2035] border-l border-[#2a3045] rounded-r-md">
                  QCAP
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 mt-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Estimated cost:</span>
              <span>{(Number(amount) * 0.05).toFixed(2)} ETH</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[#2a3045] text-white hover:bg-[#2a3045]">
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isLoading || !amount || Number(amount) <= 0}
            className="bg-[#0066FF] hover:bg-[#0052cc] text-white"
          >
            {isLoading ? "Processing..." : "Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
