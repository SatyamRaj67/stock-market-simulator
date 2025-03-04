"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WelcomeSection from "@/components/home/WelcomeSection";
import FeatureHighlight from "@/components/home/FeatureHighlight";
import Footer from "@/components/layout/footer";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <WelcomeSection />

        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/login")}
          >
            Start Trading Now
          </Button>
        </div>

        <div className="mt-16 w-full max-w-5xl">
          <FeatureHighlight />
        </div>
      </main>

      <Footer />
    </div>
  );
}
