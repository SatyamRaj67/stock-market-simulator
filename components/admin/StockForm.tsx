"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose?: number;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  volume?: number;
  marketCap?: number;
  description?: string;
  sector: string;
}

interface StockFormProps {
  initialData?: StockData;
  onSubmit: (data: StockData & { createdBy: string }) => void;
  onCancel: () => void;
}

// Define the form schema with Zod
const stockFormSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Name is required"),
  currentPrice: z.coerce.number().positive("Price must be positive"),
  previousClose: z.coerce.number().positive().optional(),
  openPrice: z.coerce.number().positive().optional(),
  highPrice: z.coerce.number().positive().optional(),
  lowPrice: z.coerce.number().positive().optional(),
  volume: z.coerce.number().nonnegative().optional(),
  marketCap: z.coerce.number().nonnegative().optional(),
  description: z.string().optional(),
  sector: z.string().default("Uncategorized"),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

const sectors = [
  "Uncategorized",
  "Technology",
  "Financial",
  "Healthcare",
  "Consumer",
  "Energy",
  "Utilities",
  "Industrial",
  "Materials",
  "Real Estate",
];

const StockForm = ({ initialData, onSubmit, onCancel }: StockFormProps) => {
  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
        symbol: "",
        name: "",
        currentPrice: 0,  
        previousClose: undefined, 
        openPrice: undefined, 
        highPrice: undefined, 
        lowPrice: undefined, 
        volume: undefined, 
        marketCap: undefined, 
        description: "",
        sector: "Uncategorized",
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        symbol: initialData.symbol,
        name: initialData.name,
        currentPrice: initialData.currentPrice,
        previousClose: initialData.previousClose,
        openPrice: initialData.openPrice,
        highPrice: initialData.highPrice,
        lowPrice: initialData.lowPrice,
        volume: initialData.volume,
        marketCap: initialData.marketCap,
        description: initialData.description || "",
        sector: initialData.sector,
      });
    }
  }, [initialData, form]);

  // Form submission handler
  function handleFormSubmit(values: StockFormValues) {
    onSubmit({
      ...values,
      createdBy: "admin", // Hardcoded for now, replace with actual user ID-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    });
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Stock" : "Add New Stock"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symbol Field */}
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol *</FormLabel>
                    <FormControl>
                      <Input placeholder="AAPL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Apple Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Price Field */}
              <FormField
                control={form.control}
                name="currentPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="150.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Previous Close Field */}
              <FormField
                control={form.control}
                name="previousClose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Close</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="149.50"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Open Price Field */}
              <FormField
                control={form.control}
                name="openPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="149.00"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* High Price Field */}
              <FormField
                control={form.control}
                name="highPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>High Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="152.00"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Low Price Field */}
              <FormField
                control={form.control}
                name="lowPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="148.00"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Volume Field */}
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="1000000"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Market Cap Field */}
              <FormField
                control={form.control}
                name="marketCap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Cap</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="2000000000"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sector Field */}
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a description about the company"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Stock" : "Create Stock"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StockForm;
