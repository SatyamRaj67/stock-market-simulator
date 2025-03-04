'use client';

import React, { useState, useEffect } from 'react';
import StockTable from '@/components/stock/StockTable';
import StockForm from '@/components/stock/StockForm';
import { Stock, StockFormData } from '@/types';

const AdminPage = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch all stocks
  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error('Failed to fetch stocks');
      const data = await response.json();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleAddStock = () => {
    setEditingStock(null);
    setIsFormVisible(true);
  };

  const handleEditStock = (stock: Stock) => {
    setEditingStock(stock);
    setIsFormVisible(true);
  };

  const handleDeleteStock = async (stockId) => {
    if (confirm('Are you sure you want to delete this stock?')) {
      try {
        const response = await fetch(`/api/stocks/${stockId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete stock');
        
        fetchStocks();
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }
  };

  const handleFormSubmit = async (stockData: StockFormData) => {
    try {
      if (editingStock) {
        // Update existing stock
        const response = await fetch(`/api/stocks/${editingStock.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockData),
        });
        
        if (!response.ok) throw new Error('Failed to update stock');
      } else {
        // Create new stock
        const response = await fetch('/api/stocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockData),
        });
        
        if (!response.ok) throw new Error('Failed to create stock');
      }
      
      setIsFormVisible(false);
      fetchStocks(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Stock Management Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <div className="mb-4">
        <button 
          onClick={handleAddStock} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Stock
        </button>
      </div>

      {isFormVisible && (
        <StockForm 
          initialData={editingStock} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setIsFormVisible(false)}
        />
      )}

      {isLoading ? (
        <p>Loading stocks...</p>
      ) : (
        <StockTable 
          stocks={stocks} 
          onEdit={handleEditStock} 
          onDelete={handleDeleteStock} 
        />
      )}
    </div>
  );
};

export default AdminPage;