import { Request, Response } from 'express'
import { UserType } from '../types/types'
import UserServices from '../services/user'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import ResponseDTO from '../dto/response-dto'

class UserControllers {
    async findOne(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const { id } = req.params
        const { error, payload }: ServiceResponseDTO<UserType> = await UserServices.findOne(
            +id,
            loggedUser
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
            new ResponseDTO<UserType>({
                error,
                message: {
                    status: 'User retrieved!',
                },
                data: payload,
            })
        )
    }

    async findlogged(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const { error, payload }: ServiceResponseDTO<UserType> = await UserServices.findLoggedUser(
            loggedUser
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
            new ResponseDTO<UserType>({
                error,
                message: {
                    status: 'User retrieved!',
                },
                data: payload,
            })
        )
    }

    async find(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const { error, payload }: ServiceResponseDTO<UserType[]> = await UserServices.find(
            loggedUser
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
            new ResponseDTO<UserType[]>({
                error,
                message: {
                    status: 'Users retrieved!',
                },
                data: payload,
            })
        )
    }

    async update(req: Request, res: Response) {
        const loggedUser = res.locals.user
        const avatar = req.file?.path
        const { username, fullname, bio } = req.body

        const { error, payload }: ServiceResponseDTO<UserType> = await UserServices.update({
            id: loggedUser.id,
            username,
            fullname,
            avatar,
            bio,
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
            new ResponseDTO<UserType>({
                error,
                message: {
                    status: 'User edited!',
                },
                data: payload,
            })
        )
    }
}

export default new UserControllers()
