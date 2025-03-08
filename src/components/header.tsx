import Image from "next/image";
import Link from "next/link";

export default function Header(){
    return (
        <header className="bg-bgGray text-primary w-full h-[64px] flex justify-cente items-center p-3 relative">
            <Image src="/header-logo.png" className="absolute z-50 cursor-pointer" alt="logo" width={100} height={100} />
            <div className="w-full  flex justify-center items-center h-full">
                <Link href="/" className="text-md  text-white mx-4 hover:text-accentGreen">
                    Home
                </Link>
                <Link href="/about" className="text-md  text-white mx-4 hover:text-accentGreen">
                    About
                </Link>
                <Link href="/contact" className="text-md  text-white mx-4 hover:text-accentGreen">
                    Contact
                </Link>
                <Link href="/login" className="text-md  text-white mx-4 hover:text-accentGreen absolute right-3">
                    Login
                </Link>
            </div>
        </header>
    )
}