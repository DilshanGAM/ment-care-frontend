import React, { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";
import { UserRoundPlus } from "lucide-react";

export default function UserAddDialog({refresh}: {refresh: any}) {
	const [open, setOpen] = useState(false);
	const [userType, setUserType] = useState("");
	const [diseases, setDiseases] = useState({
		Alzheimers: false,
		Autism: false,
		Depression: false,
		Parkinson: false,
	});

	const handleDiseaseChange = (disease: keyof typeof diseases) => {
		setDiseases((prev) => ({
			...prev,
			[disease]: !prev[disease],
		}));
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();

		const selectedDiseases = Object.entries(diseases)
			.filter(([_, value]) => value)
			.map(([key]) => key);
        if(e.target.password.value !== e.target.confirm_password.value){
            toast.error("Passwords do not match");
            return;
        }

		const newUser = {
			email: e.target.email.value,
			firstName: e.target.first_name.value,
			lastName: e.target.last_name.value,
			phone: e.target.phone.value,
            password: e.target.password.value,
            image : "https://picsum.photos/id/173/200/200",
			type: userType,
			diseases: userType === "patient" ? selectedDiseases : [],
		};
        const token = localStorage.getItem("token");
        axios.post(`/api/users/register`, newUser, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            toast.success("User added successfully");
            setOpen(false);
            refresh();
        })
        .catch((err) => {
            toast.error("Failed to add user");
            console.log(err);
        });

		console.log(newUser);
		setOpen(false);
	};

	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						className="fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 text-2xl shadow-lg"
						onClick={() => setOpen(true)}
					>
						<UserRoundPlus />
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Add New User</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit} className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input id="email" name="email" className="col-span-3" required />
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="first_name" className="text-right">
								First Name
							</Label>
							<Input
								id="first_name"
								name="first_name"
								className="col-span-3"
								required
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="last_name" className="text-right">
								Last Name
							</Label>
							<Input
								id="last_name"
								name="last_name"
								className="col-span-3"
								required
							/>
						</div>
                        {/* password */}
                        <div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="last_name" className="text-right">
								Password
							</Label>
							<Input
								id="password"
								name="password"
								className="col-span-3"
								required
							/>
						</div>
                        <div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="last_name" className="text-left">
								Confirm password
							</Label>
							<Input
								id="confirm_password"
								name="confirm_password"
								className="col-span-3"
								required
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="phone" className="text-right">
								Phone
							</Label>
							<Input id="phone" name="phone" className="col-span-3" required />
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right">User Type</Label>
							<Select onValueChange={setUserType} required>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="doctor">Doctor</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="patient">Patient</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{userType === "patient" && (
							<div>
								<Label className="mb-2">Diseases</Label>
								<div className="flex flex-col space-y-2">
									{Object.keys(diseases).map((disease) => (
										<div key={disease} className="flex items-center space-x-2">
											<Checkbox
												id={disease}
												checked={diseases[disease as keyof typeof diseases]}
												onCheckedChange={() =>
													handleDiseaseChange(disease as keyof typeof diseases)
												}
											/>
											<Label htmlFor={disease} className="capitalize">
												{disease}
											</Label>
										</div>
									))}
								</div>
							</div>
						)}
						<DialogFooter className="w-full">
                            <div className="w-full flex justify-end gap-4">
                            <Button className="w-[150px]" type="button" onClick={() => setOpen(false)} variant="outline">
								Cancel
							</Button>
							<Button className="w-[150px]" type="submit">Add User</Button>							
                            </div>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
