
export const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl ${className}`}>
    {children}
  </div>
);