window.canvas = document.getElementById("canvas");
window.ctx = canvas.getContext("2d");

const remoteCursors = {};
let isDrawing = false;
let prevPos = { x: 0, y: 0 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function getCanvasCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

window.drawLine = function (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
};

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  prevPos = getCanvasCoordinates(e);
  socket.emit("stroke_start");
});

canvas.addEventListener("mousemove", (e) => {
  const currPos = getCanvasCoordinates(e);

  socket.emit("cursor_move", currPos);

  if (!isDrawing) return;

  drawLine(prevPos.x, prevPos.y, currPos.x, currPos.y);

  socket.emit("draw", {
    x1: prevPos.x,
    y1: prevPos.y,
    x2: currPos.x,
    y2: currPos.y
  });

  prevPos = currPos;
});

canvas.addEventListener("mouseup", () => {
  if (isDrawing) socket.emit("stroke_end");
  isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
  if (isDrawing) socket.emit("stroke_end");
  isDrawing = false;
});

document.getElementById("undoBtn").addEventListener("click", () => {
  socket.emit("undo");
});
