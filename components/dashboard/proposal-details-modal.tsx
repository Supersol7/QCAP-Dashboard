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
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock } from "lucide-react"

// Updated interface to match the new proposal structure
interface Parameter {
  name: string
  label: string
  type: string
  value: string
  suffix?: string
}

interface ProposalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: Proposal
  onVote: (proposalId: string, vote: "for" | "against") => Promise<void>
}

interface Proposal {
  id: string
  title: string // Still needed for display purposes
  type: string
  parameters: Parameter[]
  participation: {
    total: number
    voted: number
  }
  votes: {
    for: number
    against: number
  }
  timeRemaining: string
  status: "active" | "passed" | "rejected" | "pending"
  userHasVoted?: boolean
  userVote?: "for" | "against"
}

export function ProposalDetailsModal({ isOpen, onClose, proposal, onVote }: ProposalDetailsModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userVote, setUserVote] = useState<"for" | "against" | undefined>(proposal.userVote)

  const handleVote = async (vote: "for" | "against") => {
    try {
      setIsLoading(true)
      await onVote(proposal.id, vote)
      setUserVote(vote)
    } catch (error) {
      console.error("Failed to vote:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalVotes = proposal.votes.for + proposal.votes.against
  const forPercentage = totalVotes > 0 ? Math.round((proposal.votes.for / totalVotes) * 100) : 0
  const againstPercentage = totalVotes > 0 ? Math.round((proposal.votes.against / totalVotes) * 100) : 0
  const participationPercentage = Math.round((proposal.participation.voted / proposal.participation.total) * 100)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0f1424] text-white border-[#1a2035]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded">{proposal.type}</div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>{proposal.timeRemaining}</span>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold mt-2">{proposal.title}</DialogTitle>
          <DialogDescription className="text-gray-400">Proposal ID: {proposal.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Parameters</h3>
              <div className="grid grid-cols-1 gap-2">
                {proposal.parameters.map((param) => (
                  <div key={param.name} className="bg-[#1a2035] p-3 rounded-md">
                    <div className="text-xs text-gray-400">{param.label}</div>
                    <div className="font-medium mt-1">
                      {param.value}
                      {param.suffix && <span className="text-gray-400 ml-1">{param.suffix}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Voting Results</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>For</span>
                    </div>
                    <span>
                      {forPercentage}% ({proposal.votes.for})
                    </span>
                  </div>
                  <Progress value={forPercentage} className="h-2 bg-[#1a2035]" indicatorClassName="bg-green-500" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Against</span>
                    </div>
                    <span>
                      {againstPercentage}% ({proposal.votes.against})
                    </span>
                  </div>
                  <Progress value={againstPercentage} className="h-2 bg-[#1a2035]" indicatorClassName="bg-red-500" />
                </div>

                <div className="pt-2">
                  <div className="flex justify-between mb-1">
                    <span>Participation</span>
                    <span>
                      {participationPercentage}% ({proposal.participation.voted}/{proposal.participation.total})
                    </span>
                  </div>
                  <Progress value={participationPercentage} className="h-2 bg-[#1a2035]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {!userVote && proposal.status === "active" ? (
            <>
              <Button
                onClick={() => handleVote("against")}
                disabled={isLoading}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-400 w-full sm:w-auto"
              >
                Vote Against
              </Button>
              <Button
                onClick={() => handleVote("for")}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                Vote For
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 mr-auto">
              {userVote && (
                <div className="flex items-center gap-1 bg-[#1a2035] px-3 py-1.5 rounded-md">
                  <span>Your vote:</span>
                  {userVote === "for" ? (
                    <span className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" /> For
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500">
                      <XCircle className="h-4 w-4 mr-1" /> Against
                    </span>
                  )}
                </div>
              )}
              <Button onClick={onClose} className="ml-auto bg-[#0066FF] hover:bg-[#0052cc] text-white">
                Close
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
