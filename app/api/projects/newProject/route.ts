import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { client } from "@/app/lib/redis/db";


export const POST = async(req:Request, res: Response) => {
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

    try{
        await client.sAdd(`project:${newProject.id}`,userId);
    }
    catch(error){
        // redis instance might have got closed due to inactivity in which case we need to reinitialize it
    }

    return NextResponse.json({
        message: "Project created successfully",
        project: newProject
    });
}