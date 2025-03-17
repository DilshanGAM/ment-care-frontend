"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import mediaUpload from "@/lib/mediaUploader"; // ✅ Adjust the import path accordingly

export default function AudioTest() {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [uploading, setUploading] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                toast.success("Recording complete!");
            });

            mediaRecorderRef.current.start();
            setRecording(true);
            setRecordingTime(0);

            // Start duration counter
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

            toast.success("Recording started!");
        } catch (err) {
            console.error("Error accessing microphone:", err);
            toast.error("Microphone access denied");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            toast.success("Recording stopped!");
        }
    };

    const saveRecording = async () => {
        if (!audioChunksRef.current.length) {
            toast.error("No recording to save!");
            return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([audioBlob], `audio_${Date.now()}.webm`, {
            type: "audio/webm",
        });

        try {
            setUploading(true);
            const uploadedUrl = await mediaUpload(file);
            console.log("Uploaded audio URL:", uploadedUrl);
            toast.success("Audio uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload audio");
        } finally {
            setUploading(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Format seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    return (
        <div className="flex flex-col justify-center items-center gap-6 p-8">
            <h2 className="text-2xl font-bold text-center">Audio Recorder</h2>

            <div className="flex flex-col justify-center items-center gap-4">
                <div className="text-lg font-medium">
                    {recording ? (
                        <span className="text-red-500">Recording: {formatTime(recordingTime)}</span>
                    ) : (
                        <span className="text-gray-700">Not recording</span>
                    )}
                </div>

                <div className="flex gap-4">
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                        >
                            Stop Recording
                        </button>
                    )}
                </div>

                {audioURL && (
                    <div className="flex flex-col items-center gap-4 mt-4 w-full">
                        <audio
                            controls
                            src={audioURL}
                            className="w-[600px] max-w-full border border-gray-300 rounded-md shadow"
                        />
                        <button
                            onClick={saveRecording}
                            disabled={uploading}
                            className={`px-6 py-3 rounded-lg font-medium ${
                                uploading
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {uploading ? "Uploading..." : "Save & Upload"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
