import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import client from "@/app/lib/redis/db";


export const POST = async(req:Request, res: Response) => {
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

    await client.sadd(`project:${newProject.id}`,userId);

    return NextResponse.json({
        message: "Project created successfully",
        project: newProject
    });
}