# Real-Time Collaborative Drawing Canvas – Architecture

## Overview
This project is a real-time collaborative drawing application where multiple users can draw simultaneously on a shared canvas. The system uses a client–server architecture with WebSockets to ensure low-latency, bidirectional communication and consistent shared state across all connected users.

The server acts as the single source of truth for drawing history, enabling correct synchronization and per-user undo functionality.

---

## High-Level Architecture

- **Client (Browser)**
  - Renders the canvas using HTML5 Canvas API
  - Captures user input (mouse events)
  - Sends drawing and cursor events to the server
  - Renders remote users’ drawings and cursors in real time

- **Server (Node.js + Socket.io)**
  - Manages WebSocket connections
  - Maintains global stroke history
  - Handles per-user undo logic
  - Broadcasts updates to all connected clients



## Client-Side Design

### Key Files
- `canvas.js`
  - Handles canvas initialization and resizing
  - Converts mouse coordinates to canvas coordinates
  - Draws line segments locally
  - Emits `stroke_start`, `draw`, and `stroke_end` events
- `websocket.js`
  - Manages all Socket.io event listeners
  - Listens for remote draw events and redraw events
  - Handles ghost cursor updates
- `main.js`
  - Handles UI actions such as Undo button clicks

### Drawing Flow
1. User presses mouse → `stroke_start` is emitted
2. Mouse moves → line segments are drawn locally and emitted as `draw`
3. Mouse released → `stroke_end` is emitted
4. Other clients receive `draw` events and render them instantly

Canvas coordinates are normalized using bounding rectangle scaling to ensure accuracy across different screen sizes.

---

## Server-Side Design

### Global State
The server maintains an array of strokes:
```js
stroke = {
  userId: socket.id,
  active: boolean,
  segments: [{ x1, y1, x2, y2 }]
}
