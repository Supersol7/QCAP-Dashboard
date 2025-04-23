"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, BarChart } from "@/components/ui/charts"
import { ArrowUpRight, DollarSign, TrendingUp, Users, Share2, Recycle } from "lucide-react"

// Mock data - replace with actual API calls
const mockCirculatingSupply = 10000000
const mockQcapAvailableToSell = [
  { year: 2024, amount: 2000000 },
  { year: 2025, amount: 1500000 },
  { year: 2026, amount: 1000000 },
  { year: 2027, amount: 500000 },
  { year: 2028, amount: 250000 },
]

const mockRevenueData = {
  totalRevenue: 5000000,
  lastEpochRevenue: 75000,
  revenueByAsset: [
    { asset: "BTC", revenue: 2000000 },
    { asset: "ETH", revenue: 1500000 },
    { asset: "SOL", revenue: 1000000 },
    { asset: "AVAX", revenue: 500000 },
  ],
  revenueByEpoch: Array(100)
    .fill(null)
    .map((_, i) => ({
      epoch: i + 1,
      revenue: Math.floor(Math.random() * 100000) + 50000,
    })),
}

const mockQuData = {
  totalDistributed: 2500000,
  totalReinvested: 1500000,
  distributedToQvault: 500000,
  distributedByEpoch: Array(100)
    .fill(null)
    .map((_, i) => ({
      epoch: i + 1,
      distributed: Math.floor(Math.random() * 50000) + 20000,
    })),
  reinvestedByEpoch: Array(100)
    .fill(null)
    .map((_, i) => ({
      epoch: i + 1,
      reinvested: Math.floor(Math.random() * 30000) + 10000,
    })),
}

const mockSharesData = [
  { sc: "SC1", shares: 1000 },
  { sc: "SC2", shares: 750 },
  { sc: "SC3", shares: 500 },
  { sc: "SC4", shares: 250 },
  { sc: "SC5", shares: 100 },
]

const mockMarketData = {
  circulatingSupply: 10000000,
  price: {
    qu: 2.5,
    usd: 2.5,
  },
  marketCap: {
    qu: 25000000,
    usd: 25000000,
  },
  quRaised: 5000000,
  holders: 2500,
  avgQcapPerHolder: 4000,
  richList: [
    { address: "0x1a2b...3c4d", qcap: 125000, percentage: 1.25 },
    { address: "0x5e6f...7g8h", qcap: 87500, percentage: 0.88 },
    { address: "0x9i0j...1k2l", qcap: 62500, percentage: 0.63 },
    { address: "0x3m4n...5o6p", qcap: 50000, percentage: 0.5 },
    { address: "0x7q8r...9s0t", qcap: 37500, percentage: 0.38 },
  ],
  scPositions: [
    { sc: "SC1", position: 1 },
    { sc: "SC2", position: 3 },
    { sc: "SC3", position: 5 },
    { sc: "SC4", position: 7 },
    { sc: "SC5", position: 10 },
  ],
  restrictedRevenue: {
    muslim: 250000,
  },
  priceData: {
    primary: 2.0,
    secondary: {
      bid: 1.95,
      ask: 2.05,
    },
  },
}

