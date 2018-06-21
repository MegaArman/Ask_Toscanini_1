//built from writeFacts
const fs = require("fs");
const computeFacts = require("./computeFacts.js");

const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const factsDB = [];

scoreNames.forEach((scoreName) =>
{
  //console.log(scoreDir + scoreName + "...");

  console.time("discTime");
  const musicxml = fs.readFileSync(scoreDir + scoreName);
  console.timeEnd("discTime");
  
  console.time("parseAndSearchTime");
  const scoreFacts = {};
  scoreFacts[scoreName] = computeFacts(musicxml);
  factsDB.push(scoreFacts);
  //console.log(JSON.stringify(factsDB));
  console.timeEnd("parseAndSearchTime");
});

module.exports = factsDB;

