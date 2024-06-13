class FollowDTO {
    followedId: number
    followerId: number

    constructor({ followedId, followerId }) {
        this.followedId = followedId
        this.followerId = followerId
    }
}

export default FollowDTO
