"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import mediaUpload from "@/lib/mediaUploader"; // Adjust import path if needed
import { motion, AnimatePresence } from "framer-motion";

const questions = [
	{
		id: "A1",
		question: "Does your child look at you when you call his/her name?",
	},
	{
		id: "A2",
		question: "How easy is it for you to get eye contact with your child?",
	},
	{
		id: "A3",
		question:
			"Does your child point to indicate that s/he wants something? (e.g. a toy that is out of reach)",
	},
	{
		id: "A4",
		question:
			"Does your child point to share interest with you? (e.g. pointing at an interesting sight)",
	},
	{
		id: "A5",
		question:
			"Does your child pretend? (e.g. care for dolls, talk on a toy phone)",
	},
	{ id: "A6", question: "Does your child follow where you’re looking?" },
	{
		id: "A7",
		question:
			"If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them? (e.g. stroking hair, hugging them)",
	},
	{ id: "A8", question: "Would you describe your child’s first words as:" },
	{
		id: "A9",
		question: "Does your child use simple gestures? (e.g. wave goodbye)",
	},
	{
		id: "A10",
		question: "Does your child stare at nothing with no apparent purpose?",
	},
];

export default function AutismDataCollection() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<{ [key: string]: number | string }>(
		{}
	);
	const [capturing, setCapturing] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Camera handling
	useEffect(() => {
		if (capturing) {
			const startCamera = async () => {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
					});
					if (videoRef.current) {
						videoRef.current.srcObject = stream;
					}
				} catch (error) {
					console.error("Camera error:", error);
					toast.error("Unable to access camera");
				}
			};

			startCamera();
		}

		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
				tracks.forEach((track) => track.stop());
			}
		};
	}, [capturing]);

	const handleAnswer = (answer: number) => {
		const currentQ = questions[currentQuestion];
		setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));

		if (currentQuestion === questions.length - 1) {
			toast.success("All questions answered! Proceeding to camera...");
			setCapturing(true);
		} else {
			setDirection(1);
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	const goToPrevious = () => {
		if (currentQuestion > 0) {
			setDirection(-1);
			setCurrentQuestion((prev) => prev - 1);
		}
	};

	const capturePhotoAndUpload = async () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (!video || !canvas) {
			toast.error("Camera not ready");
			return;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			toast.error("Failed to capture image");
			return;
		}

		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			if (!blob) {
				toast.error("Failed to capture image");
				return;
			}

			const file = new File([blob], `user_${Date.now()}.png`, {
				type: "image/png",
			});

			try {
				setUploading(true);
				const uploadedUrl = await mediaUpload(file);
				toast.success("Image uploaded successfully!");

				const finalAnswers = { ...answers, url: uploadedUrl as string };
				setAnswers(finalAnswers);
				console.log("Final Answers JSON:", finalAnswers);

				setCapturing(false);
			} catch (error) {
				console.error(error);
				toast.error("Failed to upload image");
			} finally {
				setUploading(false);
			}
		}, "image/png");
	};

	// Animation Variants
	const variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 300 : -300,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction < 0 ? 300 : -300,
			opacity: 0,
		}),
	};

	return (
		<div className="flex w-full h-screen overflow-hidden bg-gray-100 text-gray-800">
			{/* Sidebar */}
			<div className="w-72 bg-white shadow-lg p-6 flex flex-col">
				<h2 className="text-xl font-bold mb-4 text-center">Progress</h2>
				<div className="flex-1 overflow-y-auto">
					{questions.map((q, index) => (
						<div
							key={q.id}
							className={`p-3 mb-2 rounded-md cursor-pointer transition-all duration-300
                ${
									index === currentQuestion
										? "bg-blue-500 text-white"
										: "bg-gray-100 hover:bg-gray-200"
								}
                ${
									answers[q.id] === 0
										? "border-l-4 border-green-500"
										: answers[q.id] === 1
										? "border-l-4 border-red-500"
										: ""
								}`}
							onClick={() => {
								if (!capturing) {
									setDirection(index > currentQuestion ? 1 : -1);
									setCurrentQuestion(index);
								}
							}}
						>
							<p className="text-sm font-semibold">{q.id}</p>
							<p className="text-xs truncate">{q.question}</p>
						</div>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex justify-center items-center relative p-8 bg-gray-50">
				{!capturing ? (
					<div className="w-full max-w-xl relative">
						<AnimatePresence initial={false} custom={direction} mode="wait">
							<motion.div
								key={currentQuestion}
								custom={direction}
								variants={variants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									x: { type: "spring", stiffness: 300, damping: 30 },
									opacity: { duration: 0.2 },
								}}
								className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center"
							>
								<h2 className="text-2xl font-bold mb-4">
									Question {currentQuestion + 1}
								</h2>
								<p className="text-lg mb-8 text-center">
									{questions[currentQuestion].question}
								</p>

								<div className="flex gap-4">
									<button
										onClick={() => handleAnswer(0)}
										className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
									>
										Yes
									</button>
									<button
										onClick={() => handleAnswer(1)}
										className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
									>
										No
									</button>
								</div>
							</motion.div>
						</AnimatePresence>

						<div className="flex justify-between mt-6">
							<button
								onClick={goToPrevious}
								disabled={currentQuestion === 0}
								className={`px-4 py-2 rounded-md transition-all ${
									currentQuestion === 0
										? "bg-gray-300 text-white cursor-not-allowed"
										: "bg-blue-500 hover:bg-blue-600 text-white"
								}`}
							>
								Previous
							</button>

							<button
								onClick={() => {
									handleAnswer(
										typeof answers[questions[currentQuestion].id] === "number"
											? (answers[questions[currentQuestion].id] as number)
											: 0
									);
								}}
								className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all"
							>
								Next
							</button>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-lg">
						<h2 className="text-2xl font-bold">Capture Your Photo</h2>
						<video
							ref={videoRef}
							autoPlay
							muted
							playsInline
							className="w-[400px] h-[300px] rounded-md object-cover border border-gray-300"
						/>
						<canvas ref={canvasRef} style={{ display: "none" }} />

						<button
							onClick={capturePhotoAndUpload}
							disabled={uploading}
							className={`px-6 py-3 rounded-lg font-medium transition-all ${
								uploading
									? "bg-gray-400 text-white cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-700 text-white"
							}`}
						>
							{uploading ? "Uploading..." : "Capture & Upload"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
