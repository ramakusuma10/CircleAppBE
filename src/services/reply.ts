import { PrismaClient } from '@prisma/client'
import { ReplyType } from '../types/types'
import ReplyDTO from '../dto/reply-dto'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import { replySchema } from '../validators/validators'
import CircleError from '../utils/CircleError'

const prisma = new PrismaClient()

class ReplyServices {
    async create(replyDTO: ReplyDTO): Promise<ServiceResponseDTO<ReplyType>> {
        console.log(replyDTO)
        try {
            const { error } = replySchema.validate(replyDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const postedReply = await prisma.reply.create({
                data: replyDTO,
            })

            return new ServiceResponseDTO<ReplyType>({
                error: false,
                payload: postedReply,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async delete(id: number): Promise<ServiceResponseDTO<ReplyType>> {
        try {
            const deletedReply = await prisma.reply.delete({
                where: {
                    id: id,
                },
            })

            return new ServiceResponseDTO<ReplyType>({
                error: false,
                payload: deletedReply,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }
}

export default new ReplyServices()
