import { PrismaClient } from '@prisma/client'
import { UserType } from '../types/types'
import { JWT_SECRET } from '../configs/config'
import jwt from 'jsonwebtoken'
import RegisterDTO from '../dto/register-dto'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import Hasher from '../utils/Hasher'
import LoginDTO from '../dto/login-dto'
import CircleError from '../utils/CircleError'
import ForgotPasswordDTO from '../dto/forgotpassword-dto'
import ResetPasswordDTO from '../dto/resetpassword-dto'
import {forgotPasswordSchema,loginSchema,registerSchema,resetPasswordSchema} from '../validators/validators'
import { FRONTEND_URL } from '../configs/config'
import { transporter } from '../libs/nodemailer'

const prisma = new PrismaClient()

class AuthServices {
    async register(registerDTO: RegisterDTO): Promise<ServiceResponseDTO<UserType>> {
        try {
            const { error } = registerSchema.validate(registerDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const user = await prisma.user.create({
                data: {
                    ...registerDTO,
                    password: await Hasher.hashPassword(registerDTO.password),
                },
            })
            
            delete user.password
            return new ServiceResponseDTO<UserType>({
                error: false,
                payload: user,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async login(loginDTO: LoginDTO): Promise<ServiceResponseDTO<string>> {
        try {
            const { error } = loginSchema.validate(loginDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const requestedUser = await prisma.user.findUnique({
                where: {
                    username: loginDTO.username,
                },
            })

            const isPasswordValid = await Hasher.comparePassword(
                loginDTO.password,
                requestedUser.password
            )

            if (!isPasswordValid) {
                throw new CircleError({ error: 'The username/password was incorrect.' })
            }

            delete requestedUser.password
            const token = jwt.sign(requestedUser, JWT_SECRET)

            return new ServiceResponseDTO<string>({
                error: false,
                payload: token,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async forgotPassword(
        forgotPasswordDTO: ForgotPasswordDTO
    ): Promise<ServiceResponseDTO<string>> {
        try {
            const { error } = forgotPasswordSchema.validate(forgotPasswordDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const requestedUser = await prisma.user.findUnique({
                where: {
                    email: forgotPasswordDTO.email,
                },
            })

            if (!requestedUser) {
                throw new CircleError({ error: 'Requested user does not exist.' })
            }

            delete requestedUser.password
            const token = jwt.sign(requestedUser, JWT_SECRET)

            await transporter.sendMail({
                from: "Circle <ramakusuma098@gmail.com>", 
                to: requestedUser.email,
                subject: "Verification Link", 
                html: `<a href="${FRONTEND_URL}/api/v1/auth/verify-email?token=${token}">Klik untuk verifikasi email kamu!</a>`, // html body
              });

            return new ServiceResponseDTO<string>({
                error: false,
                payload: token,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<ServiceResponseDTO<string>> {
        try {
            const { error } = resetPasswordSchema.validate(resetPasswordDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const updatedUser = await prisma.user.update({
                where: {
                    email: resetPasswordDTO.email,
                },
                data: {
                    password: await Hasher.hashPassword(resetPasswordDTO.password),
                },
            })

            if (!updatedUser) {
                throw new CircleError({ error: 'Requested user does not exist.' })
            }
            delete updatedUser.password
            const token = jwt.sign(updatedUser, JWT_SECRET)

            return new ServiceResponseDTO<string>({
                error: false,
                payload: token,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }
}

export default new AuthServices()
