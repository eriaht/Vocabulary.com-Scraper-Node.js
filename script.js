const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");

/*
  Get the HTML for the vocabulary.com list and store it in a file
  called vocab.html. This file is stored in the directory the script
  is executed in.
*/
const getHTML = async (vocabUrl) => {
  try {
    const res = await fetch(vocabUrl);
    const html = await res.text();

    fs.writeFileSync(
      path.join(__dirname, "vocab.html"),
      html,
      "utf-8",
      (error) => {
        if (error) throw error;
        else console.log("Successfully wrote to vocab.html");
      }
    );
  } catch (error) {
    console.error(error);
  }
};

/*
  Parse the provided HTML file, then store all the vocabulary words in a text file
  called words.txt. This file is stored in the directory the script is executed in.
*/
const parseHTML = () => {
  // Read html
  const html = fs.readFileSync("./vocab.html", {
    encoding: "utf-8",
    flags: "r",
  });
  // Parse html
  const root = parse(html);
  // Select all words
  const words = root.querySelectorAll(".word");
  // Create a write stream
  let logger = fs.createWriteStream(path.join(__dirname, "words.txt"), {
    flags: "w",
  });
  // Write each word to the text file
  words.forEach((word) => {
    logger.write(`${word.text}\n`);
  });
  // Close the write stream
  logger.end();
};

const main = async (args) => {
  try {
    // Get HTML
    console.log("Getting html from vocabulary.com...");
    await getHTML(args[2]);

    // Parse HTMl and store it in a text file
    console.log("Parsing html for words...");
    parseHTML();

    // Log success message
    console.log("Successfully stored vocab words in words.txt");
  } catch (error) {
    // Log error message
    console.error(
      `Failed to scrape words from vocabulary.com\n${error.message}`
    );
  }
};

main(process.argv);
