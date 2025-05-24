import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import HandWrittingData from "@/models/handwrittingDataModel";

export async function POST(req: NextRequest) {
    const user = req.headers.get("user");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const userObject = JSON.parse(user);

    const {img} = await req.json();

    await HandWrittingData.create({
        email: userObject.email,
        img: img,
    });
    return NextResponse.json({ message: "Handwritting data saved" }, { status: 200 });
}
