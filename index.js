import { WebSocketServer } from "ws";
const server = new WebSocketServer({ port: 3001, clientTracking: true });
server.on("connection", (socket) => {
  // send a message to the client
  console.log("hi only");
  socket.send(
    JSON.stringify({
      type: "hello from server",
      content: [1, "2"],
    })
  );

  // receive a message from the client
  socket.on("message", (data) => {
    const packet = JSON.parse(data);
    console.log(data);
    socket.send(
      JSON.stringify({
        type: "Hello",
      })
    );
    switch (packet.type) {
      case "hello from client":
        // ...
        break;
    }
  });
  socket.on("close", () => {
    socket.send(JSON.stringify({ type: "closed event" }));
    console.log("close event");
  });
});
