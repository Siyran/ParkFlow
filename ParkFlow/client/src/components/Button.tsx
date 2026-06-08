import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
};

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold';
  const primary = 'bg-gradient-to-r from-parkflow-primary to-parkflow-accent text-white shadow-md hover:scale-[1.01]';
  const ghost = 'bg-white text-parkflow-primary border border-gray-200 shadow-none';

  const cls = [base, variant === 'ghost' ? ghost : primary, className].filter(Boolean).join(' ');

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
