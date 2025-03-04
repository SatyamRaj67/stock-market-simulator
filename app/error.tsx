"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Home, TrendingDown } from "lucide-react";

const ErrorPage = () => {
  const getStockPun = () => {
    const puns = [
      "Looks like our page just experienced a market crash!",
      "Oops! Seems like we hit a bear market in navigation.",
      "This page's portfolio just went into the red zone.",
      "Looks like we've been stopped out of this route!",
      "Our navigation just took a nosedive worse than a meme stock.",
      "Seems like this page's trading algorithm has a bug.",
      "Unexpected error: Portfolio of pages not found!",
      "Volatility is high, and this page is not performing!",
    ];
    return puns[Math.floor(Math.random() * puns.length)];
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
        <CardHeader className="text-center bg-blue-500 text-white py-6">
          <TrendingDown className="mx-auto mb-4 text-white w-16 h-16 animate-bounce" />
          <CardTitle className="text-3xl font-bold">Oops! Market Volatility Detected</CardTitle>
          <CardDescription className="text-white/80">
            Error 404: Page Not Found
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              {getStockPun()}
            </p>
            <p className="text-gray-600 mb-6">
              The page you&apos;re looking for seems to have been delisted from our site&apos;s index.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline" 
              className="hover:bg-blue-50 transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Trade Route
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'} 
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <Home className="mr-2 h-4 w-4" /> Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;