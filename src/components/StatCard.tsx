import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}

export function StatCard({ title, value, subtitle, highlight = false }: StatCardProps) {
  return (
    <Card highlight={highlight} className="p-4 flex-1">
      <p className={`text-xs font-medium uppercase tracking-wide ${highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{title}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      {subtitle && <p className={`text-xs mt-1 ${highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{subtitle}</p>}
    </Card>
  );
}
