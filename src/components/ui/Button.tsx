'use client';

import { motion } from 'framer-motion';
import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'cosmic';
}

const variants = {
  primary:
    'bg-thera-dark-700 text-white border border-thera-dark-500 hover:bg-thera-dark-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
  ghost:
    'bg-transparent text-thera-gray-200 border border-transparent hover:border-thera-dark-500 hover:text-white',
  cosmic:
    'bg-thera-dark-800 text-white border border-thera-dark-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-thera-gray-400',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`px-5 py-2.5 rounded-lg font-sans text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
