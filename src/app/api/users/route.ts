import { NextRequest , NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import connectMongo from "@/lib/connectDB";

export async function GET(request: NextRequest) {
    const user = request.headers.get("user");
    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }
    const userData = JSON.parse(user);
    if (!userData) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { message: "User found", user: userData },
        { status: 200 }
    );
}