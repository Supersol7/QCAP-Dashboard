"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart } from "@/components/ui/charts"
import { Clock, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data - replace with actual API calls
const mockQcapStaked = 1250000

const mockTimeSeriesData = [
  { time: "2025/04/21 00:00", value: 500000 },
  { time: "2025/04/22 60:00", value: 670000 },
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
    votesFor: 375000,
    votesAgainst: 125000,
    quorum: 500000,
    quorumRequired: 400000,
    timeRemaining: "2 days",
    fee: 100,
    type: "Parameter Change",
  },
  {
    id: "QCAP-2",
    title: "Add new asset type",
    status: "Active",
    votesFor: 250000,
    votesAgainst: 50000,
    quorum: 300000,
    quorumRequired: 400000,
    timeRemaining: "3 days",
    fee: 200,
    type: "Asset Addition",
  },
  {
    id: "QCAP-3",
    title: "Modify governance rules",
    status: "Completed",
    votesFor: 625000,
    votesAgainst: 125000,
    quorum: 750000,
    quorumRequired: 400000,
    timeRemaining: "0 days",
    fee: 150,
    type: "Governance",
  },
]

const mockHistoricalProposals = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: `QCAP-${i + 1}`,
    title: `Historical Proposal ${i + 1}`,
    status: Math.random() > 0.3 ? "Passed" : "Failed",
    votesFor: Math.floor(Math.random() * 800000),
    votesAgainst: Math.floor(Math.random() * 400000),
  }))

const mockAddressesEntitled = [
  "GVWPFG...CHCNJ",
  "FREFAF...ADFDS",
  "GVWYER...YJTYJ",
  "MSDFGS...RTESG",
  "REGRGS...JMFDD",
  "GFDSRG...MFHGH",
]

