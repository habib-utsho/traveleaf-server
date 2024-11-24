import mongoose from 'mongoose'
import app from './app'
import { Server } from 'http'

let server: Server

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    customLogger('😀 Database connected successfully')
  } catch (error: any) {
    customLogger(`😡 Failed to connect to the database: ${error.message}`)
    process.exit(1) // Exit the process if the DB connection fails
  }
}

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB()

    // Start the server only after DB connection is successful
    server = app.listen(process.env.PORT, () => {
      customLogger(`🚀 Server running on port ${process.env.PORT}`)
    })
  } catch (error: any) {
    customLogger(`😡 Error starting the server: ${error.message}`)
    process.exit(1)
  }
}

// Handle graceful shutdown
const gracefulShutdown = () => {
  customLogger('🔄 Closing server and disconnecting database...')
  if (server) {
    server.close(() => {
      mongoose.connection
        .close()
        .then(() => {
          customLogger('🛑 Database disconnected and server shut down')
          process.exit(0)
        })
        .catch((error) => {
          customLogger('😡 Error disconnecting the database:', error)
          process.exit(1)
        })
    })
  }
}

// Listen for termination signals
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Handle unhandled exceptions
process.on('unhandledRejection', (reason) => {
  customLogger('😡 Unhandled Rejection:', reason)
  gracefulShutdown()
})

process.on('uncaughtException', (error) => {
  customLogger('😡 Uncaught Exception:', error)
  gracefulShutdown()
})

// Custom logger function
const customLogger = (message: string, ...optionalParams: any[]) => {
  console.log(message, ...optionalParams)
}

// Start the server
startServer()
