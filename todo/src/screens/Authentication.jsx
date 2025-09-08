import { Link,useNavigate, useLocation } from "react-router-dom"
import { useUser } from "../context/useUser"
import { useState, useEffect } from "react"

export const AuthenticationMode = Object.freeze({
    SignIn: 'Login',
    SignUp: 'SignUp'
})

export default function Authentication({authenticationMode}) {
    const { user, setUser,signUp, signIn } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    
    // Tarkista onko success viestin statea, sekä varmistetaan että viesti ei katoa liian nopeasti useEffectin sisällä.
    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage)
            navigate(location.pathname, { replace: true })
            
            const timer = setTimeout(() => {
                setSuccessMessage('')
            }, 5000)
            
            return () => clearTimeout(timer)
        }
    }, [location, navigate])
    
    useEffect(() => {
        setError('')
    }, [authenticationMode])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('') 
        setSuccessMessage('')
        
        const signFunction = authenticationMode === AuthenticationMode.SignUp ?
            signUp : signIn
        
        try {
            const result = await signFunction()
            if (result.success) {
                if (authenticationMode === AuthenticationMode.SignUp) {
                    navigate('/signin', { 
                        state: { 
                            successMessage: 'Account created successfully! Please sign in.' 
                        }
                    })
                } else {
                    navigate('/')
                }
            } else {
                setError(result.error)
            }
        } catch (error) {
            setError('An unexpected error occurred')
        }
    }
    
    return (
        <div className="card">
            <h2 className="card-title">{authenticationMode === AuthenticationMode.SignIn ? 'Sign in' : 'Sign up'}</h2>
            {successMessage && (
                <div 
                    className="success-message" 
                    onClick={() => setSuccessMessage('')}
                    style={{ cursor: 'pointer' }}
                    title="Click to dismiss"
                >
                    {successMessage}
                    <span style={{ float: 'right', fontSize: '1.2em' }}>×</span>
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label className="h1">Email</label>
                <input
                    placeholder='Email'
                    value={user.email}
                    onChange={e => setUser({...user,email: e.target.value})}
                />
                <label className="h1">Password</label>
                <input
                    placeholder='Password'
                    type='password' 
                    value={user.password}
                    onChange={e => setUser({...user,password: e.target.value})}
                />
                <button type='submit'>{authenticationMode === AuthenticationMode.SignIn ? 'Login' : 'Submit'}</button>
                <Link to={authenticationMode === AuthenticationMode.SignIn ? '/signup' : '/signin'}>
                    {authenticationMode === AuthenticationMode.SignIn ? 'No account? Sign up' : 'Already signed up? Sign in'}
                </Link>
            </form>
        </div>
    )
}
