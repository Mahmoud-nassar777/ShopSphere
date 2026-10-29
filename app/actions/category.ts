// "use server"

// import axios from "axios"
// import { revalidatePath } from "next/cache"

// export async function addMainCategory(formData: FormData) {
//     const main = formData.get("main") as string;
//     if(!main) return;

//     await axios.post(`
//         ${process.env.NEXT_PUBLIC_BASE_URL}/api/product/categories`,
//         { main },
//         { validateStatus: () => true },

//     );
//     revalidatePath("/seller/dashboard/categories");
// }


// export async function handleAddSub(main:string, sub: string) {
//     await axios.post(`
//         ${process.env.NEXT_PUBLIC_BASE_URL}/api/product/categories`,
//         { main, sub },
//         { validateStatus: () => true },

//     );
//     revalidatePath("/seller/dashboard/categories");
// }




"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

export async function addMainCategory(formData: FormData) {
    const main = String(formData.get("main") ?? "").trim();

    if (!main) {
        throw new Error("Main category is required");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_BASE_URL is missing");
    }

    const url = `${baseUrl.replace(/\/+$/, "")}/api/products/categories`;

    try {
        const res = await axios.post(url, { main });

        revalidatePath("/seller/dashboard/categories");
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Category API URL:", url);
            console.error("Category API status:", error.response?.status);
            console.error("Category API response:", error.response?.data);
        }

        throw error;
    }
}

export async function deleteMainCategory(formData:FormData) {
    const main = formData.get("main") as string;
    if (!main) return;
    await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
        { data: { main } },
    );
    revalidatePath("/seller/dashboard/categories");
}

export async function handleAddSub(main: string, sub: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_BASE_URL is missing");
    }

    const url = `${baseUrl.replace(/\/+$/, "")}/api/products/categories`;

    const res = await axios.post(url, {
        main: main.trim(),
        sub: sub.trim(),
    });

    revalidatePath("/seller/dashboard/categories");
    return res.data;
}


export async function handleDeleteSub(main: string, sub: string) {
    await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/categories`,
        {data: { main, sub }},
    );
    revalidatePath("/seller/dashboard/categories");
}