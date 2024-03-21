const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");

/*
  Get the HTML for the vocabulary.com list and return it as a string.
*/
const getHTML = async (vocabUrl) => {
  try {
    const res = await fetch(vocabUrl);

    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

    return await res.text();
  } catch (error) {
    throw error;
  }
};

/*
  Parse the provided HTML, then store all the vocabulary words in a text file
  called words.txt. This file is stored in the directory the script is executed in.
*/
const parseHTML = (html) => {
  // Parse html
  const root = parse(html);
  // Select all words
  const words = root.querySelectorAll(".word");
  // Create a write stream
  let logger = fs.createWriteStream(path.join(__dirname, "words.txt"), {
    flags: "w",
  });
  // Write each word to the text file
  words.forEach((word, i) => {
    // Write word
    logger.write(`${word.text}\n`);
  });
  // Close the write stream
  logger.end();
};

// Main
const main = async (args) => {
  try {
    // Get HTML
    console.log("Getting html from vocabulary.com...");
    const html = await getHTML(args[2]);

    // Parse HTMl and store it in a text file
    console.log("Parsing html for words...");
    parseHTML(html);

    // Log success message
    console.log("Successfully stored vocab words in words.txt");
  } catch (error) {
    // Log error message
    console.error(
      `Failed to scrape words from vocabulary.com\n${error.message}`
    );
  }
};

// Execute main
main(process.argv);
