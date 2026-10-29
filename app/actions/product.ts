"use server"

import Product from "@/models/Product"

export default async function updateProductAction(id: string, data: any) {
    await Product.findByIdAndUpdate(id, data, { new: true });
}