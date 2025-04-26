"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart } from "@/components/ui/charts"
import { Clock, Copy, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock data - replace with actual API calls
const mockQcapStaked = 1250000

const mockTimeSeriesData = [
  { time: "2025/04/21 00:00", value: 500000 },
  { time: "2025/04/22 06:00", value: 670000 },
  { time: "2025/04/23 12:00", value: 935000 },
  { time: "2025/04/24 15:00", value: 1040000 },
  { time: "2025/04/25 20:00", value: 1245000 },
  { time: "2025/04/26 23:00", value: 2250000 },
]


const mockVoters = [
  { id: "GVWPFG...CHCNJ", votingPower: 125000, percentage: 10 },
  { id: "FREFAF...ADFDS", votingPower: 87500, percentage: 7 },
  { id: "GVWYER...YJTYJ", votingPower: 62500, percentage: 5 },
  { id: "MSDFGS...RTESG", votingPower: 50000, percentage: 4 },
  { id: "REGRGS...JMFDD", votingPower: 37500, percentage: 3 },
]

const mockProposals = [
  {
    id: "QCAP-1",
    title: "Increase staking rewards",
    status: "Active",
    participatingComputers: 450, // Out of 676 total computers
    votesFor: 280,
    votesAgainst: 170,
    totalComputers: 676,
    timeRemaining: "2 days",
    fee: 100,
    type: "Parameter Change",
  },
  {
    id: "QCAP-2",
    title: "Add new asset type",
    status: "Active",
    participatingComputers: 320,
    votesFor: 180,
    votesAgainst: 140,
    totalComputers: 676,
    timeRemaining: "3 days",
    fee: 200,
    type: "Asset Addition",
  },
  {
    id: "QCAP-3",
    title: "Modify governance rules",
    status: "Completed",
    participatingComputers: 520,
    votesFor: 380,
    votesAgainst: 140,
    totalComputers: 676,
    timeRemaining: "0 days",
    fee: 150,
    type: "Governance",
  },
]

const mockHistoricalProposals = Array(20)
  .fill(null)
  .map((_, i) => {
    // Use deterministic values based on index instead of random
    const participatingComputers = 100 + (i * 30) % 576 // Will cycle through values between 100 and 676
    // Alternate between passed and failed proposals with varying vote distributions
    const isPass = i % 3 !== 0 // Makes roughly 2/3 pass and 1/3 fail
    const votesFor = isPass 
      ? Math.floor(participatingComputers * (0.55 + (i % 3) * 0.1)) // 55-75% in favor for passing
      : Math.floor(participatingComputers * (0.35 + (i % 2) * 0.1)) // 35-45% in favor for failing
    const passed = votesFor > participatingComputers / 2

    return {
      id: `QCAP-${i + 1}`,
      title: `Historical Proposal ${i + 1}`,
      status: passed ? "Passed" : "Failed",
      participatingComputers,
      votesFor,
      votesAgainst: participatingComputers - votesFor,
      totalComputers: 676
    }
  })

const mockAddressesEntitled = [
  "PLXEGMWKWTEFOALGIKWFOJSMGQTCHQTUXVPLSPMJGBJDNPJBXYSQLPUBAZGK",
  "PLXEGMWKWTEFOALGIKWFOJSMGQTCHQTUXVPLSPMJGBSDFSJBXYSQLPUBAZGK",
  "PLXEGMWKWTEFOALGIKWFOJSMGQTCHQTUXVPLSPMJASDANPJBXYSQLPUBAZGK",
  "PLXEGMWKWTEFOALGIKWFOJSMGQTCHQTUXVPLSPMJGFJDNPJBXYSQLPUBAZGK",
  "PLXEGMWKWTEFOALGIKWFOJSMGQTCHQTUXVPDFSSJGBJDNPJBXYSQLPUBAZGK",
  "PLXEGMWKWTEFOALGIKWFOJSMGQTCHQTUXVPLTREJGBJDNPJBXYSQLPUBAZGK",
]

// Add mock data for wallet staking and voting
const mockWalletData = [
  {
    address: "GVWPFG...CHCNJ",
    stakedAmount: 125000,
    votingPower: 125000,
    votingPowerPercentage: 70,
    lastVote: "2024-03-15",
    proposalsVoted: 12,
    proposalsCreated: 2,
    status: "active"
  },
  {
    address: "FREFAF...ADFDS",
    stakedAmount: 87500,
    votingPower: 87500,
    votingPowerPercentage: 50,
    lastVote: "2024-03-14",
    proposalsVoted: 8,
    proposalsCreated: 1,
    status: "active"
  },
  {
    address: "GVWYER...YJTYJ",
    stakedAmount: 62500,
    votingPower: 62500,
    votingPowerPercentage: 30,
    lastVote: "2024-03-13",
    proposalsVoted: 5,
    proposalsCreated: 0,
    status: "active"
  },
  {
    address: "MSDFGS...RTESG",
    stakedAmount: 50000,
    votingPower: 50000,
    votingPowerPercentage: 26,
    lastVote: "2024-03-12",
    proposalsVoted: 3,
    proposalsCreated: 0,
    status: "active"
  },
  {
    address: "REGRGS...JMFDD",
    stakedAmount: 37500,
    votingPower: 37500,
    votingPowerPercentage: 3,
    lastVote: "2024-03-11",
    proposalsVoted: 2,
    proposalsCreated: 0,
    status: "active"
  }
];

export default function VotingDashboard() {
  const [historicalCount, setHistoricalCount] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<"all" | "passed" | "failed">("all")
  const [votersPage, setVotersPage] = useState(1)
  const [copiedAddresses, setCopiedAddresses] = useState<Record<string, boolean>>({})
  const [timeSeriesData, setTimeSeriesData] = useState(mockTimeSeriesData)
  const itemsPerPage = 5
  const votersPerPage = 5
  const [timePeriod, setTimePeriod] = useState("1D")

  // Generate time-based data after initial render
  useEffect(() => {
    const getTimeRangeData = (period: string) => {
      const now = new Date()
      const data = []
      
      switch (period) {
        case "1D":
          // 12 two-hour intervals for 1 day
          for (let i = 12; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000))
            const baseValue = 500000
            const randomVariation = Math.floor(Math.random() * 200000)
            data.push({
              time: time.toISOString().slice(0, 16).replace('T', ' '),
              value: baseValue + randomVariation
            })
          }
          break
          
        case "7D":
          // 7 daily points
          for (let i = 7; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
            const baseValue = 500000
            const randomVariation = Math.floor(Math.random() * 300000)
            data.push({
              time: time.toISOString().slice(0, 10),
              value: baseValue + randomVariation
            })
          }
          break
          
        case "1M":
          // 15 two-day intervals for 1 month
          for (let i = 15; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 2 * 24 * 60 * 60 * 1000))
            const baseValue = 500000
            const randomVariation = Math.floor(Math.random() * 400000)
            data.push({
              time: time.toISOString().slice(0, 10),
              value: baseValue + randomVariation
            })
          }
          break
          
        case "1Y":
          // 12 monthly points
          for (let i = 12; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 30 * 24 * 60 * 60 * 1000))
            const baseValue = 500000
            const randomVariation = Math.floor(Math.random() * 500000)
            data.push({
              time: time.toISOString().slice(0, 10),
              value: baseValue + randomVariation
            })
          }
          break
          
        case "All":
          return timeSeriesData
      }
      
      return data
    }

    // Update time series data when time period changes
    setTimeSeriesData(getTimeRangeData(timePeriod))
  }, [timePeriod]) // Only re-run when timePeriod changes

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddresses(prev => ({ ...prev, [address]: true }))
    setTimeout(() => {
      setCopiedAddresses(prev => ({ ...prev, [address]: false }))
    }, 2000)
  }

  const getExplorerLink = (address: string) => {
    // Replace with your actual explorer URL
    return `https://explorer.example.com/address/${address}`
  }

  const filteredProposals = mockHistoricalProposals
    .slice(0, historicalCount)
    .filter(proposal => 
      statusFilter === "all" || 
      (statusFilter === "passed" && proposal.status === "Passed") ||
      (statusFilter === "failed" && proposal.status === "Failed")
    )

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProposals = filteredProposals.slice(startIndex, endIndex)

  const totalVoterPages = Math.ceil(mockVoters.length / votersPerPage)
  const voterStartIndex = (votersPage - 1) * votersPerPage
  const voterEndIndex = voterStartIndex + votersPerPage
  const currentVoters = mockVoters.slice(voterStartIndex, voterEndIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, historicalCount])

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <CardTitle>QCAP Staked in Real Time</CardTitle>
              <CardDescription>Total amount of QCAP currently staked in the system</CardDescription>
            </div>
            <div className="flex flex-wrap bg-[#1a1625] rounded-md p-1">
              {["1D", "7D", "1M", "1Y", "All"].map((period) => (
                <Button
                  key={period}
                  variant="ghost"
                  size="sm"
                  className={`px-2 h-7 rounded-[4px] text-sm font-medium ${
                    timePeriod === period 
                      ? "bg-[#8b5cf6] text-white" 
                      : "text-gray-400 hover:text-white hover:bg-[#2a2635]"
                  }`}
                  onClick={() => setTimePeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary glow-text">{mockQcapStaked.toLocaleString()}</div>
          <div className="mt-4 h-[200px] w-full overflow-x-auto">
            <div className="min-w-[500px] h-full">
              <LineChart
                data={timeSeriesData}
                xField="time"
                yField="value"
                categories={["value"]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>IDs with Voting Power</CardTitle>
          <CardDescription>List of IDs with their voting power for the current epoch</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Voting Power</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVoters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        {voter.id}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopyAddress(voter.id)}
                              >
                                {copiedAddresses[voter.id] ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedAddresses[voter.id] ? "Copied!" : "Copy address"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <a
                          href={getExplorerLink(voter.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{voter.votingPower.toLocaleString()}</TableCell>
                    <TableCell>{voter.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {voterStartIndex + 1}-{Math.min(voterEndIndex, mockVoters.length)} of {mockVoters.length} voters
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVotersPage((prev) => Math.max(prev - 1, 1))}
                disabled={votersPage === 1}
              >
                Previous
              </Button>
              {votersPage > 2 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVotersPage(1)}
                  >
                    1
                  </Button>
                  {votersPage > 3 && <span className="px-2">...</span>}
                </>
              )}
              {votersPage > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVotersPage(votersPage - 1)}
                >
                  {votersPage - 1}
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
              >
                {votersPage}
              </Button>
              {votersPage < totalVoterPages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVotersPage(votersPage + 1)}
                >
                  {votersPage + 1}
                </Button>
              )}
              {votersPage < totalVoterPages - 1 && (
                <>
                  {votersPage < totalVoterPages - 2 && <span className="px-2">...</span>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVotersPage(totalVoterPages)}
                  >
                    {totalVoterPages}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVotersPage((prev) => Math.min(prev + 1, totalVoterPages))}
                disabled={votersPage === totalVoterPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Quorum Requirements</CardTitle>
          <CardDescription>Current quorum settings for proposals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Current Quorum</span>
              <span className="font-medium text-primary">400,000 QCAP</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Min Quorum</span>
              <span className="font-medium">200,000 QCAP</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Max Quorum</span>
              <span className="font-medium">800,000 QCAP</span>
            </div>
          </div>
          <div className="pt-4">
            <div className="text-sm font-medium mb-2">Quorum Range</div>
            <div className="h-2 bg-muted rounded-full">
              <div className="h-2 bg-primary rounded-full w-[50%] relative">
                <div className="absolute -top-1 left-0 h-4 w-1 bg-muted-foreground rounded-full"></div>
                <div className="absolute -top-1 right-0 h-4 w-1 bg-muted-foreground rounded-full"></div>
                <div className="absolute -top-1 left-[50%] h-4 w-1 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>200K</span>
              <span>400K</span>
              <span>800K</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Proposal Fees</CardTitle>
          <CardDescription>Fees and time for each type of proposal</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Fee (QCAP)</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Parameter Change</TableCell>
                <TableCell>100</TableCell>
                <TableCell>3 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Asset Addition</TableCell>
                <TableCell>200</TableCell>
                <TableCell>5 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Governance</TableCell>
                <TableCell>150</TableCell>
                <TableCell>7 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Emergency</TableCell>
                <TableCell>300</TableCell>
                <TableCell>1 day</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Active Proposals</CardTitle>
          <CardDescription>Live results of each proposal (Total Computers: 676)</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[600px] space-y-8">
            {mockProposals
              .filter((p) => p.status === "Active")
              .map((proposal) => (
                <div key={proposal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={proposal.votesFor > proposal.participatingComputers / 2 ? "default" : "outline"}>
                        {proposal.id}
                      </Badge>
                      <h3 className="font-semibold">{proposal.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{proposal.type}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {proposal.timeRemaining} 
                      </div>
                    </div>
                  </div>
                  
                  {/* Participation Rate */}
                  <div className="flex justify-between text-sm">
                    <span>Participation: {proposal.participatingComputers} / {proposal.totalComputers} computers</span>
                    <span>{Math.round((proposal.participatingComputers / proposal.totalComputers) * 100)}%</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary/50 h-2.5 rounded-full"
                        style={{ width: `${(proposal.participatingComputers / proposal.totalComputers) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Voting Results */}
                  <div className="flex justify-between text-sm">
                    <span>Votes: For {proposal.votesFor} / Against {proposal.votesAgainst}</span>
                    <span>{Math.round((proposal.votesFor / proposal.participatingComputers) * 100)}% in favor</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${(proposal.votesFor / proposal.participatingComputers) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pass Threshold Indicator */}
                  <div className="relative w-full">
                    <div className="absolute top-[-20px] left-1/2 w-px h-4 bg-red-500"></div>
                    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-xs text-primary/50">
                      50% threshold
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Historical Proposals</CardTitle>
          <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>Track of the last {historicalCount} proposals and their results</span>
            <span className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "passed" | "failed") => setStatusFilter(value)}
              >
                <SelectTrigger className="w-24 bg-secondary border-border/50">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue={historicalCount.toString()}
                onValueChange={(value) => setHistoricalCount(Number.parseInt(value))}
              >
                <SelectTrigger className="w-20 bg-secondary border-border/50">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Votes (For/Against)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-mono">{proposal.id}</TableCell>
                    <TableCell>{proposal.title}</TableCell>
                    <TableCell>
                      <Badge variant={proposal.status === "Passed" ? "success" : "destructive"}>
                        {proposal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {proposal.participatingComputers} / {proposal.totalComputers}
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                        <div 
                          className="h-1.5 bg-primary rounded-full"
                          style={{ width: `${(proposal.participatingComputers / proposal.totalComputers) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {proposal.votesFor.toLocaleString()} / {proposal.votesAgainst.toLocaleString()}
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                        <div 
                          className="h-1.5 bg-primary rounded-full"
                          style={{ width: `${(proposal.votesFor / proposal.participatingComputers) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProposals.length)} of {filteredProposals.length} proposals
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {currentPage > 2 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                  {currentPage > 3 && <span className="px-2">...</span>}
                </>
              )}
              {currentPage > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  {currentPage - 1}
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
              >
                {currentPage}
              </Button>
              {currentPage < totalPages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  {currentPage + 1}
                </Button>
              )}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Wallet Staking & Voting</CardTitle>
          <CardDescription>Real-time data on wallet staking and voting power</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">          
          <div className="mt-6 min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Staked Amount</TableHead>
                  <TableHead>Voting Power</TableHead>
                  <TableHead>Last Vote</TableHead>
                  <TableHead className="text-center">Proposals Voted</TableHead>
                  <TableHead className="text-center">Proposals Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWalletData.map((wallet) => (
                  <TableRow key={wallet.address}>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        {wallet.address}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopyAddress(wallet.address)}
                              >
                                {copiedAddresses[wallet.address] ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedAddresses[wallet.address] ? "Copied!" : "Copy address"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>{wallet.stakedAmount.toLocaleString()} QCAP</TableCell>
                    <TableCell>
                      {wallet.votingPower.toLocaleString()} QCAP
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                        <div 
                          className="h-1.5 bg-primary rounded-full"
                          style={{ width: `${wallet.votingPowerPercentage}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{wallet.lastVote}</TableCell>
                    <TableCell className="text-center">{wallet.proposalsVoted}</TableCell>
                    <TableCell className="text-center">{wallet.proposalsCreated}</TableCell>
                    <TableCell>
                      <Badge variant={wallet.status === "active" ? "default" : "outline"}>
                        {wallet.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Addresses Entitled to Raise Proposals</CardTitle>
          <CardDescription>List of addresses that can create new proposals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mockAddressesEntitled.map((address) => (
              <div
                key={address}
                className="p-3 rounded-md border break-all"
              >
                <span className="font-mono text-sm">{address}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
