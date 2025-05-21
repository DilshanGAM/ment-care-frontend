"use client";
import "../../globals.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoaderAnimation from "@/components/loader";



export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [user, setUser] = useState({});
  const router = useRouter();
  const [userValidationStatus, setUserValidationStatus] = useState("loading");//loading, authorized, unauthorized
	useEffect(() => {
		const token = localStorage.getItem("token");
		if(userValidationStatus == "loading"){axios
			.get(`/api/users/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				setUser(res.data.user);
        if(res.data.user.type != "patient"){
          setUserValidationStatus("unauthorized");
          router.push("/login");
        }else
          setUserValidationStatus("authorized");
			})
			.catch((err) => {
				console.log(err);
        router.push("/login");
			});}
	}, [userValidationStatus]);
	return (
      <div className="h-screen  w-screen">
        {
          userValidationStatus === "loading" ? <LoaderAnimation/> : null
        }
        {
          userValidationStatus === "unauthorized" ? <div>Unauthorized</div> : null
        }
        {
          userValidationStatus === "authorized" ? children : null
        }
      </div>
	);
}
