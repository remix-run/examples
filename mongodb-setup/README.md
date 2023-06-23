# MongoDB support

Connection and user login with a MongoDB database.

This project uses the future [route v2 convention](https://remix.run/docs/en/main/pages/v2#file-system-route-convention).

## Installation guide

### Requirements

1. You'll need a MongoDB database. We recommend https://www.mongodb.com/atlas/database

2. Copy the `.env.example` to `.env` and configure the variables:

- `COOKIE_NAME=the_name_for_your_cookie`
- `COOKIE_SECRET=long_string`
- `MONGODB_URL=mongodb+srv://user:password@mongo_db_url`

Replace the `MONGODB_URL` with your real URL for the MongoDB connection.

3. Run: `npm run dev`

4. Go to `http://localhost:3000/api/create-demo-user` 
This will create a demo user with the following credentials:

- username: `youruseremail@demo.com`
- password: `test`

5. Go to `http://localhost:3000/login`

### User collection schema

```
email: string
password: string 
```

The password is hashed with the help of the bcryptjs library