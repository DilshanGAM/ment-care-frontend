import { NextRequest , NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import AudioData from "@/models/audioDataModel";

export async function POST(req: NextRequest) {
    const user = req.headers.get("user");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const userObject = JSON.parse(user);

    const {audio} = await req.json();

    await AudioData.create({
        email: userObject.email,
        audio: audio,
    });
    return NextResponse.json({ message: "Audio data saved" }, { status: 200 });
}