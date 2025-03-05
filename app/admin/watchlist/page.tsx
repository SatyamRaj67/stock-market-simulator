import { AdminWatchlistContent } from "@/components/admin/AdminWatchlistContent";
import { Suspense } from "react";

export default async function WatchlistPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User Watchlists</h1>
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <AdminWatchlistContent />
      </Suspense>
    </div>
  );
}
