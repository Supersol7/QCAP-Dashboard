import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VotingDashboard from "@/components/voting-dashboard"
import AllocationDashboard from "@/components/allocation-dashboard"
import GeneralDataDashboard from "@/components/general-data-dashboard"
import QearnDashboard from "@/components/qearn-dashboard"
import { Button } from "@/components/ui/button"
import { FileText, Wallet } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-primary font-bold text-2xl glow-text">QCAP</div>
            <div className="text-xl font-bold">Analytics Dashboard</div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2 border-primary/50 hover:border-primary">
              <FileText className="h-4 w-4" />
              <span>Whitepaper</span>
            </Button>
            <Button className="gap-2 glow-effect">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
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
          <TabsContent value="voting" className="space-y-4">
            <VotingDashboard />
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
      <footer className="border-t border-border/40 py-4">
        <div className="container flex justify-between items-center">
          <div className="text-sm text-muted-foreground">© 2024 QCAP Analytics. All rights reserved.</div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Twitter
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Discord
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Telegram
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
