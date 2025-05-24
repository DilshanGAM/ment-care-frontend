"use client";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function DepressionSummaryContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");

	const [status, setStatus] = useState("loading");
	const [chats, setChats]: any[] = useState([]);

	useEffect(() => {
		if (status == "loading") {
			const token = localStorage.getItem("token");
			axios
				.get(`/api/depression/allTime?email=${email}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setChats(res.data);
					setStatus("loaded");
				})
				.catch((err) => {
					console.log(err);
					setStatus("error");
				});
		}
	}, [status]);
	type EmotionKey =
		| "happy"
		| "sad"
		| "angry"
		| "disgusted"
		| "surprised"
		| "neutral"
		| "fearful";
	const emotions: Record<EmotionKey, string> = {
		happy: "😁",
		sad: "😢",
		angry: "😡",
		disgusted: "🤢",
		surprised: "😲",
		neutral: "😐",
		fearful: "😨",
	};
	return (
		<div className="flex flex-col justify-cener items-center min-h-screen max-h-screen overflow-y-scroll">
			<h1 className="text-2xl font-bold mb-4 sticky">Depression Summary</h1>
			{email ? (
				<p className="text-lg">
					Showing summary for: <span className="font-medium">{email}</span>
				</p>
			) : (
				<p className="text-lg text-red-500">No email provided in the URL!</p>
			)}
			<div className="w-full flex flex-col mt-4 px-2">
				{status === "loading" ? (
					<div className="flex justify-center items-center h-screen">
						<p className="text-lg">Loading summary...</p>
					</div>
				) : status === "error" ? (
					<div className="flex justify-center items-center h-screen">
						<p className="text-lg text-red-500">Error loading summary!</p>
					</div>
				) : (
					chats.map((chat: any, index: any) => {
						if (chat.role == "helper") {
							return (
								<div
									key={index}
									className="w-full flex flex-row justify-end mb-4"
								>
									<div className="bg-blue-100 p-4 rounded-lg shadow-md max-w-xs">
										<p>{chat.message}</p>
									</div>
								</div>
							);
						}
						return (
							<div
								key={index}
								className="w-full flex flex-row justify-start mb-4"
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<div className="bg-blue-100 p-4 rounded-lg shadow-md max-w-xs relative">
												<p>{chat.message}</p>
												<p className="absolute text-xl right-2 bottom-[-15px]">
													{emotions[chat.emotion.maxEmotion as EmotionKey]}
												</p>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<div>
												{chat.probability > 0.01 ? (
													<p className="text-sm white">Depressed</p>
												) : (
													<p className="text-sm white">Not Depressed</p>
												)}
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

export default function DepressionSummaryPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center h-screen">
					Loading summary...
				</div>
			}
		>
			<DepressionSummaryContent />
		</Suspense>
	);
}
