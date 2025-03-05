import React from "react";

type AdminActionsProps = {
  onAddStock: () => void;
};

export const AdminActions: React.FC<AdminActionsProps> = ({ onAddStock }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onAddStock}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Stock
      </button>
    </div>
  );
};
