import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(request: NextRequest) {
    const user = request.headers.get("user");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userObject = JSON.parse(user);
    const disease = request.nextUrl.searchParams.get("disease");
    if (!disease) {
        return NextResponse.json({ message: "Disease not found" }, { status: 404 });
    }
    //only doctors and admins can access this route
    if (userObject.type != "admin" && userObject.type != "doctor") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const users = await User.find({ diseases: { $in: [disease] } });
        return NextResponse.json(users, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
