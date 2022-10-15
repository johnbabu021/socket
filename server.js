import expressWs from "express-ws";
import express from "express";
const app = express();
expressWs(app);
const existingUser = [
  {
    id: "12",
    name: "John",
    Recivedmessages: [{ id: 13, message: "hello there" }],
    sendMessages: [],
  },
  { id: "13", name: "Sinnoor", Recivedmessages: [], sendMessages: [] },
  { id: "16", name: "old com", Recivedmessages: [], sendMessages: [] },
  { id: "17", name: "new com", Recivedmessages: [], sendMessages: [] },
];

app.ws("/echo", (ws, req) => {
  if (req.query.sender && req.query.reciver) {
    const sender = existingUser.find(({ id }) => {
      return id === req.query.sender.toString();
    });
    const reciver = existingUser.find(({ id }) => {
      return id === req.query.reciver.toString();
    });
    console.log(sender);
    sender.Recivedmessages.map((item) => {
      const messageSender = existingUser.find(({ id }) => item.id == id);
      ws.send(
        `you recived a new message from ${messageSender.name} of ${item.message}`
      );
    });

    if (reciver && sender) {
      ws.on("message", (msg) => {
        reciver.Recivedmessages.push({ id: sender.id, message: msg });
        sender.sendMessages.push({ id: reciver.id, mess: msg });
        ws.send(msg);
      });
    } else {
      console.log("invalid user");
    }
  } else {
    console.log("no use found");
  }
});
app.listen(3000);

// item.messages.map(({ id }) => {
//   console.log("he");
//   if (id === req.query.reciver.toString()) {
//     console.log("hello");
//     ws.send("you recived a message");
//   }
// });
