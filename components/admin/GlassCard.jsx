export const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white border border-black/[0.06] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${className}`}>
    {children}
  </div>
);