"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoaderAnimation from "@/components/loader";
import UserAddDialog from "@/components/addUserForm";

export default function AdminUsersPage() {
	return (
		<div className="w-full h-full max-h-full overflow-y-scroll flex flex-col items-center">
			<Tabs defaultValue="All" className="w-full">
				<TabsList className="mx-auto my-8 ">
					<TabsTrigger value="All" className="cursor-pointer">
						All Users
					</TabsTrigger>
					<TabsTrigger value="Doctors" className="cursor-pointer">
						Doctors
					</TabsTrigger>
					<TabsTrigger value="Patients" className="cursor-pointer">
						Patients
					</TabsTrigger>
				</TabsList>
				<TabsContent value="All">
					<AllUsersTab type="all" />
				</TabsContent>
				<TabsContent value="Doctors">
					<AllUsersTab type="doctors" />
				</TabsContent>
				<TabsContent value="Patients">
					<AllUsersTab type="patients" />
				</TabsContent>
			</Tabs>
			
		</div>
	);
}

function AllUsersTab({ type }: { type: string }) {
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
				.get(`/api/users/selected?type=${type}`, {
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
						{type == "all" && "All Users"}
						{type == "doctors" && "Doctors"}
						{type == "patients" && "Patients"}
					</TableCaption>
					<TableHeader>
						<TableRow>
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
							<TableRow key={user.email}>
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
			<UserAddDialog refresh = {refresher}/>
		</div>
	);
}
