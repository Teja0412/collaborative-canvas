// Connect to socket server
const socket = io();

// Store other users' cursor positions
const remoteCursors = {};

// 🔹 Receive drawing data from other users
socket.on("draw", (data) => {
  drawLine(
    data.x1,
    data.y1,
    data.x2,
    data.y2
  );
});
socket.on("redraw", (strokes) => {
  console.log("REDRAW RECEIVED", strokes.length);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokes.forEach((stroke) => {
    stroke.segments.forEach((seg) => {
      drawLine(
        seg.x1,
        seg.y1,
        seg.x2,
        seg.y2
      );
    });
  });
});


// 🔹 Receive cursor movement from other users
socket.on("cursor_move", (data) => {
  remoteCursors[data.id] = {
    x: data.x,
    y: data.y
  };
});

// 🔹 Remove cursor when user disconnects
socket.on("user_left", (data) => {
  delete remoteCursors[data.id];
});
