const parseQueryString = 
  require("./toscanini_backend_engine/parseQueryString.js");
const searchFacts = require("./toscanini_backend_engine/searchFacts.js");
const queryString = "tempo 50 150";
const queryObject = parseQueryString(queryString);
//console.log("queryObject", JSON.stringify(queryObject));

//error string
//if (typeof queryObject === "string" && queryObject.includes("ERROR"))
//{
//}
//else
//{
//  response.end(JSON.stringify(searchFacts(queryObject)));
//}


for (let i = 0; i < 100; i++)
{
  console.time("took");
  const result = JSON.stringify(searchFacts(queryObject));
  //console.log(result);
  console.timeEnd("took");
}
