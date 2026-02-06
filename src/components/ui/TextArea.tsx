'use client';

import { type TextareaHTMLAttributes, useRef, useEffect } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoGrow?: boolean;
}

export function TextArea({
  autoGrow = true,
  className = '',
  ...props
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoGrow || !ref.current) return;
    const el = ref.current;
    const resize = () => {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    };
    el.addEventListener('input', resize);
    resize();
    return () => el.removeEventListener('input', resize);
  }, [autoGrow]);

  return (
    <textarea
      ref={ref}
      className={`w-full bg-thera-dark-900 border border-thera-dark-600 rounded-lg px-4 py-3 font-mono text-sm text-thera-gray-100 placeholder:text-thera-gray-400 focus:outline-none focus:border-thera-gray-400 transition-colors duration-300 resize-none min-h-[100px] ${className}`}
      {...props}
    />
  );
}
