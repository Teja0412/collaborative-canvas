// CONNECT TO BACKEND
const socket = io("https://collaborative-canvas-backend.onrender.com", {
  transports: ["websocket"],
});

// Receive drawing data
socket.on("draw", (data) => {
  drawLine(data.x1, data.y1, data.x2, data.y2);
});

socket.on("redraw", (strokes) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  strokes.forEach((stroke) => {
    stroke.segments.forEach((seg) => {
      drawLine(seg.x1, seg.y1, seg.x2, seg.y2);
    });
  });
});

socket.on("cursor_move", (data) => {
  remoteCursors[data.id] = { x: data.x, y: data.y };
});

socket.on("user_left", (data) => {
  delete remoteCursors[data.id];
});
