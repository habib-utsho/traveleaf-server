# TraveLeaf

Welcome to **TraveLeaf**! A travel-related blog site where you can share your travel experiences and destination guides. This application is built using **Express.js**, **MongoDB**, **Mongoose**, and **TypeScript**.

## Getting Started

To get started with the **TraveLeaf** project locally, follow these steps:

### 1. Clone the repository to your local machine:

```bash
git clone https://github.com/Source-Code-007/traveleaf-server

**Navigate into the project directory:** cd traveleaf_server
**Install dependencies:** yarn install

**Set up your environment variables:**
Create a .env file in the root directory and provide the following variables:

# Environment
NODE_ENV=development  # or production

# Server
PORT=5000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Security
SALT_ROUNDS=your_SALT_ROUNDS_for_password_hash
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15d
JWT_REFRESH_EXPIRES_IN=30d

# Client
CLIENT_URL=http://localhost:3000

# Default Admin
ADMIN_DEFAULT_PASSWORD=1234@@aA

# Nodemailer (for emails)
NODE_MAILER_USER=your_email@example.com
NODE_MAILER_PASSWORD=your_email_password

# Cloudinary (for file storage)
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_URL=cloudinary://your_cloudinary_api_key:your_cloudinary_secret@your_cloudinary_cloud_name


## Technology used

- TypeScript
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- Multer
- Node Mailer
- ZOD
- JWT

## Features

- Authentication
- Authorization
- User management
- Profile management (update profile, upload profile picture, follow/unfollow users)
- Subscription and premium content access
- Admin can create, update, and delete posts and categories
- User can create, edit, and delete travel posts
- Post categorization and tagging (e.g., Adventure, Exploration)
- Image uploads for posts
- Upvote and downvote system for posts
- Commenting and replying on posts
- Payment integration for premium features
- News feed with infinite scrolling
- Post filtering, searching, and sorting by category or popularity
- Follower and following system
- Rich text editor for post creation


Running the Server by- **yarn dev**

Local Base URL: **[Link](http://localhost:5500/api/v1)**

Production Base URL: **[Link](https://traveleaf-server.onrender.com/api/v1)**
```
