"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminActions } from "@/components/admin/AdminActions";
import { AdminFormWrapper } from "@/components/admin/AdminFormWrapper";
import { AdminListSection } from "@/components/admin/AdminListSection";
import { useStockManagement } from "@/lib/hooks/useStockManagement";

const AdminPage = () => {
  const {
    stocks,
    isLoading,
    error,
    editingStock,
    isFormVisible,
    // fetchStocks,
    handleAddStock,
    handleEditStock,
    handleDeleteStock,
    handleFormSubmit,
    setIsFormVisible
  } = useStockManagement();

  return (
    <div className="container mx-auto p-4">
      <AdminHeader title="Stock Management Dashboard" error={error} />
      <AdminActions onAddStock={handleAddStock} />
      <AdminFormWrapper 
        isVisible={isFormVisible}
        editingStock={editingStock}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormVisible(false)}
      />
      <AdminListSection 
        isLoading={isLoading}
        stocks={stocks}
        onEdit={handleEditStock}
        onDelete={handleDeleteStock}
      />
    </div>
  );
};

export default AdminPage;