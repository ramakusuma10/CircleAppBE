import { Request, Response } from 'express'
import { LikeType } from '../types/types'
import LikeServices from '../services/like'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import ResponseDTO from '../dto/response-dto'

class LikeControllers {
    async like(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const { threadId } = req.body

        const { error, payload }: ServiceResponseDTO<LikeType> = await LikeServices.like({
            threadId,
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
            new ResponseDTO<LikeType>({
                error,
                message: {
                    status: 'Ok!',
                },
                data: payload,
            })
        )
    }
}

export default new LikeControllers()
