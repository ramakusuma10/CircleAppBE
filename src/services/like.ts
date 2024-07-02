import { PrismaClient } from '@prisma/client'
import { LikeType } from '../types/types'
import LikeDTO from '../dto/like-dto'
import ServiceResponseDTO from '../dto/serviceResponse-dto'

const prisma = new PrismaClient()

class LikeServices {
    async like(likeDTO: LikeDTO): Promise<ServiceResponseDTO<LikeType>> {
        try {
            
            const isLiked: LikeType = await this.isLiked(likeDTO)

            if (isLiked) {
                
                const removedLike: LikeType = await this.removeLike(isLiked)
                delete removedLike.createdAt
                delete removedLike.updatedAt
                return new ServiceResponseDTO<LikeType>({
                    error: false,
                    payload: removedLike,
                })
            }

            
            const addedLike: LikeType = await this.addLike(likeDTO)
            return new ServiceResponseDTO<LikeType>({
                error: false,
                payload: addedLike,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    private async isLiked(likeDTO: LikeDTO): Promise<LikeType> {
        return await prisma.like.findFirst({
            where: {
                AND: [{ userId: likeDTO.userId }, { threadId: likeDTO.threadId }],
            },
        })
    }

    private async removeLike(likeData: LikeType): Promise<LikeType> {
        return await prisma.like.delete({
            where: {
                id: likeData.id,
            },
        })
    }

    private async addLike(likeDTO: LikeDTO): Promise<LikeType> {
        return await prisma.like.create({
            data: likeDTO,
        })
    }
}

export default new LikeServices()
