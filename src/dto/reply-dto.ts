class ReplyDTO {
    image: string | null
    content: string
    userId: number
    threadId: number

    constructor({ image = null, content, userId, threadId }) {
        this.image = image
        this.content = content
        this.userId = userId
        this.threadId = threadId
    }
}

export default ReplyDTO
