# codev - Collaborative Code Editor

codev is a rich code editor designed for developers to collaborate seamlessly on projects, create different files and codes, and invite other developers to join their projects. With real-time updates, users can see who has joined or left the project, as well as who is currently editing the code.

## Demo

1. Create a Project



https://github.com/Saumya40-codes/CoDev/assets/115284013/4fd9487c-2fe7-46a7-8dc3-42957d2abeab



2. Create as many as files



https://github.com/Saumya40-codes/CoDev/assets/115284013/76cb64b4-14f3-41e7-bbf6-8d2e25e0b2be




3. Collab with other devs


https://github.com/Saumya40-codes/CoDev/assets/115284013/2b9713e2-3914-41bf-b4bf-adb655060ec5




4. Work by Collab



https://github.com/Saumya40-codes/CoDev/assets/115284013/43cfbfca-b935-4e4f-ba64-1e17059c742c


**deployed api on render just doesnt seem to be working for web sockets :(**

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
git clone https://github.com/Saumya40-codes/CoDev.git -b localhost-setup
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

### In progress
Code **compiling** will soon be available!
