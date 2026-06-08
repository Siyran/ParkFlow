import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div className={["bg-white rounded-2xl p-4 shadow-park-lg border border-transparent", className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
