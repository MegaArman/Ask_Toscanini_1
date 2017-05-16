// Load the http module to create an http server.
const http = require("http");
const fs = require("fs");
const searchFacts = require("./searchFacts");
const createQuery = require("./createQuery");
const port = 7999;

function send404Response(response)
{
  response.writeHead(404,{"Content-Type": "text/plain"});
  response.write("Error 404: Page not found");
  response.end();
}

function onRequest(request, response)
{
  if (request.method === "GET")
  {
    if (request.url === "/")
    {
      response.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("./index.html").pipe(response);
    }
    else if (request.url ==="/materialize.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./materialize.css").pipe(response);
    }
    else if (request.url === "/main.js")
    {
      response.writeHead(200, {"Content-Type": "text/javascript"});
      fs.createReadStream("./main.js").pipe(response);
    }
    else if (request.url.includes("/scores/")
             && request.url.includes(".xml"))
    {
      const score = request.url.replace("/scores/", "");
      const readStream = fs.createReadStream("./scores/" + score);
      
      readStream.on("open", ()=>
      {
        response.writeHead(200, {"Content-Type": "text/xml"});
        readStream.pipe(response);
      });

      readStream.on("error", () =>
      {
        send404Response(response);
      }); 
    }
     else if (request.url.includes("/scores_pdf/")
           && request.url.includes(".pdf"))
    {
      const score = request.url.replace("/scores_pdf/", "");
      const readStream = fs.createReadStream("./scores_pdf/" + score);
      
      readStream.on("open", ()=>
      {
        response.writeHead(200, {"Content-Type": "text/xml"});
        readStream.pipe(response);
      });

      readStream.on("error", () =>
      {
        send404Response(response);
      }); 
    }
    else
    {
      send404Response(response);
    }
  }
  else if (request.method === "POST")
  {
    let requestBody = "";
    request.on("data", (data)=> 
    {
      requestBody += data;

      if (requestBody.length > 1e3) //
      {
        response.writeHead(413, "Request Entity Too Large",
                                {"Content-Type": "text/html"});
        response.end("<html>failed</html>");
      }
    });
    request.on("end", ()=> 
    {
      console.log("requestBody", requestBody);
      response.writeHead(200, {"Content-Type": "text/plain"}); 
      const queryString = requestBody; 
      const queryObject = createQuery(queryString);

      //error string
      if (typeof queryObject === "string")
      {
        response.end(JSON.stringify(queryObject));
      }
      else
      {
        response.end(JSON.stringify(searchFacts(queryObject)));
      }
    });
  }
  else
  {
    send404Response(response);
  }
}

const server = http.createServer(onRequest);

// Listen on port, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");
