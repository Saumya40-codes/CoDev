import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";


export const GET = async (req: Request, res: Response) => {
    try{
        const {fileId} = await res.json();

        const code = await prisma.codes.findUnique({
            where:{
                fileId
            },
            select:{
                id: true,
                code: true
            }
        });

        return NextResponse.json(code, {status: 200});
    }
    catch(error){
        return NextResponse.json({message: 'Error fetching code block'}, {status: 500});
    }
}