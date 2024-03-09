import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/prisma";

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
                    if(cookies().get('userId') === undefined){
                        cookies().set('userId', Existinguser.id);
                    }
                    return true;
                }
                else{
                    const newUser = await prisma.user.create({
                        data:{
                            email: user.email as string,
                            name: user.name as string,
                            image: user.image as string
                        }
                    });

                    if(cookies().get('userId') === undefined){
                        cookies().set('userId', newUser.id);
                    }

                    return true;
                }
            }
            else{
                return false;
            }
        }
    }
}