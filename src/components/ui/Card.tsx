interface CardProps {
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({ glow = false, className = '', children }: CardProps) {
  return (
    <div
      className={`bg-thera-dark-800 border border-thera-dark-600 rounded-xl p-5 transition-shadow duration-500 ${
        glow ? 'shadow-[0_0_30px_rgba(255,255,255,0.08)]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
