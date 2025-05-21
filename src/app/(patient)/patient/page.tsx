"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientPage() {
	const [user, setUser] = useState<{ diseases: string[] }>({ diseases: [] });
	const router = useRouter();
	const [userValidationStatus, setUserValidationStatus] = useState("loading"); //loading, authorized, unauthorized

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (userValidationStatus == "loading") {
			axios
				.get(`/api/users/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setUser(res.data.user);
					if (res.data.user.type != "patient") {
						setUserValidationStatus("unauthorized");
						router.push("/login");
					} else setUserValidationStatus("authorized");
				})
				.catch((err) => {
					console.log(err);
					router.push("/login");
				});
		}
	}, [userValidationStatus]);

	return (
		<div className="w-full h-full flex justify-center items-center">
			{userValidationStatus === "authorized" ? (
				<div className="w-full max-w-full overflow-x-hidden max-h-full flex-wrap flex flex-row justify-center items-center ">
					{/* {user.diseases.map((disease) => (
						<div key={disease} className="bg-blue-200 p-2 m-1 rounded-md">
							{disease}
						</div>
					))} */}
					{user.diseases.includes("Depression") ? (
						<>
							<Link href="/patient/chat">
							
								<div className="bg-blue-200 p-2 m-1 rounded-md w-[400px] h-[400px] flex justify-center items-center flex-col">
									<Image
										src="/chat-logo.png"
										alt="Happy Buddy"
										width={200}
										height={200}
										className="w-1/2 h-1/2"
									/>
									<span
										className="text-center text-2xl font-bold text-blue-900"
									>Happy Buddy</span>
								</div>
							</Link>
						</>
					) : null}
					{user.diseases.includes("Parkinson") ? (
						<>
							<Link href="/patient/handwritting">
							
								<div className="bg-blue-200 p-2 m-1 rounded-md w-[400px] h-[400px] flex justify-center items-center flex-col">
									<Image
										src="/handwritting.png"
										alt="Happy Buddy"
										width={200}
										height={200}
										className="w-1/2 h-1/2"
									/>
									<span
										className="text-center text-2xl font-bold text-blue-900"
									>Write it down</span>
								</div>
							</Link>
						</>
					) : null}
					{user.diseases.includes("Parkinson") ? (
						<>
							<Link href="/patient/audio-test">
							
								<div className="bg-blue-200 p-2 m-1 rounded-md w-[400px] h-[400px] flex justify-center items-center flex-col">
									<Image
										src="/audio.png"
										alt="Happy Buddy"
										width={200}
										height={200}
										className="w-1/2 h-1/2"
									/>
									<span
										className="text-center text-2xl font-bold text-blue-900"
									>Let's Make a Noise! </span>
								</div>
							</Link>
						</>
					) : null}
					{user.diseases.includes("Parkinson") ? (
						<>
							<Link href="/patient/autism">
							
								<div className="bg-blue-200 p-2 m-1 rounded-md w-[400px] h-[400px] flex justify-center items-center flex-col">
									<Image
										src="/autism.png"
										alt="Happy Buddy"
										width={200}
										height={200}
										className="w-1/2 h-1/2"
									/>
									<span
										className="text-center text-2xl font-bold text-blue-900"
									>Fill with Baby</span>
								</div>
							</Link>
						</>
					) : null}
					
				</div>
			) : null}
		</div>
	);
}
