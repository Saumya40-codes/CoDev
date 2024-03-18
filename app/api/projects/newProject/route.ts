import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";


export const POST = async(req:Request, res: Response) => {
    try{
        const {name, userId} = await req.json();

        const newProject = await prisma.projects.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json({id: newProject.id}, {status: 201});
    }
    catch(error){
        return NextResponse.json({error: (error as Error).message || 'Error Occured'}, {status: 500});
    }
}