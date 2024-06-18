export interface UserType {
    id: number
    username: string
    email: string
    fullname: string
    password?: string
    avatar: string
    bio: string
    createdAt: Date
    updatedAt: Date
    isFollowed?: boolean
}

export interface ThreadType {
    id: number
    content: string
    image: string
    createdAt: Date
    updatedAt: Date
    userId: number
}

export interface ReplyType {
    id: number
    image: string
    content: string
    userId: number
    threadId: number
    createdAt: Date
    updatedAt: Date
}

export interface LikeType {
    id: number
    userId: number
    threadId: number
    createdAt: Date
    updatedAt: Date
}

export interface FollowType {
    id: number
    followedId: number
    followerId: number
    createdAt: Date
    updatedAt: Date
}

export interface ServiceResponseType<T> {
    error: boolean
    payload: T | object
}

export interface UserWithFollowersType extends UserType {
    followers?: FollowType[]
    followings?: FollowType[]
    threads?: ThreadWithDetailType[]
}

export interface ThreadWithDetailType extends ThreadType {
    replies?: ReplyType[]
    likes?: LikeType[]
    totalReplies?: number
    totalLikes?: number
    isLiked? : boolean
    user?: UserType

}
