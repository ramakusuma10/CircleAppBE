import { Request, Response } from 'express'
import { ThreadType, ThreadWithDetailType } from '../types/types'
import ThreadServices from '../services/thread'
import ResponseDTO from '../dto/response-dto'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import { redisClient } from '../libs/redis'

class threadControllers {
    async find(req: Request, res: Response) {
        const loggedUser = res.locals.user

        const { error, payload }: ServiceResponseDTO<ThreadWithDetailType[]> =
            await ThreadServices.find(loggedUser)

        if (error) {
            return res.status(500).json(
                new ResponseDTO<null>({
                    error,
                    message: payload,
                    data: null,
                })
            )
        }

        return res.status(200).json(
            new ResponseDTO<ThreadWithDetailType>({
                error,
                message: {
                    status: 'Threads retrieved!',
                },
                data: payload,
            })
        )
    }

    async findOne(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const { id } = req.params

        const { error, payload }: ServiceResponseDTO<ThreadWithDetailType> =
            await ThreadServices.findOne(+id, loggedUser)

        if (error) {
            return res.status(500).json(
                new ResponseDTO<null>({
                    error,
                    message: payload,
                    data: null,
                })
            )
        }

        return res.status(200).json(
            new ResponseDTO<ThreadWithDetailType>({
                error,
                message: {
                    status: 'Thread retrieved!',
                },
                data: payload,
            })
        )
    }

    async findUser(req: Request, res: Response) {
        const { id } = req.params

        const { error, payload }: ServiceResponseDTO<ThreadWithDetailType[]> =
            await ThreadServices.findUserThreads(+id)

        if (error) {
            return res.status(500).json(
                new ResponseDTO<null>({
                    error,
                    message: payload,
                    data: null,
                })
            )
        }

        return res.status(200).json(
            new ResponseDTO<ThreadWithDetailType[]>({
                error,
                message: {
                    status: "User's Threads retrieved!",
                },
                data: payload,
            })
        )
    }

    async create(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                       $ref: "#/components/schemas/CreateThreadDTO"
                    }  
                }
            }
        } 
    */
        const loggedUser = res.locals.user
        const image = req.file?.path || null
        const { content } = req.body
        
        await redisClient.del("THREADS_DATA");

        const { error, payload }: ServiceResponseDTO<ThreadType> = await ThreadServices.create({
            content,
            image,
            userId: loggedUser.id,
        })


        if (error) {
            return res.status(500).json(
                new ResponseDTO<null>({
                    error,
                    message: payload,
                    data: null,
                })
            )
        }

        return res.status(200).json(
            new ResponseDTO<ThreadType>({
                error,
                message: {
                    status: 'Thread posted!',
                },
                data: payload,
            })
        )
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params
        const { error, payload }: ServiceResponseDTO<ThreadType> = await ThreadServices.delete(+id)

        if (error) {
            return res.status(500).json(
                new ResponseDTO<null>({
                    error,
                    message: payload,
                    data: null,
                })
            )
        }

        return res.status(200).json(
            new ResponseDTO<ThreadType>({
                error,
                message: {
                    status: 'Thread deleted!',
                },
                data: payload,
            })
        )
    }
}

export default new threadControllers()
