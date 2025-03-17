"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientPage() {
	const [user, setUser] = useState<{ diseases: string[] }>({ diseases: [] });
	const router = useRouter();
	const [userValidationStatus, setUserValidationStatus] = useState("loading"); //loading, authorized, unauthorized

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (userValidationStatus == "loading") {
			axios
				.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/user`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setUser(res.data);
					if (res.data.type != "patient") {
						setUserValidationStatus("unauthorized");
						router.push("/login");
					} else setUserValidationStatus("authorized");
				})
				.catch((err) => {
					console.log(err);
					router.push("/login");
				});
		}
	}, [userValidationStatus]);

	return (
		<div className="w-full h-full flex justify-center items-center">
			{userValidationStatus === "authorized" ? (
				<div className="w-full h-full flex flex-col items-center">
					{/* {user.diseases.map((disease) => (
						<div key={disease} className="bg-blue-200 p-2 m-1 rounded-md">
							{disease}
						</div>
					))} */}
                    {
                        user.diseases.includes("Depression")?
                        <>
                        <Link href="/patient/chat">
                            <div className="bg-blue-200 p-2 m-1 rounded-md">Chat for stress out</div>
                        </Link>
                        </>:null
                    }
				</div>
			) : null}
		</div>
	);
}
