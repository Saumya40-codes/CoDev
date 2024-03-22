import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";


export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: params.userId
            },
            select:{
                projects : {
                    select:{
                        id: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                        files: {
                            select:{
                                id: true,
                                language: true
                            }
                        }
                    },
                    orderBy:{
                        updatedAt: 'desc',
                        createdAt: 'desc'
                    }
                }
            }
        });

        if(!user){
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }

        return NextResponse.json(user, {status: 200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}