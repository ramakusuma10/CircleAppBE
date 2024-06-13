class LikeDTO {
    userId: number
    threadId: number

    constructor({ userId, threadId }) {
        this.userId = userId
        this.threadId = threadId
    }
}

export default LikeDTO
