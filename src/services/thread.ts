import { PrismaClient } from '@prisma/client'
import { ThreadType, ThreadWithDetailType, UserType } from '../types/types'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import ThreadDTO from '../dto/thread-dto'
import CircleError from '../utils/CircleError'
import { threadSchema } from '../validators/validators'

const prisma = new PrismaClient()

class ThreadServices {
    async find(loggedUser: UserType): Promise<ServiceResponseDTO<ThreadWithDetailType[]>> {
        try {
            const rawThreads: ThreadWithDetailType[] = await prisma.thread.findMany({
                include: {
                    replies: true,
                    likes: true,
                    user: true,
                },
            })

            const threads: ThreadWithDetailType[] = rawThreads.map((thread) => {
                const { replies, likes, user, ...rest } = thread
                
                delete user.createdAt
                delete user.updatedAt
                delete user.password
                delete rest.updatedAt


                return {
                    ...rest,
                    user,
                    totalReplies: replies.length,
                    totalLikes: likes.length,
                    isLiked: thread.likes.some((like) => like.userId === loggedUser.id),

                }
            })

            return new ServiceResponseDTO<ThreadWithDetailType[]>({
                error: false,
                payload: threads.sort((x, y) => {
                    const xStart = x.createdAt.getTime()
                    const yEnd = y.createdAt.getTime()

                    return yEnd - xStart
                }),
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async findOne(id: number, loggedUser: UserType): Promise<ServiceResponseDTO<ThreadWithDetailType>> {
        try {
            const rawThreads: ThreadWithDetailType = await prisma.thread.findUnique({
                where: {
                    id: id,
                },
                include: {
                    replies: true,
                    likes: true,
                    user: true,
                },
            })

            if (!rawThreads) {
                throw new CircleError({ error: 'Requested thread does not exist.' })
            }

            const threads =  {...rawThreads,
                likes: rawThreads.likes.map((like) => {
                    delete like.createdAt
                    delete like.updatedAt
                    return like
                }),
                totalReplies: rawThreads.replies.length,
                totalLikes: rawThreads.likes.length,
                isLiked: rawThreads.likes.some((like) => like.userId === loggedUser.id),
                replies: rawThreads.replies.sort((x, y) => {
                    const xStart = x.createdAt.getTime()
                    const yEnd = y.createdAt.getTime()

                    return yEnd - xStart
                }),
            }

            return new ServiceResponseDTO<ThreadWithDetailType>({
                error: false,
                payload: threads,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async findUserThreads(id: number): Promise<ServiceResponseDTO<ThreadWithDetailType[]>> {
        try {
            const rawThreads: ThreadWithDetailType[] = await prisma.thread.findMany({
                where: {
                    userId: id,
                },
                include: {
                    replies: true,
                    likes: true,
                },
            })

            if (!rawThreads.length) {
                throw new CircleError({ error: 'Requested user does not have any threads.' })
            }
            const threads = rawThreads.map((thread) => {
                const { replies, likes, ...rest } = thread

                return {
                    ...rest,
                    totalReplies: replies.length,
                    totalLikes: likes.length,
                }
            })

            return new ServiceResponseDTO<ThreadWithDetailType[]>({
                error: false,
                payload: threads,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async create(threadDTO: ThreadDTO): Promise<ServiceResponseDTO<ThreadType>> {
        try {
            const { error } = threadSchema.validate(threadDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const postedThread = await prisma.thread.create({
                data: threadDTO,
            })

            return new ServiceResponseDTO<ThreadType>({
                error: false,
                payload: postedThread,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async delete(id: number): Promise<ServiceResponseDTO<ThreadType>> {
        try {
            const deletedThreads = await prisma.thread.delete({
                where: {
                    id: id,
                },
            })

            return new ServiceResponseDTO({
                error: false,
                payload: deletedThreads,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }
}

export default new ThreadServices()
