import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authConfig: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks:{
        async signIn({ user }) {
            if(user){
                const Existinguser = await prisma.user.findUnique({
                    where:{
                        email: user.email as string
                    }
                });
                if(Existinguser){
                    return true;
                }
                else{
                    await prisma.user.create({
                        data:{
                            email: user.email as string,
                            name: user.name as string,
                            image: user.image as string
                        }
                    });
                    return true;
                }
            }
            else{
                return false;
            }
        }
    }
}