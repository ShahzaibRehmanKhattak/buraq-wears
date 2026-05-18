import { Eye, Share2, ShoppingCart, Receipt } from 'lucide-react';
import { MetricCard } from '@/components/admin/MetricCards';
export const StatsGrid = () => (
  <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
    <MetricCard title="Views" value="411.9K" trend="2.9%" trendUp={true} icon={Eye} isPrimary={true} />
    <MetricCard title="Shares" value="230.4K" trend="13.3%" trendUp={true} icon={Share2} />
    <MetricCard title="Added" value="20.9K" trend="4.3%" trendUp={false} icon={ShoppingCart} />
    <MetricCard title="Orders" value="410.5K" trend="30.2%" trendUp={true} icon={Receipt} />
  </section>
);