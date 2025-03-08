import { IconCloudDemo } from "@/components/login-icon-cloud";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
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
					<Input placeholder="Email" type="email" className="mt-5 border" />
					<Input placeholder="Password" type="password" className="mt-5" />
					<Button className="mt-5 w-full bg-bgGray">Login</Button>

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
