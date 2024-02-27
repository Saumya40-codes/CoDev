import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/app/lib/Apis/ApiResponse";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
    try{
        const {name, email, image} = await req.json();

        console.log(name, email, image)

        if(!name || !email){
            return NextResponse.json(new ApiResponse({status: 400, message: 'Please provide all the required fields'}))
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                image
            }
        })

        console.log(user)

        return NextResponse.json(new ApiResponse({status: 201, message: 'User created successfully'}))
    }
    catch(e){
        return NextResponse.json(new ApiResponse({status: 500, message: (e as Error).message}))
    }
    finally{
        await prisma.$disconnect()
    }
}
