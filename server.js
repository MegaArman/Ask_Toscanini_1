const http = require("http");
const fs = require("fs");
const searchFacts = require("./toscanini_backend_engine/searchFacts.js");
const parseQueryString = 
  require("./toscanini_backend_engine/parseQueryString.js");
const port = 7999;
const pdfDir = "/pdf_scores/";
const musicxmlDir = "/musicxml_scores/";

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
      fs.createReadStream("./frontend/index.html").pipe(response);
    }
    else if (request.url === "/info")
    {
      response.writeHead(200, {"Content-Type": "text/html"});
      fs.createReadStream("./frontend/info.html").pipe(response);
    }
    else if (request.url ==="/materialize.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./frontend/materialize.css").pipe(response);
    }
    else if (request.url ==="/styles.css")
    {
      response.writeHead(200, {"Content-Type": "text/css"});
      fs.createReadStream("./frontend/styles.css").pipe(response);
    }
    else if (request.url === "/main.js")
    {
      response.writeHead(200, {"Content-Type": "text/javascript"});
      fs.createReadStream("./frontend/main.js").pipe(response);
    }
    else if (request.url.includes(musicxmlDir)
             && request.url.includes(".xml"))
    {
      const scoreName = request.url.replace(musicxmlDir, "");
      const relPath = "." + musicxmlDir + scoreName;
      const readStream = fs.createReadStream(relPath);
      
      readStream.on("open", ()=>
      {
        response.writeHead(200, {"Content-Type": "text/xml"});
        readStream.pipe(response);
      });

      readStream.on("error", () =>
      {
        send404Response(response);
        console.log("xml not found " + relPath);
      }); 
    }
     else if (request.url.includes(pdfDir)
           && request.url.includes(".pdf"))
    {
      const scoreName = request.url.replace(pdfDir, "");
      const relPath = "." + pdfDir + scoreName;
      const readStream = fs.createReadStream(relPath);
      
      readStream.on("open", ()=>
      {
        response.writeHead(200, {"Content-Type": "application/pdf"});
        readStream.pipe(response);
      });

      readStream.on("error", () =>
      {
        send404Response(response);
        console.log("pdf not found " + relPath);
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
      const queryObject = parseQueryString(queryString);
      console.log("queryObject", JSON.stringify(queryObject));

      //error string
      if (typeof queryObject === "string" && queryObject.includes("ERROR"))
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
    console.log("bad request, will send 404");
    send404Response(response);
  }
}

const server = http.createServer(onRequest);

// Listen on port, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + port + "/");
