import { selectUserByEmail, insertUser } from '../models/User.js'
import { ApiError } from '../helper/ApiError.js'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const { sign } = jwt

const postRegistration = async (req, res, next) => {
    const { user } = req.body
    
    try {
        if (!user || !user.email || !user.password) {
            return next(new ApiError('Email and password are required', 400))
        }
        
        // Piilotetaan sql ilmoittamat virheet dublicate key errorit ja annetaan selkeämpi virhe.
        const existingUser = await selectUserByEmail(user.email)
        if (existingUser.rows.length > 0) {
            return next(new ApiError('User with this email already exists', 409))
        }
        
        hash(user.password, 10, async (err, hashedPassword) => {
            if (err) return next(err)
            
            try {
                const result = await insertUser(user.email, hashedPassword)
                res.status(201).json({ id: result.rows[0].id, email: user.email })
            } catch (error) {
                // Tupla varmistetaan että dublicatea ei synny
                if (error.code === '23505') {
                    return next(new ApiError('User with this email already exists', 409))
                }
                return next(error)
            }
        })
    } catch (error) {
        return next(error)
    }
}

const postLogin = async (req, res, next) => {
    const { user } = req.body
    
    try {
        if (!user || !user.email || !user.password) {
            return next(new ApiError('Email and password are required', 400))
        }
        
        const result = await selectUserByEmail(user.email)
        
        if (result.rows.length === 0) {
            return next(new ApiError('Invalid email or password', 401))
        }
        
        const dbUser = result.rows[0]
        compare(user.password, dbUser.password, (err, isMatch) => {
            if (err) return next(err)
            
            if (!isMatch) {
                return next(new ApiError('Invalid password', 401))
            }
            
            const token = sign({ user: dbUser.email }, process.env.JWT_SECRET)
            res.status(200).json({
                id: dbUser.id,
                email: dbUser.email,
                token
            })
        })
    } catch (error) {
        return next(error)
    }
}

export { postRegistration, postLogin }
