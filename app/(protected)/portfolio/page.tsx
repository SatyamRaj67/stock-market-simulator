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

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioPositions from "@/components/portfolio/PortfolioPositions";
import PortfolioTransactions from "@/components/portfolio/PortfolioTransactions";
import PortfolioChart from "@/components/portfolio/PortfolioChart";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      portfolio: {
        include: {
          positions: {
            include: {
              stock: true,
            },
          },
        },
      },
      transactions: {
        include: {
          stock: true,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PortfolioHeader
        balance={user.balance}
        portfolioValue={user.portfolioValue}
        totalProfit={user.totalProfit}
      />

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <PortfolioPositions positions={user.portfolio?.positions || []} />
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
          <PortfolioTransactions transactions={user.transactions} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analytics</CardTitle>
              <CardDescription>
                Insights and analysis of your investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sector Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Sector chart will be displayed here
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Risk metrics will be displayed here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
