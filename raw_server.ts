import net from "net";
var server = net.createServer();
server.on("connection", handleConnection);
server.listen(9000, () => {
  console.log("server listening from %s", server.address());
});
function handleConnection(conn: any) {
  var remoteAddress = conn.remoteAddress + "" + conn.remotePort;
  console.log("new client from %s", remoteAddress);
  conn.on("data", onConnData);
  function onConnData(d: string) {
    console.log("connection from %s %j", remoteAddress, d);
    conn.write(d);
  }
}
