import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB }from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
// dotenv.config()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// cors setup
app.use(cors({origin: 'http://localhost:5173', credentials: true}))
// middleware
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

// connect DB
await connectDB()

// routes
app.use('/api/auth',authRoutes)
app.use('/api/resumes', resumeRoutes);

app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'),{
        setHeaders: (res, _path) => {
            res.set('Access-Control-Allow-Origin', 'http://localhost:5173')
        }
    })
)

app.get('/', (req, res) => {
    res.send('Hello from backend')
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

