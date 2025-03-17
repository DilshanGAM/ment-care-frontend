"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import mediaUpload from "@/lib/mediaUploader"; // adjust import based on your project structure

export default function ChatPage() {
    const [status, setStatus] = useState("loading");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // For capturing image from video

    // Load Chat Messages
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios
            .get(process.env.NEXT_PUBLIC_BACKEND_URL + "/depression/chats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setMessages(res.data);
                setStatus("loaded");
            })
            .catch((err) => {
                console.log(err);
                setStatus("error");
            });
    }, [status]);

    // Start Camera on Mount
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                toast.error("Unable to access the camera");
            }
        };

        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    // Capture and Upload the Image
    const captureAndUploadImage = async () => {
        if (!videoRef.current) {
            throw new Error("Camera is not active");
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!canvas) {
            throw new Error("Canvas not found");
        }

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        // Draw current frame from video to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to blob (PNG)
        return new Promise<File>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject("Failed to capture image");
                    return;
                }

                // Convert blob to a File for upload
                const file = new File([blob], "snapshot.png", { type: "image/png" });
                resolve(file);
            }, "image/png");
        });
    };

    const sendMessage = async () => {
        if (message === "") {
            toast.error("Message cannot be empty");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            // 1. Capture image from webcam
            const file = await captureAndUploadImage();

            // 2. Upload image to Supabase Storage
            const imageUrl = await mediaUpload(file);

            console.log("Image uploaded to:", imageUrl);

            // 3. Send chat message + image URL
            const res = await axios.post(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/depression/chat",
                {
                    message: message,
                    url: imageUrl, // Pass the image URL in the request body
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res.data)
            setMessages(res.data);
            setMessage("");
            toast.success("Message sent successfully!");

        } catch (err: any) {
            console.error(err);
            toast.error("Failed to send message with image");
        }
    };

    return (
        <div className="relative w-full h-full max-h-full overflow-y-scroll flex flex-col justify-center items-center pb-[100px]">
            {/* Camera Preview in Top-Right */}
            <div className="absolute top-4 right-4 w-[200px] h-[150px] rounded-lg overflow-hidden border-2 border-gray-400 shadow-md z-50 bg-black">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Hidden canvas for capturing snapshot */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Chat Messages */}
            {messages.map((message: any, index) => (
                <div
                    key={index}
                    className={`w-full flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`w-1/2 p-2 m-2 ${
                            message.role === "user" ? "bg-blue-500" : "bg-gray-500"
                        } rounded-lg text-white`}
                    >
                        {message.message}
                        {message.url && (
                            <div className="mt-2">
                                <img
                                    src={message.url}
                                    alt="snapshot"
                                    className="w-32 h-auto rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Message Input */}
            <div className="w-full fixed bottom-0 flex justify-center items-center bg-white py-2">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="w-1/2 p-2 m-2 border-2 border-gray-500 rounded-lg"
                    placeholder="Type a message"
                />
                <button
                    onClick={sendMessage}
                    className="p-2 m-2 bg-blue-500 text-white rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
