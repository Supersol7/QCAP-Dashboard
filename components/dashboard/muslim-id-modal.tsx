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
import { CheckCircle } from "lucide-react"

interface MuslimIdModalProps {
  isOpen: boolean
  onClose: () => void
  currentWalletAddress: string
  onRegister: (name: string) => Promise<void>
}

export function MuslimIdModal({ isOpen, onClose, currentWalletAddress, onRegister }: MuslimIdModalProps) {
  const [name, setName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRegistered, setIsRegistered] = useState<boolean>(false)

  const handleRegister = async () => {
    try {
      setIsLoading(true)
      await onRegister(name)
      setIsRegistered(true)
    } catch (error) {
      console.error("Failed to register MuslimID:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1424] text-white border-[#1a2035]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register MuslimID</DialogTitle>
          <DialogDescription className="text-gray-400">Register your wallet address as a MuslimID</DialogDescription>
        </DialogHeader>

        {!isRegistered ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wallet" className="text-right">
                  Wallet
                </Label>
                <Input
                  id="wallet"
                  value={currentWalletAddress}
                  readOnly
                  className="col-span-3 bg-[#1a2035] border-[#2a3045] text-gray-400"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3 bg-[#1a2035] border-[#2a3045] text-white"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="border-[#2a3045] text-white hover:bg-[#2a3045]">
                Cancel
              </Button>
              <Button
                onClick={handleRegister}
                disabled={isLoading || !name}
                className="bg-[#0066FF] hover:bg-[#0052cc] text-white"
              >
                {isLoading ? "Processing..." : "Register"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Registration Successful</h3>
            <p className="text-gray-400 text-center mb-6">Your wallet has been successfully registered as a MuslimID</p>
            <Button onClick={onClose} className="bg-[#0066FF] hover:bg-[#0052cc] text-white">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
