"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoaderAnimation from "@/components/loader";

export default function UsersByDiseaseTable({disease}:{disease: string}) {
    const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("You need to login first");
			router.push("/login");
		}
		if (loading) {
			axios
				.get(`/api/users/patients?disease=${disease}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					console.log(res.data);
					setUsers(res.data);
					setLoading(false);
				})
				.catch((err) => {
					toast.error("Failed to fetch users");
					console.log(err);
				});
		}
	}, [loading]);
	function refresher(){
		setLoading(true);
	}

	return (
		<div className="w-full h-full flex flex-col items-center">
			{loading ? (
				<LoaderAnimation />
			) : (
				<Table>
					<TableCaption>
						Users with {disease}
					</TableCaption>
					<TableHeader>
						<TableRow >
							<TableHead></TableHead>
							<TableHead>First Name</TableHead>
							<TableHead>Last Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Diseases</TableHead>
							<TableHead>Phone Number</TableHead>
							<TableHead>Type</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user: any) => (
							<TableRow  key={user.email} className="cursor-pointer" onDoubleClick={()=>{
                                router.push(`/doctor/${disease}/summary?email=${user.email}`);
                            }}>
								<TableCell>
									<Avatar>
										<AvatarImage src={user.image} alt="@shadcn" />
										<AvatarFallback>
											{user.firstName[0].toUpperCase() +
												user.lastName[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</TableCell>
								<TableCell>{user.firstName}</TableCell>
								<TableCell>{user.lastName}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{
									user.diseases.map((disease: any , index : Number) => (
										<span key={disease}>{disease}{index!=(user.diseases.length-1)&&","} </span>
									))
									}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>{user.type}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);

}