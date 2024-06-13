import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../configs/config'
import jwt from 'jsonwebtoken'

function authenticate(req: Request, res: Response, next: NextFunction) {
/* 
  #swagger.security = [{
            "bearerAuth": []
    }] 
  */
    const headers = req.headers.authorization

    if (!headers || !headers.startsWith('Bearer')) {
        return res.sendStatus(401)
    }

    const token = headers && headers.split(' ')[1]

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(401)
        }

        res.locals.user = user
        next()
    })
}

export default authenticate
