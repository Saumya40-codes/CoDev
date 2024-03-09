import { NextResponse } from "next/server";


export const POST = async(req:Request, res: Response) => {
    try{

    }
    catch(error){
        return NextResponse.json({error: (error as Error).message || 'Error Occured'}, {status: 500});
    }
}