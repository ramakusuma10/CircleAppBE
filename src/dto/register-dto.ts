class RegisterDTO {
    username: string
    email: string
    fullname: string
    password: string
    avatar?: string
    bio?: string

    constructor({ username, email, fullname, password, avatar = null, bio = null }) {
        this.username = username
        this.email = email
        this.fullname = fullname
        this.password = password
        this.avatar = avatar
        this.bio = bio
    }
}

export default RegisterDTO
