export const dynamic = "force-dynamic";
import User from "@/models/user";
import { NextRequest , NextResponse } from "next/server";

export async function GET(request : NextRequest){

    const user = request.headers.get("user");
    if(!user){
        return NextResponse.json({message : "User not found"}, {status : 404});
    }
    const userObject = JSON.parse(user);

    const type = request.nextUrl.searchParams.get("type");
    if(!type){
        return NextResponse.json({message : "Type not found"}, {status : 404});
    }
    
    //only doctors and admins can access this route
    if(userObject.type != "admin" && userObject.type != "doctor"){
        return NextResponse.json({message : "Unauthorized"}, {status : 401});
    }

    try{
        if(type == "all"){
            const users = await User.find({});
            return NextResponse.json(users, {status : 200});
        }else if(type == "doctors"){
            const users = await User.find({type : "doctor"});
            return NextResponse.json(users, {status : 200});
        }else if(type == "patients"){
            const users = await User.find({type : "patient"});
            return NextResponse.json(users, {status : 200});
        }
        const users = await User.find({type : type})
        return NextResponse.json(users, {status : 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({message : "Internal server error"}, {status : 500});
    }
}