export default function VotingDashboard() {
  const [historicalCount, setHistoricalCount] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<"all" | "passed" | "failed">("all")
  const [votersPage, setVotersPage] = useState(1)
  const itemsPerPage = 5
  const votersPerPage = 5
  const [timePeriod, setTimePeriod] = useState("1D")

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
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

  const getTimeRangeData = (period: string) => {
    const now = new Date()
    const data = []
    
    switch (period) {
      case "1D":
        // 12 two-hour intervals for 1 day
        for (let i = 12; i >= 0; i--) {
          const time = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000))
          data.push({
            time: time.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }).replace(',', ''),
            value: Math.floor(500000 + Math.random() * 1750000)
          })
        }
        break
        
      case "7D":
        // 7 daily points
        for (let i = 7; i >= 0; i--) {
          const time = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
          data.push({
            time: time.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            value: Math.floor(500000 + Math.random() * 1750000)
          })
        }
        break
        
      case "1M":
        // 15 two-day intervals for 1 month
        for (let i = 15; i >= 0; i--) {
          const time = new Date(now.getTime() - (i * 2 * 24 * 60 * 60 * 1000))
          data.push({
            time: time.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            value: Math.floor(500000 + Math.random() * 1750000)
          })
        }
        break
        
      case "1Y":
        // 12 monthly points
        for (let i = 12; i >= 0; i--) {
          const time = new Date(now.getTime() - (i * 30 * 24 * 60 * 60 * 1000))
          data.push({
            time: time.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            value: Math.floor(500000 + Math.random() * 1750000)
          })
        }
        break
        
      case "All":
        // Format the existing mockTimeSeriesData dates
        return mockTimeSeriesData.map(item => ({
          time: new Date(item.time).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          value: item.value
        }))
    }
    
    return data
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>QCAP Staked in Real Time</CardTitle>
              <CardDescription>Total amount of QCAP currently staked in the system</CardDescription>
            </div>
            <div className="flex bg-[#1a1625] rounded-md p-1">
              {["1D", "7D", "1M", "1Y", "All"].map((period) => (
                <Button
                  key={period}
                  variant="ghost"
                  size="sm"
                  className={`px-3 h-7 rounded-[4px] text-sm font-medium ${
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
          <div className="mt-4 h-[200px]">
            <LineChart
              data={getTimeRangeData(timePeriod)}
              xField="time"
              yField="value"
              categories={["value"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>IDs with Voting Power</CardTitle>
          <CardDescription>List of IDs with their voting power for the current epoch</CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopyAddress(voter.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
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

      <Card>
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
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Active Proposals</CardTitle>
          <CardDescription>Live results of each proposal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {mockProposals
              .filter((p) => p.status === "Active")
              .map((proposal) => (
                <div key={proposal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={proposal.quorum >= proposal.quorumRequired ? "default" : "outline"}>
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
                  <div className="flex justify-between text-sm">
                    <span>For: {proposal.votesFor.toLocaleString()} QCAP</span>
                    <span>Against: {proposal.votesAgainst.toLocaleString()} QCAP</span>
                    <span>
                      Quorum: {proposal.quorum.toLocaleString()} / {proposal.quorumRequired.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-sm text-right">
                      {Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100)}%
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{
                          width: `${(proposal.quorum / proposal.quorumRequired) * 100 > 100 ? 100 : (proposal.quorum / proposal.quorumRequired) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="w-24 text-sm text-right">
                      {Math.round((proposal.quorum / proposal.quorumRequired) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Historical Proposals</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Track of the last {historicalCount} proposals and their results</span>
            <div className="flex gap-2">
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
                onValueChange={(value) => {
                  setHistoricalCount(Number.parseInt(value))
                }}
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
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-mono">{proposal.id}</TableCell>
                  <TableCell>{proposal.title}</TableCell>
                  <TableCell>
                    <Badge variant={proposal.status === "Passed" ? "default" : "destructive"}>{proposal.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {proposal.votesFor.toLocaleString()} / {proposal.votesAgainst.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      <Card>
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

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Wallet Staking & Voting</CardTitle>
          <CardDescription>Real-time data on wallet staking and voting power</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Staked Amount per Wallet</h3>
              <div className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Wallet 1", value: 45000 },
                    { name: "Wallet 2", value: 125000 },
                    { name: "Wallet 3", value: 15000 },
                    { name: "Wallet 4", value: 85000 },
                    { name: "Wallet 5", value: 2500 },
                    { name: "Wallet 6", value: 95000 },
                    { name: "Wallet 7", value: 35000 },
                    { name: "Wallet 8", value: 105000 },
                    { name: "Wallet 9", value: 7500 },
                    { name: "Wallet 10", value: 115000 },
                    { name: "Wallet 11", value: 25000 },
                    { name: "Wallet 12", value: 75000 },
                    { name: "Wallet 13", value: 5000 },
                    { name: "Wallet 14", value: 65000 },
                    { name: "Wallet 15", value: 20000 },
                    { name: "Wallet 16", value: 55000 },
                    { name: "Wallet 17", value: 10000 },
                    { name: "Wallet 18", value: 40000 },
                    { name: "Wallet 19", value: 30000 },
                    { name: "Wallet 20", value: 12500 }
                  ]}
                  xField="name"
                  yField="value"
                  categories={["value"]}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Voting Power per Wallet</h3>
              <div className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Wallet 1", value: 45000 },
                    { name: "Wallet 2", value: 125000 },
                    { name: "Wallet 3", value: 15000 },
                    { name: "Wallet 4", value: 85000 },
                    { name: "Wallet 5", value: 2500 },
                    { name: "Wallet 6", value: 95000 },
                    { name: "Wallet 7", value: 35000 },
                    { name: "Wallet 8", value: 105000 },
                    { name: "Wallet 9", value: 7500 },
                    { name: "Wallet 10", value: 115000 },
                    { name: "Wallet 11", value: 25000 },
                    { name: "Wallet 12", value: 75000 },
                    { name: "Wallet 13", value: 5000 },
                    { name: "Wallet 14", value: 65000 },
                    { name: "Wallet 15", value: 20000 },
                    { name: "Wallet 16", value: 55000 },
                    { name: "Wallet 17", value: 10000 },
                    { name: "Wallet 18", value: 40000 },
                    { name: "Wallet 19", value: 30000 },
                    { name: "Wallet 20", value: 12500 }
                  ]}
                  xField="name"
                  yField="value"
                  categories={["value"]}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Addresses Entitled to Raise Proposals</CardTitle>
          <CardDescription>List of addresses that can create new proposals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {mockAddressesEntitled.map((address, index) => (
              <div
                key={address}
                className={`p-3 rounded-md border ${
                  address === "0xConnectedWallet" ? "bg-primary/10 border-primary" : "border-border/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{address}</span>
                  {address === "0xConnectedWallet" && (
                    <Badge variant="outline" className="bg-primary/20">
                      Connected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
