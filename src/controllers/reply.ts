import { Request, Response } from 'express'
import { ReplyType } from '../types/types'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import ReplyServices from '../services/reply'
import ResponseDTO from '../dto/response-dto'

class ReplyControllers {
    async create(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const image = req.file?.path
        const { content, threadId } = req.body
        const { error, payload }: ServiceResponseDTO<ReplyType> = await ReplyServices.create({
            image,
            content,
            threadId: +threadId,
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
            new ResponseDTO<ReplyType>({
                error,
                message: {
                    status: 'Reply posted!',
                },
                data: payload,
            })
        )
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params
        const { error, payload }: ServiceResponseDTO<ReplyType> = await ReplyServices.delete(
            +id
        )

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
            new ResponseDTO<ReplyType>({
                error,
                message: {
                    status: 'Reply deleted!',
                },
                data: payload,
            })
        )
    }
}

export default new ReplyControllers()
