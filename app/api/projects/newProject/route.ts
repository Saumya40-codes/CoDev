import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { client } from "@/app/lib/redis/db";


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

        console.log(newProject);

        await client.set('project', newProject.id.toString(), { EX: 60*60*2 });

        console.log('Project Created');

        return NextResponse.json({id: newProject.id}, {status: 201});
    }
    catch(error){
        return NextResponse.json({error: (error as Error).message || 'Error Occured'}, {status: 500});
    }
}