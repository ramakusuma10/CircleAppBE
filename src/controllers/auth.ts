import { Request, Response } from 'express'
import { UserType } from '../types/types'
import ResponseDTO from '../dto/response-dto'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import AuthServices from '../services/auth'

class AuthControllers {
    async register(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                       $ref: "#/components/schemas/RegisterDTO"
                    }  
                }
            }
        } 
    */
        const avatar = 'https://api.dicebear.com/8.x/icons/svg?seed=Sassy'
        const { username, email, fullname, password, bio } = req.body

        const { error, payload }: ServiceResponseDTO<UserType> = await AuthServices.register({
            username,
            email,
            fullname,
            password,
            avatar,
            bio: bio ? bio : null,
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

        delete payload.password
        return res.status(200).json(
            new ResponseDTO<UserType>({
                error,
                message: {
                    status: 'User created!',
                },
                data: payload,
            })
        )
    }

    async login(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                       $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */
        const { username, password } = req.body

        const { error, payload }: ServiceResponseDTO<string> = await AuthServices.login({
            username,
            password,
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
            new ResponseDTO<string>({
                error,
                message: {
                    status: 'User logged in!',
                },
                data: {
                    token: payload,
                },
            })
        )
    }

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body

        const { error, payload }: ServiceResponseDTO<string> = await AuthServices.forgotPassword({
            email,
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
                    status: 'Ready to reset password!',
                },
                data: {
                    token: payload,
                },
            })
        )
    }

    async resetPassword(req: Request, res: Response) {
        const { email, password } = req.body

        const { error, payload }: ServiceResponseDTO<string> = await AuthServices.resetPassword({
            email,
            password,
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
            new ResponseDTO<string>({
                error,
                message: {
                    status: 'Password changed!',
                },
                data: {
                    token: payload,
                },
            })
        )
    }
}

export default new AuthControllers()
