import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import ClientPortfolioHeader from "@/components/portfolio/ClientPortfolioHeader";
import PositionsTable from "@/components/portfolio/portfolioPositions/PositionsTable"; // Import the new table component
import PortfolioTransactions from "@/components/portfolio/PortfolioTransactions";
import PortfolioChart from "@/components/portfolio/PortfolioChart";
import { authOptions } from "@/lib/auth/options";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/login");
  }

  // Basic user check only - actual data will be loaded client-side
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ClientPortfolioHeader />

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <PositionsTable />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>
                Your portfolio&apos;s performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioChart userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="hidden">
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent trading history</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <PortfolioTransactions userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analytics</CardTitle>
              <CardDescription>
                Advanced metrics and insights about your investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
