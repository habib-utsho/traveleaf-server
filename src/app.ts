import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import {
  globalErrHandler,
  notFoundErrHandler,
} from './app/middleware/errHandler'
import router from './app/routes'
import cookieParser from 'cookie-parser'
import axios from 'axios'
import cron from 'node-cron'

const app = express()

const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
})
cron.schedule('*/20 * * * *', () => {
  axiosInstance
    .get(`https://traveleaf-server.onrender.com`)
    .then((response) =>
      console.log('😀🎉 Self-ping successful:', response.status),
    )
    .catch((error) => console.error('😡 Self-ping failed:', error.message))
})

app.get('/', async (req, res) => {
  res.send('TraveLeaf home route!')
})

// parser
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      return callback(null, origin)
    },
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())

// Router
app.use('/api/v1', router)
// app.use('/api/v1/students', studentRouter)
// app.use('/api/v1/users', userRoute)

// error handler
app.use(notFoundErrHandler)
app.use(globalErrHandler)

export default app
