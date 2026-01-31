# Real-Time Collaborative Drawing Canvas

A real-time multi-user drawing application where multiple users can draw simultaneously on a shared canvas. Built using HTML5 Canvas and Socket.io with a server-side global state to support smooth synchronization and per-user undo functionality.

---

## Features

- Real-time collaborative drawing
- Smooth freehand drawing using HTML5 Canvas
- Accurate coordinate scaling across screen sizes
- Ghost cursors to visualize other users’ activity
- Server-side stroke history management
- Per-user Undo without affecting others’ work
- Automatic redraw for new users and undo actions

---

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express
- **Real-Time Communication:** Socket.io
- **Canvas Rendering:** Native HTML5 Canvas API

---

## Project Structure
collaborative-canvas/
├── client/
│ ├── canvas.js
│ ├── ndex.html
│ ├── main.js
│ ├── style.css
│ └── websocket.js
├── server/
│ └── server.js
├── package.json
├── README.md
└── ARCHITECTURE.md 