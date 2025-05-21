import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import connectMongo from "@/lib/connectDB";
import * as jose from "jose";

export async function POST(req: NextRequest) {
	//check if a user available in the header
	await connectMongo();
	const { email, password } = await req.json();
	const user = await User.findOne({ email });
	if (!user) {
		return NextResponse.json(
			{
				message: "User not found",
				code: 2626,
				description:
					"Your login session expired or you have been trying to use forged login token.",
			},
			{ status: 404 }
		);
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return NextResponse.json(
			{
				message: "Invalid credentials",
				code: 2626,
				description:
					"Your login session expired or you have been trying to use forged login token.",
			},
			{ status: 404 }
		);
	}

	const secret = new TextEncoder().encode(process.env.JOSE_SECRET);
	const token = await new jose.SignJWT({
		email: user.email,
		type: user.type,
		firstName: user.firstName,
		lastName: user.lastName,
		phone: user.phone,
		image: user.image,
		diseases: Array.isArray(user.diseases)
			? user.diseases.map((d: any) => d.toString?.() || d)
			: [],
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("48h")
		.sign(secret);

	return NextResponse.json(
		{
			token,
			user,
			message: "Login successful",
			description: "Login successful.",
		},
		{ status: 200 }
	);
}
