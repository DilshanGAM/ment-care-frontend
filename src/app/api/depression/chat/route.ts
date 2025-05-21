import ChatMessage from "@/models/chatMessage";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
const geminiAPIKey = "AIzaSyCz_tHvBZGPu_f2rruj3shdqxBGnAsBaBQ";
const ai = new GoogleGenAI({
	apiKey: geminiAPIKey,
});
export async function POST(request: NextRequest) {
	const user = request.headers.get("user");
	if (!user) {
		return NextResponse.json({ message: "User not found" }, { status: 404 });
	}

	const userObject = JSON.parse(user);
	const { message } = await request.json();

	const chatMessage = {
		email: userObject.email,
		message: message,
		role: "user",
		img: userObject.img,
	};
	try {
		//save the chat message to the database
		await ChatMessage.create(chatMessage);
		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents:
				"Assume you are depression patient helper and write a response for last message to continue this conversation. make the response very short and easy to read. Do not let the patient to feel that he or she is a patient. " +
				message,
		});
		const chatMessageResponse = {
			email: userObject.email,
			message: response.text,
			role: "helper",
			img: "/assistant.jpg",
		};

		//save the chat message to the database
		await ChatMessage.create(chatMessageResponse);
		//get all the chat messages from the database
		const chats = await ChatMessage.find({
			email: userObject.email,
		})
        return NextResponse.json(chats, { status: 200 });
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
export async function GET(request: NextRequest) {
    const user = request.headers.get("user");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userObject = JSON.parse(user);
    try {
        const chats = await ChatMessage.find({
            email: userObject.email,
        });
        return NextResponse.json(chats, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
