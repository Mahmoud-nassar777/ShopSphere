import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }
        await connectToDatabase();
        let body;
        body = await req.json();

        const saved = await Product.create({
            sellerId: session.user.id,
            name: body.name,
            description: body.description,
            deliveryInDays: body.deliveryInDays,
            category: body.category,
            options: body.options,
            variants: body.variants,
            allImages: body.allImages,
        });
        return NextResponse.json(
            { product: saved },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Product create error:" ,error);
        return NextResponse.json(
            {error: error.message || "Product creation failed " },
            {status: 500}
        )
    }
}

