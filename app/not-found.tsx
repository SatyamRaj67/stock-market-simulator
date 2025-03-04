"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle 
              className="w-16 h-16 text-red-500" 
              strokeWidth={1.5} 
            />
          </div>
          <CardTitle className="text-4xl">404</CardTitle>
          <CardDescription className="text-lg mt-2">
            Oops! Page Not Found
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            The page you&apos;re looking for seems to have gone on an unexpected adventure.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link href="/" passHref>
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;