import React from "react";
import {getTheme} from "@/components/themes";
const Theme = getTheme("premium");
export default function ShopPage() {

    return (
        <div className="w-full h-full">
            <Theme.Breadcrumb title="YOUR SHOP" pages={["Shop"]} />
            <Theme.ProductSection
                title=" FOR THE LOVE OF LUXURY"
                subtitle="Just landed in the studio"    
            />
            <Theme.TrustSignals />
            <Theme.PromoBanner />
            <Theme.NewsLetter/>
    
    </div>
    )
}