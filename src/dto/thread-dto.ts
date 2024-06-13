class ThreadDTO {
    content: string
    image: string | null
    userId: number

    constructor({ content, image = null, userId }) {
        this.content = content
        this.image = image
        this.userId = userId
    }
}

export default ThreadDTO
