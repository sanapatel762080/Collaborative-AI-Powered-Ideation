
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/error.js';

// Routes
import ideaRouter from './src/routes/ideas.routes.js';
import chatRouter from './src/routes/chat.routes.js';
import notesRoutes from './src/routes/notes.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import authRouter from './src/routes/auth.routes.js';
import projectsRouter from './src/routes/projects.routes.js';
import tasksRouter from './src/routes/tasks.routes.js';
import whiteboardRouter from './src/routes/whiteboard.routes.js';

// Models
import Message from './src/models/Message.js';

dotenv.config();

// Init app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// API Routes
app.use('/api/ideas', ideaRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/whiteboard', whiteboardRouter);

// Error handling middleware
app.use(errorHandler);

// Create HTTP + Socket.IO server
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] },
});

// Socket.IO handlers
io.on('connection', (socket) => {
  let currentProjectId = null;
  let currentUser = null;

  console.log('New client connected:', socket.id);

  // Join project chat
  socket.on('join', async ({ projectId, user }) => {
    if (!projectId || !user) return;

    currentProjectId = projectId;
    currentUser = user;
    socket.join(projectId);

    // System message
    socket.emit('system', `Welcome ${user} to project chat`);
    socket.to(projectId).emit('system', `${user} joined the chat`);

    // Send previous messages
    try {
      const previousMessages = await Message.find({ projectId })
        .sort({ createdAt: 1 })
        .lean();
      const realMessages = previousMessages.filter(msg => msg.text && msg.sender);
      socket.emit('previousMessages', realMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }

    // Online users
    const clients = await io.in(projectId).fetchSockets();
    const onlineUsers = clients.map((s) => s.handshake.query.user || s.id);
    io.to(projectId).emit('onlineUsers', onlineUsers);
  });

  // Send chat message
  socket.on('sendMessage', async ({ projectId, sender, text }) => {
    if (!projectId || !sender || !text) {
      socket.emit('system', 'Error: Missing fields.');
      return;
    }

    try {
      const msg = await Message.create({
        projectId,
        sender,
        text,
        reactions: [],
        seenBy: [sender],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      io.to(projectId).emit('newMessage', msg);
    } catch (err) {
      console.error('Send message error:', err);
      socket.emit('system', 'Error: Message could not be sent.');
    }
  });

  // Typing indicator
  socket.on('typing', ({ projectId, user }) => {
    socket.to(projectId).emit('typing', user);
  });

  // Add reaction to message
  socket.on('addReaction', async ({ messageId, emoji, user }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      // Avoid duplicate reactions by same user & emoji
      if (!msg.reactions.some(r => r.user === user && r.emoji === emoji)) {
        msg.reactions.push({ user, emoji });
        await msg.save();
        io.to(msg.projectId).emit('reactionUpdated', msg);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Mark message as seen
  socket.on('markSeen', async ({ messageId, user }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      if (!msg.seenBy.includes(user)) {
        msg.seenBy.push(user);
        await msg.save();
        io.to(msg.projectId).emit('seenUpdated', msg);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Whiteboard rooms
  socket.on('joinWhiteboard', ({ projectId }) => {
    socket.join(`whiteboard-${projectId}`);
  });

  socket.on('updateWhiteboard', ({ projectId, elements }) => {
    io.to(`whiteboard-${projectId}`).emit('whiteboardUpdate', elements);
  });

  socket.on('cursorMove', ({ projectId, pos }) => {
    socket.to(`whiteboard-${projectId}`).emit('cursorUpdate', {
      [socket.id]: pos,
    });
  });

  // Disconnect
  socket.on('disconnect', async () => {
    if (currentProjectId && currentUser) {
      socket.to(currentProjectId).emit('system', `${currentUser} left the chat`);

      // Update online users
      const clients = await io.in(currentProjectId).fetchSockets();
      const onlineUsers = clients.map((s) => s.handshake.query.user || s.id);
      io.to(currentProjectId).emit('onlineUsers', onlineUsers);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`✅ API + Socket.IO running on: ${PORT}`));
})();


