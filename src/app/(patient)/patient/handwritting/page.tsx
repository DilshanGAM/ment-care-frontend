"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import mediaUpload from "@/lib/mediaUploader"; // ✅ Adjust path to your actual media uploader
import axios from "axios";

export default function HandWrittingInput() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPoint = useRef({ x: 0, y: 0 });
    const [uploading, setUploading] = useState(false);

    // Start drawing
    const startDrawing = (e: any) => {
        isDrawing.current = true;
        const { x, y } = getEventPosition(e);
        lastPoint.current = { x, y };
    };

    // Stop drawing
    const stopDrawing = () => {
        isDrawing.current = false;
    };

    // Drawing handler
    const draw = (e: any) => {
        if (!isDrawing.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const { x, y } = getEventPosition(e);

        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();

        lastPoint.current = { x, y };
    };

    // Get cursor/touch position
    const getEventPosition = (e: any) => {
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const canvas = canvasRef.current;
        const rect = canvas?.getBoundingClientRect();

        const x = clientX - (rect?.left || 0);
        const y = clientY - (rect?.top || 0);

        // Scale coordinates to match internal canvas size
        const scaleX = (canvas?.width || 1) / (rect?.width || 1);
        const scaleY = (canvas?.height || 1) / (rect?.height || 1);

        return {
            x: x * scaleX,
            y: y * scaleY,
        };
    };

    // Clear the canvas and fill it with white
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            ctx.fillStyle = "#ffffff"; // White background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Save the canvas as an image and upload to Supabase
    const saveCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            toast.error("Canvas not found");
            return;
        }

        setUploading(true);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            toast.error("Context not found");
            setUploading(false);
            return;
        }

        // Create a temporary canvas to combine white background + drawing
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) {
            toast.error("Temporary context not found");
            setUploading(false);
            return;
        }

        // Fill the temp canvas background with white
        tempCtx.fillStyle = "#ffffff";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original canvas content onto the white background
        tempCtx.drawImage(canvas, 0, 0);

        // Convert the temp canvas to blob and upload
        tempCanvas.toBlob(async (blob) => {
            if (!blob) {
                toast.error("Failed to create image");
                setUploading(false);
                return;
            }

            const file = new File([blob], `handwriting_${Date.now()}.png`, {
                type: "image/png",
            });

            try {
                const token = localStorage.getItem("token");
                const uploadedUrl = await mediaUpload(file);
                const response = await axios.post("/api/parkinson/handwritting", {
                    img : uploadedUrl,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });                    
                console.log("Uploaded image URL:", uploadedUrl);
                toast.success("Handwriting data uploaded successfully!");
            } catch (err) {
                console.error(err);
                toast.error("Failed to upload handwriting");
            } finally {
                setUploading(false);
            }
        }, "image/png");
    };

    // Set up the canvas size and initialize white background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const size = 600; // Square canvas
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "#ffffff"; // White background
                ctx.fillRect(0, 0, size, size);
            }
        }
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center p-4">
            <div className="relative border-2 border-gray-500 rounded-lg">
                <canvas
                    ref={canvasRef}
                    className="bg-white touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{
                        width: "600px",     // CSS width
                        height: "600px",    // CSS height
                        borderRadius: "0.5rem",
                        touchAction: "none", // Prevent scrolling on touch devices
                        backgroundColor: "#ffffff" // Optional for visual indication
                    }}
                />
            </div>

            <div className="flex gap-4 mt-4">
                <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                    Clear
                </button>
                <button
                    onClick={saveCanvas}
                    disabled={uploading}
                    className={`px-4 py-2 rounded-md ${
                        uploading ? "bg-gray-400" : "bg-blue-500"
                    } text-white`}
                >
                    {uploading ? "Uploading..." : "Save & Upload"}
                </button>
            </div>
        </div>
    );
}
