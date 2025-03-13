"use client"
import { IconCloudDemo } from "@/components/login-icon-cloud";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter()
	function handleLogin(){
		console.log(email , password)
		console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
		axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`,{
			email,
			password
		}).then((res)=>{
			const user = res.data.user
			localStorage.setItem("token",res.data.token)
			if(user.type === "patient"){
				router.push("/patient")
			}else if(user.type === "doctor"){
				router.push("/doctor")
			}
			else if(user.type === "admin"){
				router.push("/admin")
			}
		}).catch((err)=>{

			if(err.response.data){
				toast.error(err.response.data)
			}
		})
	}
	return (
		<div className=" h-screen bg-[url(/login-bg.jpg)] bg-[cover] bg-[top] flex justify-center items-center ">
			<div className=" h-full w-[49%] p-10 rounded-lg flex  justify-center items-center">
				<div className="rotate-[-5deg] pt-24 flex flex-col justify-center  items-center w-full ">
					<BlurFade
						inView={true}
						delay={0.5}
						className="w-full flex flex-col justify-center items-center"
					>
						<div className="relative h-[60px] w-[345px]">
							<Image
								src="/header-logo.png"
								alt="logo"
								layout="fill"
								objectFit="center"
							/>
						</div>
					</BlurFade>
					<TypingAnimation className="text-white mb-12  text-2xl font-bold">
						It's all about you!✏️
					</TypingAnimation>					
					<IconCloudDemo  />
				</div>
			</div>

			<div className=" w-[49%] p-10 rounded-lg relative overflow-hidden">
				<div className="relative  flex flex-col px-20 justify-center items-center backdrop-blur-sm shadow-2xl h-[500px] w-[500px] rounded-lg ">
					<span className="text-accentGreen text-2xl font-bold text-center">
						Login to your mentcare account
					</span>
					<Input placeholder="Email" type="email" className="mt-5 border text-white" value={email} onChange={(e)=>{
						setEmail(e.target.value)
					}} />
					<Input placeholder="Password" type="password" className="mt-5 border text-white" value={password} onChange={(e)=>{
						setPassword(e.target.value)
					}}/>
					<Button className="mt-5 w-full bg-bgGray cursor-pointer" onClick={handleLogin}>Login</Button>

					<BorderBeam
						colorFrom="#D9FF05"
						colorTo="#575757"
						duration={6}
						delay={3}
						size={400}
					/>
				</div>
			</div>
		</div>
	);
}
