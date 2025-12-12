import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ status: "success", message: "MongoDB Connected" });
    } catch (error) {
        return NextResponse.json({ status: "error", message: "Failed to connect to MongoDB", error: String(error) }, { status: 500 });
    }
}