export default function GeneralDataDashboard() {
  const [timeframe, setTimeframe] = useState("100")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Circulating Supply</CardTitle>
          <CardDescription>Total QCAP currently in circulation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{mockCirculatingSupply.toLocaleString()}</div>
          <div className="mt-4 h-[200px]">
            <LineChart
              data={Array(100)
                .fill(null)
                .map((_, i) => ({
                  epoch: i + 1,
                  supply: 8000000 + i * 20000,
                }))}
              xField="epoch"
              yField="supply"
              categories={["supply"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QCAP Available to Sell</CardTitle>
          <CardDescription>Amount available per year (changes based on sold QCAP)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <BarChart data={mockQcapAvailableToSell} xField="year" yField="amount" categories={["amount"]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Total and recent revenue metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Total Revenue</div>
              <div className="text-3xl font-bold">{mockRevenueData.totalRevenue.toLocaleString()} Qu</div>
            </div>
            <div>
              <div className="text-sm font-medium">Last Epoch Revenue</div>
              <div className="text-2xl font-bold">{mockRevenueData.lastEpochRevenue.toLocaleString()} Qu</div>
            </div>
            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Revenue by Asset Type</div>
              <div className="space-y-2">
                {mockRevenueData.revenueByAsset.map((asset) => (
                  <div key={asset.asset} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                      <span>{asset.asset}</span>
                    </div>
                    <span>{asset.revenue.toLocaleString()} Qu</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Revenue Per Epoch</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Revenue earned for the last {timeframe} epochs</span>
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="100" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <LineChart
              data={mockRevenueData.revenueByEpoch.slice(0, Number.parseInt(timeframe))}
              xField="epoch"
              yField="revenue"
              categories={["revenue"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Qu Distribution</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Qu distributed for the last {timeframe} epochs</span>
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="100" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Share2 className="h-8 w-8 text-primary" />
                  <div className="text-sm font-medium">Total Distributed</div>
                  <div className="text-2xl font-bold">{mockQuData.totalDistributed.toLocaleString()} Qu</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Recycle className="h-8 w-8 text-primary" />
                  <div className="text-sm font-medium">Total Reinvested</div>
                  <div className="text-2xl font-bold">{mockQuData.totalReinvested.toLocaleString()} Qu</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Users className="h-8 w-8 text-primary" />
                  <div className="text-sm font-medium">To QVAULT Shareholders</div>
                  <div className="text-2xl font-bold">{mockQuData.distributedToQvault.toLocaleString()} Qu</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="h-[300px]">
            <LineChart
              data={mockQuData.distributedByEpoch.slice(0, Number.parseInt(timeframe))}
              xField="epoch"
              yField="distributed"
              categories={["distributed"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Qu Reinvested</CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>Qu reinvested for the last {timeframe} epochs</span>
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="100" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <LineChart
              data={mockQuData.reinvestedByEpoch.slice(0, Number.parseInt(timeframe))}
              xField="epoch"
              yField="reinvested"
              categories={["reinvested"]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shares per SC</CardTitle>
          <CardDescription>Number of shares from each SC we hold</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <BarChart data={mockSharesData} xField="sc" yField="shares" categories={["shares"]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QCAP Market Cap</CardTitle>
          <CardDescription>Current market metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Market Cap</div>
              <div className="flex gap-2">
                <div className="text-2xl font-bold">{mockMarketData.marketCap.qu.toLocaleString()} Qu</div>
                <div className="text-2xl font-bold text-muted-foreground">
                  ${mockMarketData.marketCap.usd.toLocaleString()}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Price</div>
              <div className="flex gap-2">
                <div className="text-2xl font-bold">{mockMarketData.price.qu} Qu</div>
                <div className="text-2xl font-bold text-muted-foreground">${mockMarketData.price.usd}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QCAP Primary Market</CardTitle>
          <CardDescription>Qu raised through QCAP primary market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-2">
            <ArrowUpRight className="h-12 w-12 text-primary" />
            <div className="text-3xl font-bold">{mockMarketData.quRaised.toLocaleString()} Qu</div>
            <div className="text-sm text-muted-foreground">Total raised from primary market sales</div>
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium mb-2">Historical Primary Market Sales</div>
            <div className="h-[150px]">
              <LineChart
                data={[
                  { date: "Jan", amount: 500000 },
                  { date: "Feb", amount: 750000 },
                  { date: "Mar", amount: 1000000 },
                  { date: "Apr", amount: 1250000 },
                  { date: "May", amount: 1500000 },
                  { date: "Jun", amount: 2000000 },
                ]}
                xField="date"
                yField="amount"
                categories={["amount"]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holders</CardTitle>
          <CardDescription>QCAP holder statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Number of Holders</div>
              <div className="text-2xl font-bold">{mockMarketData.holders.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Average QCAP per Holder</div>
              <div className="text-2xl font-bold">{mockMarketData.avgQcapPerHolder.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>QCAP Rich List</CardTitle>
          <CardDescription>Top QCAP holders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>QCAP Amount</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMarketData.richList.map((holder) => (
                <TableRow key={holder.address}>
                  <TableCell>{holder.address}</TableCell>
                  <TableCell>{holder.qcap.toLocaleString()}</TableCell>
                  <TableCell>{holder.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>SC Rich List Positions</CardTitle>
          <CardDescription>Position that QCAP has in the rich lists of the SCs we hold</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SC</TableHead>
                <TableHead>Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMarketData.scPositions.map((item) => (
                <TableRow key={item.sc}>
                  <TableCell>{item.sc}</TableCell>
                  <TableCell>#{item.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restricted Revenue</CardTitle>
          <CardDescription>Revenue with restrictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Muslim Restricted</div>
              <div className="text-2xl font-bold">{mockMarketData.restrictedRevenue.muslim.toLocaleString()} Qu</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Price Data</CardTitle>
          <CardDescription>Primary and secondary market prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div className="text-sm font-medium">Primary Market</div>
                  <div className="text-2xl font-bold">{mockMarketData.priceData.primary} Qu</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ArrowUpRight className="h-8 w-8 text-primary" />
                  <div className="text-sm font-medium">Secondary Bid</div>
                  <div className="text-2xl font-bold">{mockMarketData.priceData.secondary.bid} Qu</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <div className="text-sm font-medium">Secondary Ask</div>
                  <div className="text-2xl font-bold">{mockMarketData.priceData.secondary.ask} Qu</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
