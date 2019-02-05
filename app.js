console.log("Running Conversion");

const args = require("yargs").argv;
const fs = require("fs");
const jwt = require("jsonwebtoken");
const secret = args["secret"];
const host = args["host"];

const mapToUrl = ({ key = key, bucket, externalId = "" }) => {
  if (!bucket) {
    throw new Error('"bucket" is a required property');
  }

  if (!secret) {
    throw new Error(
      "You must specify a secret via the command line with --secret=<secret>"
    );
  }

  if (!host) {
    throw new Error(
      "You must specify a host via the command line with --host=<host>"
    );
  }

  const encoded = jwt.sign({ key, bucket }, args["secret"]);

  return { externalId, imageUrl: `${host}?token=${encoded}` };
};

const parseDataAndWriteToDest = (err, data, callback) => {
  if (err) {
    throw err;
  }

  const json = JSON.parse(data);
  const mappedJson = json.map(mapToUrl);

  fs.writeFile("cleaned-data.json", JSON.stringify(mappedJson), err => {
    if (err) {
      throw err;
    }

    console.log("The data has been saved");
  });
};

fs.readFile("example.json", parseDataAndWriteToDest);
