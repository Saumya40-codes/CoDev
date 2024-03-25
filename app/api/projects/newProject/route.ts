import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";


export const POST = async(req:Request, res: Response) => {
    try{
        const {name, userId} = await req.json();
        console.log(name, userId);

        const newProject = await prisma.projects.create({
            data: {
                name,
                userId
            }
        });

        await prisma.participants.create({
            data: {
                projectId: newProject.id,
                userId
            }
        });

        return NextResponse.json({id: newProject.id}, {status: 201});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error: 'Error Occured'}, {status: 500});
    }
}