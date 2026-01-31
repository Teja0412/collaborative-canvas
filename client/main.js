console.log("Canvas loaded");
document.getElementById("undoBtn").addEventListener("click", () => {
  socket.emit("undo");
});
