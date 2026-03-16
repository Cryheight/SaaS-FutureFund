import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export function Card({ children, className = '', highlight = false }: CardProps) {
  return (
    <div className={`rounded-xl shadow-sm border ${highlight ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200'} ${className}`}>
      {children}
    </div>
  );
}
