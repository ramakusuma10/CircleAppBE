import { PrismaClient } from '@prisma/client'
import { FollowType } from '../types/types'
import FollowDTO from '../dto/follow-dto'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import CircleError from '../utils/CircleError'

const prisma = new PrismaClient()

class FollowServices {
    async follow(FollowDTO: FollowDTO): Promise<ServiceResponseDTO<FollowType>> {
        try {
            if (this.isUserItSelf(FollowDTO)) {
                throw new CircleError({ error: "Can't follow itself." })
            }

            if (await this.isFollowed(FollowDTO)) {
                throw new CircleError({ error: 'user is already followed.' })
            }

            const createdFollow = await prisma.follow.create({
                data: FollowDTO,
            })

            delete createdFollow.createdAt
            delete createdFollow.updatedAt

            return new ServiceResponseDTO<FollowType>({
                error: false,
                payload: createdFollow,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async unfollow(FollowDTO: FollowDTO): Promise<ServiceResponseDTO<FollowType>> {
        try {
            if (this.isUserItSelf(FollowDTO)) {
                throw new CircleError({ error: "Can't unfollow itself." })
            }

            const isFollowed: FollowType = await this.isFollowed(FollowDTO)

            if (!isFollowed) {
                throw new CircleError({ error: 'Target user is not followed yet.' })
            }

            const createdUnfollow = await prisma.follow.delete({
                where: {
                    id: isFollowed.id,
                },
            })
            
            delete createdUnfollow.createdAt
            delete createdUnfollow.updatedAt

            return new ServiceResponseDTO<FollowType>({
                error: false,
                payload: createdUnfollow,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    private isUserItSelf(FollowDTO: FollowDTO): boolean {
        return FollowDTO.followedId === FollowDTO.followerId
    }

    private async isFollowed(FollowDTO: FollowDTO): Promise<FollowType> {
        return await prisma.follow.findFirst({
            where: {
                AND: [{ followedId: FollowDTO.followedId }, { followerId: FollowDTO.followerId }],
            },
        })
    }
}

export default new FollowServices()
