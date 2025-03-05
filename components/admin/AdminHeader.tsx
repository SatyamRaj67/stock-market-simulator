import React from 'react';

type AdminHeaderProps = {
  title: string;
  error: string | null;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, error }) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
    </>
  );
};