const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

// creating an app with express js
const app = express();

// creating an http server with this line of code
const server = http.createServer(app);

// defining local port number and
// host provided port number when deployed
const port = process.env.PORT;

// creating one socket and making connection
const io = socketIO(server);
// listening to the created server by passing
// port number and a callback function
// cors is used for inter communication between url
app.use(cors());
app.get("/", (req, res) => {
  // this will send code when url is "/"
  res.send("<h1>server is working correctly</h1>");
});
const users = [];
// when connection circuit will on , execute callback
io.on("connection", (socket) => {
  // console.log("a new  socket connection is on");
  //
  socket.on("joined", (joined_user) => {
    users[socket.id] = joined_user.name;
    socket.emit("welcome", {
      user: "Admin",
      input: `welcome to the chat ${joined_user.name}`,
      id: socket.id,
    });
    // console.log(socket.id, joined_user.name);
  });

  //
  socket.on("message", ({ id, input }) => {
    io.emit("sendMessage", { user: users[id], input, id });
  });
  socket.on("disconnect", () => {});
});

server.listen(port, () => {
  console.log("server is working on http://localhost:" + port);
});
