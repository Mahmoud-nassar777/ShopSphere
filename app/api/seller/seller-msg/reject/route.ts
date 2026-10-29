import { connectToDatabase } from "@/lib/db";
import SellerMsg from "@/models/SellerMsg";
import User from "@/models/User";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"

export async function POST(req: Request){
    try {
        await connectToDatabase();
        const { id, reason } = await req.json();
        if(!id || !reason) {
            return Response.json(
                {
                    error: "Missing id or reason",
                },
                { status: 400 },
            );
        }
        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" } , { status: 400 });
        }
        const message = await SellerMsg.findById(id);
        if (!message) {
            return NextResponse.json({ error: "Message not found" } , { status: 404 });
        }
        const sellerEmail = message.email.toLowerCase();
        const sellerName = message.sellerName;
        if (!sellerEmail) {
            return NextResponse.json(
                { error: "No email field in message" },
                {
                    status: 400,
                },
            );
        }
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: sellerEmail,
            subject:"Your Seller Request Been Rejected",
            html: `
                <p>Hello, ${sellerName} </p>
                <p>We reget to inform you that your seller account request has been rejected for the following reason: </p>
                <blockquote style="color:#555; border-left:4px solid #f00; padding-left: 10px;">${reason}</blockquote>
                <p>If you believe this is a mistake or want to reapply, please contact our support team.</p>
                <p>Thank you, <br/> Shoply Support Team</p>,
            `
        })

        return NextResponse.json(
            { message: "Rejection email sent successfully." },
            { status: 201 },
        )
    } catch (error) {
        console.error( "Reject Seller Error",error);
        return NextResponse.json(
            { error: "Something went wrong sending rejection email.", },
            { status: 500 },
        );
    }
}


