/* Develper: Oscar Saavedra */

// Bring in express
import express from "express";
// Bring in the cors library
import cors from "cors";
// Create instance of HTTP library
import http from "http";
// Get the Server class from socket.io
import { Server } from "socket.io";

// Use gameServer as an instance of express
const app = express();

// Set the PORT to listen on
const PORT = process.env.PORT || 4000;

const corsOptions = { origin: "*", credentials: true };

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.write(PORT);
  res.end();
});

// Create http server with express
const server = http.createServer(app);
// Create variable to use socket.io functions
const io = new Server(server, { cors: corsOptions });

// List of users
let users = [];

// Listen for any sockets trying to connect to server
io.on("connection", (socket) => {
  console.log(socket.id, "user just connected!");

  // Listens and logs messages to console
  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  // Listen for new users joining server
  socket.on("newUser", (data) => {
    // Add new user to list
    users.push(data);
    console.log(users);
    // Send list of users to client
    io.emit("newUserResponse", users);
  });

  // Listen for any sockets that disconnect from server
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Update list when user leaves server
    users = users.filter((user) => user.socketID !== socket.id);
    console.log(users);
    // Send list of users to client
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});

// Start the server
server.listen(PORT, () => {
  console.log("SERVER LISTENING ON ", PORT);
});
