import { ClientOptions, WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";
import { Request } from "express";
import { parse } from "url";
const server = createServer();
const wss = new WebSocketServer({ server, clientTracking: true });

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
    console.log("closed");
  });

  ws.on("message", function message(data: string) {
    console.log("recived message %s", data, "from", request.url);
    const url = parse(request.url!.toString());
    let queryString: any = url!.query!.split("&");
    console.log(queryString);
    // const users: any = [];
    // queryString.map((item: string) => {
    //   users.push(item.split("="));
    // });
    let test = queryString[2].replace("reciver=", "");

    try {
      serverClients[test].send(data, { binary: false });
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
