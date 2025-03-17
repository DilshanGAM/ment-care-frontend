import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Image from "next/image";
import Link from "next/link";
import {
	FileUser,
	LayoutDashboard,
	Stethoscope,
	UserRound,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ment-care",
	description: "Next Generation Mental Health Care Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex antialiased w-full h-full`}
			>
				<Toaster position="top-right" />
				<div className="w-[300px] h-screen bg-[#D3D3D350] flex flex-col top-0 left-0 z-50 py-8">
					<div className="relative w-[200px] h-[35px] cursor-pointer mx-auto mb-8">
						<Image
							src="/admin-header-logo.png"
							alt="logo"
							layout="fill"
							objectFit="center"
						/>
					</div>
					<Link
						href="/admin"
						className="text-left text-md text-bgGray w-full pl-12 mb-4 flex items-center hover:text-black"
					>
						<LayoutDashboard className="mr-2" />
						Dashboard
					</Link>
					<Link
						href="/admin/users"
						className="text-left text-md text-bgGray w-full pl-12 mb-4 flex items-center hover:text-black"
					>
						<UserRound className="mr-2" />
						Users
					</Link>
					{/* doctors */}
					<Link
						href="/admin/doctors"
						className="text-left text-md text-bgGray w-full pl-12 mb-4 flex items-center hover:text-black"
					>
						<Stethoscope className="mr-2" />
						Doctors
					</Link>
					{/* patients */}
					<Link
						href="/admin/patients"
						className="text-left text-md text-bgGray w-full pl-12 mb-4 flex items-center hover:text-black"
					>
						<FileUser className="mr-2" />
						Patients
					</Link>
				</div>
				<div className="w-[calc(100vw-300px)] h-screen">{children}</div>
			</body>
		</html>
	);
}
