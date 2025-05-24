import ChatMessage from "@/models/chatMessage";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	// const user = req.headers.get("user");
	// if(!user){
	//     return NextResponse.json({message: "User not found",code : 2626 , description : "Your login session expired or you have been trying to use forged login token."}, {status: 404});
	// }
	// const userObj = JSON.parse(user);

	// //check if the user is a doctor
	// if(userObj.type !== "doctor"){
	//     return NextResponse.json({message: "You are not authorized to access this route",code : 2626 , description : "Your login session expired or you have been trying to use forged login token."}, {status: 404});
	// }

	console.log(process.env.BACKEND_URL);

	const userEmail = req.nextUrl.searchParams.get("email");
	if (!userEmail) {
		return NextResponse.json(
			{
				message: "Email not found",
				code: 2626,
				description:
					"Your login session expired or you have been trying to use forged login token.",
			},
			{ status: 404 }
		);
	}

	const chats = await ChatMessage.find({
		email: userEmail,
	});
	if (!chats) {
		return NextResponse.json(
			{
				message: "No chats found",
				code: 2626,
				description:
					"Your login session expired or you have been trying to use forged login token.",
			},
			{ status: 404 }
		);
	}

	const chatMessages = [];
	for (let i = 0; i < chats.length; i++) {
		const message: any = {
			email: chats[i].email,
			message: chats[i].message,
			role: chats[i].role,
			img: chats[i].img,
		};
		if (message.role == "user") {
			try {
				const res = await axios.post(
					process.env.BACKEND_URL + "/depression/predict-emotion",
					{
						img_url: message.img,
					}
				);
				const emotionData: any = {};
				//get the max emotion
				const maxEmotion = Object.keys(res.data.emotions).reduce((a, b) =>
					res.data.emotions[a] > res.data.emotions[b] ? a : b
				);
				emotionData.maxEmotion = maxEmotion;
				emotionData.summary = res.data.emotions;
				message.emotion = emotionData;

				const messageData: any = {};
				const messageRes = await axios.post(
					process.env.BACKEND_URL + "/depression/predict-text",
					{
						message: message.message,
					}
				);
				message.probability = messageRes.data.depression_probability;
			} catch (e) {
				console.log(e);
			}
		}

		chatMessages.push(message);
	}
	return NextResponse.json(chatMessages, { status: 200 });
}
