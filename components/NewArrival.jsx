import { supabase } from '@/lib/supabase/client'; // Directly pulling your Supabase instance
import { ProductCard } from './ProductCard';

// Clean, direct server-side data fetch without HTTP domain overhead
async function getNewArrivals() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }) // Sorts by newest additions
      .limit(4); // Only grab the top 4 nodes directly from the database

    if (error) throw error;
    return products || [];
  } catch (error) {
    console.error("Server component database query failure:", error);
    return []; // Safe fallback array to keep layout stable
  }
}

export const NewArrivals = async () => {
  const modernArrivalsList = await getNewArrivals();

  return (
    <section className="py-32 px-6 md:px-20 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-baseline mb-16">
        <h2 className="text-[32px] md:text-[40px] font-bold uppercase tracking-tighter">New Arrivals</h2>
        <a href="/products" className="text-[11px] font-bold uppercase tracking-widest border-b border-black/20 pb-1 hover:border-black transition-all">
          View Collection
        </a>
      </div>

      {modernArrivalsList.length === 0 ? (
        <div className="text-center py-12 text-sm italic text-gray-400 font-medium">
          No live inventory assets found in the storefront configuration.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modernArrivalsList.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id} // Passed down to handle "Add to Cart" contexts seamlessly
              title={product.title || product.name} 
              // Handles numbers or strings and outputs standard clean formatting
              price={`$${Number(product.price || 0).toFixed(2)}`} 
              // Pulls the initial index from the array or loads placeholder string
              image={product.images && product.images[0] ? product.images[0] : "/placeholder.png"} 
              stock={product.stock_qty ?? product.stock}
            />
          ))}
        </div>
      )}
    </section>
  );
};