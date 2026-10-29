import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { Search } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectToDatabase();
        const {searchParams} = new URL(req.url);

        const query = searchParams.get("q")?.trim() || "";
        const category = searchParams.get("category") || "";
        const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
        const minPrice = parseInt(searchParams.get("minPrice") || "0");
        const maxPrice = parseInt(searchParams.get("maxPrice") || "") || Number.MAX_SAFE_INTEGER;

        const filter: any = {} ;

        // Multi-word Search

        if (query) {
            const words = query.split(/\s+/).filter(Boolean);
            filter.$and = words.map((words) => ({
                $or: [
                    {name: {$regex: words, $options: "i"}},
                    {description: {$regex: words, $options:"i"}},
                    {"category.main": {$regex: words, $options:"i"}},
                    {"category.sub": {$regex: words, $options:"i"}},
                ]
            }))
        }
        // Category Filter

        if(category && category !== "All"){
            filter["category.main"] = category;
        }

        // Fetch all matching products
        let allProducts = await Product.find(filter).lean();

        allProducts = allProducts.map((product: any) => {
            if (!product.variants || product.variants.length === 0) {
                return null;
            }
            const prices = product.variants.map((v: any) => {
                let priceString = ( 
                    v.price || 
                    v.combination?.price || 
                    v.price || 
                    "0" 
                ).toString();

                priceString = priceString.replace(/[^\d.]/g, "");

                const numericePrice = parseFloat(priceString);

                return !isNaN(numericePrice) ? numericePrice : 0;
            })
            .filter((p: number) => p > 0);
            if (prices.length === 0) return null;
            return {
                ...product,
                minPrice: Math.min(...prices),
                maxPrice: Math.max(...prices),
            };
        })
        .filter(Boolean);
        // available brands before brand filter

        const availableBrands = [
            ...new Set(allProducts.map((p: any) => p.category.sub))
        ].sort();

        const allPrices = allProducts.flatMap((p: any) => [
            p.minPrice, p.maxPrice
        ])

        let actualMinPrice = 0;
        let actualMaxPrice = 0;

        if(allPrices.length > 0) {
            allPrices.sort((a, b) => a -b);
            actualMinPrice = allPrices[0];

            const index = Math.floor(allPrices.length * 0.9);
            actualMaxPrice = allPrices[index] || allPrices[allPrices.length - 1];

        }
        // apply brand filter
        let products = allProducts;

        if(brands.length > 0){
            products = products.filter((p: any) => brands.includes(p.category.sub));
        }

        // apply price filter
        const filteredProducts = products.filter(
            (p: any) => p.maxPrice >= minPrice && p.minPrice <=maxPrice ,
        );

        return NextResponse.json({
            products: filteredProducts,
            brands: availableBrands,
            minPrice: actualMinPrice,
            maxPrice: actualMaxPrice,
            total: filteredProducts.length,
        });

    } catch (error) {
        console.log("Product Fetch error", error);
        return NextResponse.json(
            { error: "Internal Server Error", },
            { status: 500 }
        )
    }
}