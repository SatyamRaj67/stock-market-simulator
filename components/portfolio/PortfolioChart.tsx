"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "../ui/badge"
const chartData = [
  { date: "2024-04-01", price: 222, stock: 150 },
  { date: "2024-04-02", price: 97, stock: 180 },
  { date: "2024-04-03", price: 167, stock: 120 },
  { date: "2024-04-04", price: 242, stock: 260 },
  { date: "2024-04-05", price: 373, stock: 290 },
  { date: "2024-04-06", price: 301, stock: 340 },
  { date: "2024-04-07", price: 245, stock: 180 },
  { date: "2024-04-08", price: 409, stock: 320 },
  { date: "2024-04-09", price: 59, stock: 110 },
  { date: "2024-04-10", price: 261, stock: 190 },
  { date: "2024-04-11", price: 327, stock: 350 },
  { date: "2024-04-12", price: 292, stock: 210 },
  { date: "2024-04-13", price: 342, stock: 380 },
  { date: "2024-04-14", price: 137, stock: 220 },
  { date: "2024-04-15", price: 120, stock: 170 },
  { date: "2024-04-16", price: 138, stock: 190 },
  { date: "2024-04-17", price: 446, stock: 360 },
  { date: "2024-04-18", price: 364, stock: 410 },
  { date: "2024-04-19", price: 243, stock: 180 },
  { date: "2024-04-20", price: 89, stock: 150 },
  { date: "2024-04-21", price: 137, stock: 200 },
  { date: "2024-04-22", price: 224, stock: 170 },
  { date: "2024-04-23", price: 138, stock: 230 },
  { date: "2024-04-24", price: 387, stock: 290 },
  { date: "2024-04-25", price: 215, stock: 250 },
  { date: "2024-04-26", price: 75, stock: 130 },
  { date: "2024-04-27", price: 383, stock: 420 },
  { date: "2024-04-28", price: 122, stock: 180 },
  { date: "2024-04-29", price: 315, stock: 240 },
  { date: "2024-04-30", price: 454, stock: 380 },
  { date: "2024-05-01", price: 165, stock: 220 },
  { date: "2024-05-02", price: 293, stock: 310 },
  { date: "2024-05-03", price: 247, stock: 190 },
  { date: "2024-05-04", price: 385, stock: 420 },
  { date: "2024-05-05", price: 481, stock: 390 },
  { date: "2024-05-06", price: 498, stock: 520 },
  { date: "2024-05-07", price: 388, stock: 300 },
  { date: "2024-05-08", price: 149, stock: 210 },
  { date: "2024-05-09", price: 227, stock: 180 },
  { date: "2024-05-10", price: 293, stock: 330 },
  { date: "2024-05-11", price: 335, stock: 270 },
  { date: "2024-05-12", price: 197, stock: 240 },
  { date: "2024-05-13", price: 197, stock: 160 },
  { date: "2024-05-14", price: 448, stock: 490 },
  { date: "2024-05-15", price: 473, stock: 380 },
  { date: "2024-05-16", price: 338, stock: 400 },
  { date: "2024-05-17", price: 499, stock: 420 },
  { date: "2024-05-18", price: 315, stock: 350 },
  { date: "2024-05-19", price: 235, stock: 180 },
  { date: "2024-05-20", price: 177, stock: 230 },
  { date: "2024-05-21", price: 82, stock: 140 },
  { date: "2024-05-22", price: 81, stock: 120 },
  { date: "2024-05-23", price: 252, stock: 290 },
  { date: "2024-05-24", price: 294, stock: 220 },
  { date: "2024-05-25", price: 201, stock: 250 },
  { date: "2024-05-26", price: 213, stock: 170 },
  { date: "2024-05-27", price: 420, stock: 460 },
  { date: "2024-05-28", price: 233, stock: 190 },
  { date: "2024-05-29", price: 78, stock: 130 },
  { date: "2024-05-30", price: 340, stock: 280 },
  { date: "2024-05-31", price: 178, stock: 230 },
  { date: "2024-06-01", price: 178, stock: 200 },
  { date: "2024-06-02", price: 470, stock: 410 },
  { date: "2024-06-03", price: 103, stock: 160 },
  { date: "2024-06-04", price: 439, stock: 380 },
  { date: "2024-06-05", price: 88, stock: 140 },
  { date: "2024-06-06", price: 294, stock: 250 },
  { date: "2024-06-07", price: 323, stock: 370 },
  { date: "2024-06-08", price: 385, stock: 320 },
  { date: "2024-06-09", price: 438, stock: 480 },
  { date: "2024-06-10", price: 155, stock: 200 },
  { date: "2024-06-11", price: 92, stock: 150 },
  { date: "2024-06-12", price: 492, stock: 420 },
  { date: "2024-06-13", price: 81, stock: 130 },
  { date: "2024-06-14", price: 426, stock: 380 },
  { date: "2024-06-15", price: 307, stock: 350 },
  { date: "2024-06-16", price: 371, stock: 310 },
  { date: "2024-06-17", price: 475, stock: 520 },
  { date: "2024-06-18", price: 107, stock: 170 },
  { date: "2024-06-19", price: 341, stock: 290 },
  { date: "2024-06-20", price: 408, stock: 450 },
  { date: "2024-06-21", price: 169, stock: 210 },
  { date: "2024-06-22", price: 317, stock: 270 },
  { date: "2024-06-23", price: 480, stock: 530 },
  { date: "2024-06-24", price: 132, stock: 180 },
  { date: "2024-06-25", price: 141, stock: 190 },
  { date: "2024-06-26", price: 434, stock: 380 },
  { date: "2024-06-27", price: 448, stock: 490 },
  { date: "2024-06-28", price: 149, stock: 200 },
  { date: "2024-06-29", price: 103, stock: 160 },
  { date: "2024-06-30", price: 446, stock: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  price: {
    label: "price",
    color: "#ffb703",
  },
  stock: {
    label: "stock",
    color: "#219ebc",
  },
} satisfies ChartConfig

export default function PortfolioChart({userId}: {userId: string}) {
    console.log(userId) //REMOVE THIS PLEASE.. AHHHH

  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  interface ChartDataPoint {
    date: string;
    price: number;
    stock: number;
  }

  const calculatePercentageChange = (data: ChartDataPoint[]) => {
    if (!data || data.length < 2) return 0;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
  };

  const percentChange = calculatePercentageChange(filteredData);
  const isPositiveChange = Number(percentChange) >= 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2">
            <CardTitle>Growth</CardTitle>
            <Badge variant={isPositiveChange ? "default" : "destructive"}>
              {isPositiveChange ? "+" : ""}{percentChange}%
            </Badge>
          </div>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillprice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillstock" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-stock)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-stock)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="stock"
              type="natural"
              fill="url(#fillstock)"
              stroke="var(--color-stock)"
              stackId="a"
            />
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillprice)"
              stroke="var(--color-price)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
