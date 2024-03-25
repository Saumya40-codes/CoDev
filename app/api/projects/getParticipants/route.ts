import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export const GET = async (req: Request, res: Response) => {
    try{
        const { projectId } = await req.json();
        const participants = await prisma.participants.findMany({
            where: {
                projectId: projectId as string
            },
            select: {
                user :{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json(participants, { status: 200 });
    }
    catch(err){
        return NextResponse.json({message: "Internal Server Error"}, { status: 500 });
    }
}