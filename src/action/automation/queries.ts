'use server'

import { client } from "@/lib/prisma"
import { v4 } from "uuid"

export const createAutomation = async(clerkId: string, id?: string ) => {
    return await client.user.update({
        where: {
            clerkId,
        },
        data: {
            automations: {
                create: {
                    ...(id && { id })
                }
            }            
        }
    })
}


export const getAutomations = async (clerkId:string) => {
    return await client.user.findUnique({
        where: {
            clerkId,
        },
        select: {
            automations: {
                orderBy:{
                    createdAt: 'asc',
                },
                include: {
                    keywords: true,
                    listner: true
                }
            }
        }
    })
}

export const findAutomation = async (id: string) => {
    return await client.automation.findUnique({
        where: {
            id,
        },
        include: {
            keywords: true,
            trigger: true,
            posts: true,
            listner: true,
            User: {
                select: {
                    subscription: true,
                    integrations: true,
                }
            }
        }
    })
}

export const updateAutomation = async (
    id: string,
    update: {
        name?: string
        active?: boolean
    }
)=>{
    return client.automation.update({
        where: { id },
        data:{
            name: update.name,
            active: update.active
        }
    })
}