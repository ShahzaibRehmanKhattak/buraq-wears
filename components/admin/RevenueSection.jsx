import { GlassCard } from './GlassCard';
import { Badge } from './Badges';
export const RevenueSection = () => (
  <GlassCard className="p-6 md:p-8 flex flex-col justify-between">
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold tracking-tight">Net Revenue</h3>
        <Badge variant="success">+12.5%</Badge>
      </div>
      <div className="text-4xl font-bold tracking-tighter tabular-nums">$991,761</div>
      <div className="h-24 w-full flex items-end gap-1.5 px-1">
        {[30, 45, 35, 60, 80, 95, 85, 75, 90, 65].map((h, i) => (
          <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-sm transition-all duration-700 ${i > 7 ? 'bg-black' : 'bg-gray-100'}`} />
        ))}
      </div>
    </div>
    <div className="pt-6 border-t border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-[10px] font-bold uppercase">Quarter Progress</span>
        <span className="font-bold text-sm">65%</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className="bg-black h-full w-[65%] rounded-full transition-all duration-1000"></div>
      </div>
    </div>
  </GlassCard>
);
