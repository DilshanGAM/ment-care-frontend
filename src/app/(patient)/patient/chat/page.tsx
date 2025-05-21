"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import mediaUpload from "@/lib/mediaUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
    const [status, setStatus] = useState("loading");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load Chat Messages on mount
    useEffect(() => {
        loadMessages();
    }, []);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const loadMessages = async () => {
        const token = localStorage.getItem("token");
        setStatus("loading");
        try {
            const res = await axios.get(
                `/api/depression/chats`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessages(res.data);
            setStatus("loaded");
        } catch (err) {
            console.log(err);
            setStatus("error");
        }
    };

    // Start Camera on Mount
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    const captureAndUploadImage = async () => {
        if (!videoRef.current) throw new Error("Camera is not active");

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas not found");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return new Promise<File>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject("Failed to capture image");
                    return;
                }
                const file = new File([blob], "snapshot.png", { type: "image/png" });
                resolve(file);
            }, "image/png");
        });
    };

    const sendMessage = async () => {
        if (!message.trim()) {
            toast.error("Message cannot be empty");
            return;
        }

        setStatus("loading");

        const token = localStorage.getItem("token");

        try {
            const file = await captureAndUploadImage();
            const imageUrl = await mediaUpload(file);

            const res = await axios.post(
                `/api/depression/chat`,
                { message, url: imageUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(res.data);
            setMessage("");
            toast.success("Message sent successfully!");
            setStatus("loaded");

            // Scroll after sending message
            scrollToBottom();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message with image");
            setStatus("error");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 flex flex-col">
            {/* Camera Preview */}
            <div className="absolute top-6 right-6 w-[220px] h-[160px] backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-lg overflow-hidden z-50">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Hidden canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Chat Box */}
            <div
                ref={chatContainerRef}
                className="flex-grow p-4 overflow-y-auto"
                style={{ scrollBehavior: "smooth" }}
            >
                <div className="flex flex-col gap-4 pb-28">
                    {status === "loading" ? (
                        <div className="flex justify-center mt-10">
                            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="text-center text-gray-400">No messages yet.</p>
                    ) : (
                        messages.map((msg: any, index: number) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <Card
                                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md ${
                                        msg.role === "user"
                                            ? "bg-indigo-500 text-white"
                                            : "bg-white text-gray-800"
                                    }`}
                                >
                                    <CardContent className="p-0">
                                        <p className="text-sm">{msg.message}</p>
                                        {msg.url && (
                                            <img
                                                src={msg.url}
                                                alt="snapshot"
                                                className="mt-2 rounded-lg w-32 h-auto"
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Input Box */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <div className="fixed bottom-0 w-full border-t bg-white px-4 py-3 flex items-center gap-3">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        placeholder="Type a message and press Enter..."
                        className="flex-grow"
                        onKeyDown={handleKeyDown}
                        disabled={status === "loading"}
                    />
                    <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Send"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
