import { ClientOptions, WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { Request } from "express";
import { parse } from "url";
import Isonline from "./Isonline";
import JsonWrapper from "./jsonWrapper";
const server = createServer();
const wss = new WebSocketServer({ server, clientTracking: true });
let status: "offline" | "online" = "offline";
let serverClients: { [index: string]: any } = {};
wss.on("listening", function listening() {
  console.log("listening");
});
wss.on("headers", function headers(headers: string[], request: string) {
  console.log(headers);
});
wss.on("connection", function connection(ws: any, request) {
  console.log(request.headers["sec-websocket-key"], "headers");
  ws.id = request.headers["sec-websocket-key"];
  const url = parse(request.url!.toString());
  const { reciver } = Isonline(url);
  console.log(reciver);
  if (reciver.length > 10) {
    status = "online";
    ws.send(JsonWrapper({ ReciverStatus: status }));
  } else {
    status = "offline";
    ws.send(JsonWrapper({ ReciverStatus: status }));
  }
  console.log(ws.id);
  serverClients[ws.id] = ws;

  console.log(wss.address());
  ws.on("open", function open() {
    console.log("open");
  });

  ws.on("error", function dataFetcher() {
    console.log("error occoured");
  });
  ws.on("close", function dataFetcher() {
    status = "offline";
    ws.send(JsonWrapper({ ReciverStatus: status }));
    console.log("closed");
  });

  ws.on("message", function message(data: string) {
    console.log("recived message %s", data, "from", request.url);
    const url = parse(request.url!.toString());
    console.log(url.query);
    const { reciver, sender } = Isonline(url);
    if (reciver.length > 10) {
      status = "online";
    } else {
      status = "offline";
    }
    try {
      if (reciver !== "" && sender !== reciver)
        serverClients[reciver].send(
          JsonWrapper({
            ...JSON.parse(data),
            reciverStatus: status,
          }),
          {
            binary: false,
          }
        );
    } catch (err) {
      console.log("error");
    }
  });
});
server.on("upgrade", function upgrade(request: Request, socket, head) {
  const data = parse(request.url);
  try {
    let queryString: any = data!.query!.split("&");
    const users: any = [];
    queryString.map((item: string) => {
      users.push(item.split("="));
    });
  } catch (err) {
    socket.emit("error", err);
  }
  if (data!.pathname!.startsWith("/path")) {
    socket.destroy();
  }
});

server.listen(3000);
