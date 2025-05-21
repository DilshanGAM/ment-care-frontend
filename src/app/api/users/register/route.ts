import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import connectMongo from "@/lib/connectDB";

export async function POST(req:NextRequest){
    //check if a user available in the header
    await connectMongo();
    const user = req.headers.get("user");
    
    const {email, password, firstName, lastName, phone, type, diseases, image} = await req.json();

    if(type == "admin"){
        if(!user){
            return NextResponse.json({message: "Must login first before create admin accounts", description : "Please login before you create an admin account."}, {status: 404});
        }
        const userData = JSON.parse(user);
        if(userData.type != "admin"){
            return NextResponse.json({message: "Must be an Admin to create new admins", description : "You are not authorized to create an admin account."}, {status: 404});
        }
    }
    if(type == "doctor"){
        if(!user){
            return NextResponse.json({message: "Must login first before create doctor accounts", description : "Please login before you create a doctor account."}, {status: 404});
        }
        const userData = JSON.parse(user);
        if(userData.type != "admin"&& userData.type != "doctor"){
            return NextResponse.json({message: "Must be an Admin or a Doctor to create new Doctor accounts.", description : "You are not authorized to create a doctor account."}, {status: 404});
        }
    }

    //create a  new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        type,
        diseases,
        image
    }
    try{
        await User.create(newUser)
        return NextResponse.json({message: "User created successfully", description : "User created successfully."}, {status: 200});
    }catch(e){
        console.log(e);
        return NextResponse.json({message: "Error while creating a new user", description : "Error while creating a new user."}, {status: 404});
    }
    
}