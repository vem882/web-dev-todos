import { useState } from 'react'
import { UserContext } from './UserContext.jsx'
import axios from 'axios'

export default function UserProvider({children}) {
    const userFromStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: '', password: ''})
    
    const signUp = async () => {
        try {
            const headers = {headers: {'Content-Type': 'application/json'}}
            await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, JSON.stringify({user: user}), headers)
            setUser({email: '', password: ''})
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Registration failed'
            return { success: false, error: message }
        }
    }
    
    const signIn = async () => {
        try {
            const headers = {headers: {'Content-Type': 'application/json'}}
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({user: user}), headers)
            setUser(response.data)
            sessionStorage.setItem('user', JSON.stringify(response.data))
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Login failed'
            return { success: false, error: message }
        }
    }
    
    const logout = () => {
        setUser({email: '', password: ''})
        sessionStorage.removeItem('user')
    }
    
    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, logout}}>
            {children}
        </UserContext.Provider>
    )
}
