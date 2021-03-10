const express = require('express');
const cors = require('cors');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send('Not found...');
});

app.use(cors());

const io = socket(server, { cors: { origin: '*', } });

io.on('connection', socket => {
  console.log('connection');
  socket.emit('updateData', tasks);

  socket.on('addTask', newTask => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
  });

  socket.on('removeTask', taskId => {
    tasks.splice(taskId, 1);
    socket.broadcast.emit('removeTask', taskId);
  });
});