"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        customLogger('😀 Database connected successfully');
    }
    catch (error) {
        customLogger(`😡 Failed to connect to the database: ${error.message}`);
        process.exit(1); // Exit the process if the DB connection fails
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield connectDB();
        // Start the server only after DB connection is successful
        server = app_1.default.listen(process.env.PORT, () => {
            customLogger(`🚀 Server running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        customLogger(`😡 Error starting the server: ${error.message}`);
        process.exit(1);
    }
});
// Handle graceful shutdown
const gracefulShutdown = () => {
    customLogger('🔄 Closing server and disconnecting database...');
    if (server) {
        server.close(() => {
            mongoose_1.default.connection
                .close()
                .then(() => {
                customLogger('🛑 Database disconnected and server shut down');
                process.exit(0);
            })
                .catch((error) => {
                customLogger('😡 Error disconnecting the database:', error);
                process.exit(1);
            });
        });
    }
};
// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
// Handle unhandled exceptions
process.on('unhandledRejection', (reason) => {
    customLogger('😡 Unhandled Rejection:', reason);
    gracefulShutdown();
});
process.on('uncaughtException', (error) => {
    customLogger('😡 Uncaught Exception:', error);
    gracefulShutdown();
});
// Custom logger function
const customLogger = (message, ...optionalParams) => {
    console.log(message, ...optionalParams);
};
// Start the server
startServer();
