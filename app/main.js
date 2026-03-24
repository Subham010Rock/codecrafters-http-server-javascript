const net = require("net");
const process = require('process');
const path = require("path");
const fs = require("fs");

// get the absolute path when program runs with --directory flag
let absolutePath = "";
for(let i = 0;i < process.argv.length;i++){
  if(process.argv[i] == "--directory"){
    absolutePath = process.argv[i+1];
    break;
  }
}

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
    const httpMethod = requestLine[0];
    if(requestTarget=="/"){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(requestTarget.startsWith("/echo")){
      const str = requestTarget.split("/")[2];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str.length}\r\n\r\n${str}`);
    }
    else if(requestTarget=="/user-agent"){
      let userAgentValue = "";
      for(const header of httpRequest){
        if(header.toLowerCase().startsWith("user-agent:")){
          userAgentValue = header.split(":")[1].trim();
          break;
        }
      }
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgentValue.length}\r\n\r\n${userAgentValue}`);
    }
    else if(requestTarget.startsWith("/files")){
      //absolutePath variable can be helpful here
      const fileName = requestTarget.split("/")[2];
      const fullPath = path.join(absolutePath,fileName);
      if(fs.existsSync(fullPath)){
        if(httpMethod==="GET"){
          const fileContent = fs.readFileSync(fullPath,'utf-8');
          socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`);
        }else{
          // get request body data
          const data = httpRequest[httpRequest.length-1];
          fs.writeFileSync(fullPath,data,'utf-8');
          socket.write("HTTP/1.1 201 Created\r\n\r\n");
        }
      }else{
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    }
    else{
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
});
//
server.listen(4221, "localhost");