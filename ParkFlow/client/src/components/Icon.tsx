import React from 'react';
import * as Outline from '@heroicons/react/24/outline';
import * as Solid from '@heroicons/react/24/solid';
import { FaWallet, FaClock } from 'react-icons/fa';

type Variant = 'outline' | 'solid';

export function IconWallet({ size = 18, variant = 'outline' }: { size?: number; variant?: Variant }) {
  if (variant === 'solid') return <FaWallet size={size} />;
  const Icon = Outline.BanknotesIcon;
  return <Icon style={{ width: size, height: size }} aria-hidden />;
}

export function IconMap({ size = 18, variant = 'outline' }: { size?: number; variant?: Variant }) {
  const Icon = variant === 'solid' ? Solid.MapPinIcon : Outline.MapPinIcon;
  return <Icon style={{ width: size, height: size }} aria-hidden />;
}

export function IconClock({ size = 18, variant = 'outline' }: { size?: number; variant?: Variant }) {
  if (variant === 'solid') return <FaClock size={size} />;
  const Icon = Outline.ClockIcon;
  return <Icon style={{ width: size, height: size }} aria-hidden />;
}

