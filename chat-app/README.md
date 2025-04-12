# Basic Chat App

A simple real-time chat application built with React Native and Node.js using Socket.IO.

## Features

- User authentication via username
- Real-time messaging
- Typing indicators
- Simple and clean UI

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO

## Project Structure

```
chat-app/
  ├── client/             # React Native app
  └── server/             # Node.js backend
```

## Setup Instructions

### Server Setup

1. Navigate to the server directory:
   ```
   cd chat-app/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000

### Client Setup

1. Navigate to the client directory:
   ```
   cd chat-app/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Edit the server URL in `app/chat.tsx`:
   - For Android emulator: `http://10.0.2.2:5000`
   - For iOS simulator or web: `http://localhost:5000`
   - For physical device: Use your computer's IP address (`http://192.168.x.x:5000`)

4. Start the Expo app:
   ```
   npm start
   ```

5. Follow the instructions to open the app on your device or emulator.

## Usage

1. Enter a username to join the chat
2. Start sending and receiving messages in real-time
3. You'll see when other users are typing 