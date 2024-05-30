import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { client } from "@/app/lib/redis/db";


export const POST = async(req:Request, res: Response) => {
    try{
        const {name, userId} = await req.json();

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

        await client.sAdd(`project:${newProject.id}`,userId);

        return NextResponse.json({id: newProject.id}, {status: 201});
    }
    catch(error){
        console.log(error);
        return NextResponse.json({error: 'Error Occured'}, {status: 500});
    }
}