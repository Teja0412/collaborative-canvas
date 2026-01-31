const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve client files
app.use(express.static(path.join(__dirname, "../client")));

// --------------------
// GLOBAL STROKE HISTORY
// --------------------
const strokes = [];
// stroke = { userId, active, segments[] }

// --------------------
// SOCKET CONNECTION
// --------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // --------------------
  // STROKE START (IMPORTANT)
  // --------------------
  socket.on("stroke_start", () => {
    strokes.push({
      userId: socket.id,
      active: true,
      segments: []
    });
  });

  // --------------------
  // DRAW EVENT
  // --------------------
  socket.on("draw", (data) => {
    const stroke = strokes.find(
      (s) => s.userId === socket.id && s.active
    );

    if (!stroke) return; // safety check

    stroke.segments.push(data);
    socket.broadcast.emit("draw", data);
  });

  // --------------------
  // STROKE END
  // --------------------
  socket.on("stroke_end", () => {
    const stroke = strokes.find(
      (s) => s.userId === socket.id && s.active
    );

    if (stroke) {
      stroke.active = false;
    }
  });

  // --------------------
  // UNDO (REMOVE LAST STROKE OF USER)
  // --------------------
  socket.on("undo", () => {
    for (let i = strokes.length - 1; i >= 0; i--) {
      if (strokes[i].userId === socket.id) {
        strokes.splice(i, 1);
        break;
      }
    }

    // Send updated history to all clients
    io.emit("redraw", strokes);
  });

  // --------------------
  // GHOST CURSOR
  // --------------------
  socket.on("cursor_move", (data) => {
    socket.broadcast.emit("cursor_move", {
      id: socket.id,
      x: data.x,
      y: data.y
    });
  });

  // --------------------
  // DISCONNECT
  // --------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Close any active stroke
    strokes.forEach((s) => {
      if (s.userId === socket.id) {
        s.active = false;
      }
    });

    socket.broadcast.emit("user_left", {
      id: socket.id
    });
  });
});

// --------------------
// START SERVER
// --------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
