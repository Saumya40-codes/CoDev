# codev - Collaborative Code Editor

codev is a rich code editor designed for developers to collaborate seamlessly on projects, create different files and codes, and invite other developers to join their projects. With real-time updates, users can see who has joined or left the project, as well as who is currently editing the code.

## Features

- Real-time collaboration: Multiple developers can work on the same project simultaneously, with changes reflected instantly.
- Project management: Create and manage projects with ease, including the ability to create files and folders within projects.
- User invitations: Invite other developers to join your projects and collaborate effortlessly.
- Activity tracking: See real-time updates on who has joined or left the project and who is currently editing.

## Tech Stack

- **Next.js**: Utilized for server-side rendering and building user interfaces with React. TypeScript is integrated for enhanced type safety.
- **Redux Toolkit**: Provides a predictable state container for managing application state efficiently.
- **React-Redux**: Enables seamless integration of Redux with React components for state management.
- **Redis**: Used for caching data related to user activities such as joining and leaving projects.
- **Socket.io**: Facilitates real-time communication between clients and server for collaborative editing.
- **My SQl**: As a primary *relational* database
- **Prisma**: Serves as the ORM (Object-Relational Mapping) tool for MySQL database, simplifying database interactions and migrations.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Saumya40-codes/CoDev.git
```
2. Install Dependencies
```bash
npm install
```
3. Populate .env in main file
You'll be needing **following** values

```
DATABASE_URL =   (for e.g. mysql://root:name@localhost:3306/db_name)
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
NEXTAUTH_URL = http://localhost:3000
NEXTAUTH_SECRET = 
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
HOST_ENV=dev
```

4. Run prisma migrations
```bash
npx prisma generate
```
```bash
npx prisma migrate dev --name init --create-only
```
```bash
npx prisma migrate deploy
```
