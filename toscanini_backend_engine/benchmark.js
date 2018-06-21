//built from writeFacts
const fs = require("fs");
const computeFacts = require("./computeFacts.js");

const scoreDir = process.argv[2];
const scoreNames = fs.readdirSync(scoreDir);
const factsDB = [];

scoreNames.forEach((scoreName) =>
{
  //console.log(scoreDir + scoreName + "...");
  const musicxml = fs.readFileSync(scoreDir + scoreName);
  console.time("Took");
  const scoreFacts = {};
  scoreFacts[scoreName] = computeFacts(musicxml);
  factsDB.push(scoreFacts);
  //console.log(JSON.stringify(factsDB));
  console.timeEnd("Took");
});

