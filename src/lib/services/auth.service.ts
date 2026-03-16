import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { RegisterInput, LoginInput } from '../schemas/auth.schema'
import { connectDB } from '../db' // Added to ensure connection

const SALT_ROUNDS = 12

export class AuthService {
  async register(data: RegisterInput) {
    await connectDB(); // Ensure DB is connected
    const exists = await User.findOne({ email: data.email })
    
    if (exists) {
      throw new Error('E-mail já cadastrado')
    }
    
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
    
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })
    
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }
  }
  
  async login(data: LoginInput) {
    await connectDB(); // Ensure DB is connected
    const user = await User.findOne({ email: data.email })
    
    if (!user || !user.password) {
      throw new Error('Credenciais inválidas')
    }
    
    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      throw new Error('Credenciais inválidas')
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )
    
    return { 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      } 
    }
  }
}

export const authService = new AuthService()
