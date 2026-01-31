// Get canvas and context (make global)
window.canvas = document.getElementById("canvas");
window.ctx = canvas.getContext("2d");

// Resize canvas properly
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

// Drawing state
let isDrawing = false;
let prevPos = { x: 0, y: 0 };

// Convert mouse position to canvas coordinates
function getCanvasCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

// ✅ CORRECT drawLine definition
window.drawLine = function (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
};

// Mouse down → start new stroke
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  prevPos = getCanvasCoordinates(e);

  // Start stroke on server
  socket.emit("stroke_start");
});

// Mouse move → draw + emit
canvas.addEventListener("mousemove", (e) => {
  const currPos = getCanvasCoordinates(e);

  // Emit cursor movement (ghost cursor)
  socket.emit("cursor_move", {
    x: currPos.x,
    y: currPos.y
  });

  if (!isDrawing) return;

  // Draw locally
  drawLine(prevPos.x, prevPos.y, currPos.x, currPos.y);

  // Send draw segment to server
  socket.emit("draw", {
    x1: prevPos.x,
    y1: prevPos.y,
    x2: currPos.x,
    y2: currPos.y
  });

  prevPos = currPos;
});

// Mouse up → end stroke
canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    socket.emit("stroke_end");
  }
  isDrawing = false;
});

// Mouse leaves canvas → end stroke
canvas.addEventListener("mouseleave", () => {
  if (isDrawing) {
    socket.emit("stroke_end");
  }
  isDrawing = false;
});

// Resize canvas on window resize
window.addEventListener("resize", () => {
  resizeCanvas();
});
