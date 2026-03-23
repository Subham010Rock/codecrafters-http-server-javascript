const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// TODO: Uncomment the code below to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
  });
  socket.on("data",(req)=>{
    const httpRequest = req.toString().split("\r\n");
    const requestLine = httpRequest[0].split(" ");
    const requestTarget = requestLine[1];
    if(requestTarget=="/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(requestTarget.startsWith("/echo")){
      const str = requestTarget.split("/")[2];
      console.log(str.length);
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`);
    }
    else{
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
});
//
server.listen(4221, "localhost");
