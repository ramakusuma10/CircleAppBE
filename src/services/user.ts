import { PrismaClient } from '@prisma/client'
import { UserType, UserWithFollowersType } from '../types/types'
import ServiceResponseDTO from '../dto/serviceResponse-dto'
import UserDTO from '../dto/user-dto'
import { userSchema } from '../validators/validators'
import CircleError from '../utils/CircleError'
import SearchDTO from '../dto/search-dto'

const prisma = new PrismaClient()

class UserServices {
    async findOne(id: number, loggedUser: UserType): Promise<ServiceResponseDTO<UserType>> {
        try {
            const user: UserWithFollowersType = await prisma.user.findUnique({
                where: {
                    id: id,
                },
                include: {
                    followers: true,
                },
            })

            user.isFollowed = user.followers.some((follower) => follower.id === loggedUser.id)
            delete user.password
            delete user.followers

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

    async findLoggedUser(loggedUser: UserType): Promise<ServiceResponseDTO<UserType>> {
        try {
            const defaultUser: UserWithFollowersType = await prisma.user.findUnique({
                where: {
                    id: loggedUser.id,
                },
                include: {
                    followers: true,
                    followeds: true,
                    threads: {
                        include: {
                            replies: true,
                            likes: true,
                        },
                    },
                },
            })

            const user = {
                ...defaultUser,
                totalFollower: defaultUser.followers.length,
                totalFollowing: defaultUser.followers.length,
                threads: defaultUser.threads.map((thread) => {
                    const replies = thread.replies
                    const likes = thread.likes

                    delete thread.createdAt
                    delete thread.replies
                    delete thread.likes

                    delete loggedUser.createdAt
                    delete loggedUser.updatedAt

                    return {
                        ...thread,
                        user: loggedUser,
                        totalReplies: replies.length,
                        totalLikes: likes.length,
                        isLiked: likes.some((like) => like.userId === loggedUser.id),
                    }
                }),
            }
            delete user.password
            delete user.createdAt
            delete user.updatedAt
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

    async find(loggedUser: UserType): Promise<ServiceResponseDTO<UserType[]>> {
        try {
            const rawUsers: UserWithFollowersType[] = await prisma.user.findMany({
                include: {
                    followers: true,
                },
            })

            const users: UserType[] = rawUsers
                .filter((user) => user.id !== loggedUser.id)
                .map((user) => {
                    const followers = user.followers
                    delete user.followers
                    delete user.password

                    if (followers.length) {
                        return {
                            ...user,
                            isFollowed: followers.some(
                                (follower) => follower.followerId === loggedUser.id
                            ),
                        }
                    }

                    return {
                        ...user,
                        isFollowed: false,
                    }
                })

            return new ServiceResponseDTO<UserType[]>({
                error: false,
                payload: users,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async update(userDTO: UserDTO): Promise<ServiceResponseDTO<UserType>> {
        try {
            const { error } = userSchema.validate(userDTO)

            if (error) {
                throw new CircleError({ error: error.details[0].message })
            }

            const requestedUser = await prisma.user.findUnique({
                where: {
                    id: userDTO.id,
                },
            })

            const editedUser = await prisma.user.update({
                where: {
                    id: userDTO.id,
                },
                data: this.DTOEditor(userDTO, requestedUser),
            })

            delete editedUser.password
            return new ServiceResponseDTO<UserType>({
                error: false,
                payload: editedUser,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    async searchUser(searchDTO: SearchDTO, loggedUser: UserType) {
        try {
            if (!searchDTO.keyword) {
                return new ServiceResponseDTO<UserWithFollowersType[]>({
                    error: false,
                    payload: [],
                })
            }

            const rawResult: UserWithFollowersType[] = await prisma.user.findMany({
                where: {
                    username: {
                        contains: searchDTO.keyword,
                        mode: 'insensitive',
                    },
                    id: {
                        not: loggedUser.id,
                    },
                },
                include: {
                    followers: true,
                },
            })

            const result = rawResult.map((result) => {
                delete result.password
                delete result.createdAt
                delete result.updatedAt

                result.isFollowed = result.followers.some(
                    (follower) => follower.followerId === loggedUser.id
                )

                return result
            })

            return new ServiceResponseDTO<UserWithFollowersType[]>({
                error: false,
                payload: result,
            })
        } catch (error) {
            return new ServiceResponseDTO({
                error: true,
                payload: error,
            })
        }
    }

    private DTOEditor(newData: UserDTO, existingData: UserType): UserDTO {
        return new UserDTO({
            id: newData.id,
            username: newData.username || existingData.username,
            fullname: newData.fullname || existingData.fullname,
            avatar: newData.avatar || existingData.avatar,
            bio: newData.bio || existingData.bio,
        })
    }
}

export default new UserServices()
