class UserDTO {
    id: number
    username: string | null
    fullname: string | null
    avatar: string | null
    bio: string | null

    constructor({ id, username = null, fullname = null, avatar = null, bio = null }) {
        this.id = id
        this.username = username
        this.fullname = fullname
        this.avatar = avatar
        this.bio = bio
    }
}

export default UserDTO
