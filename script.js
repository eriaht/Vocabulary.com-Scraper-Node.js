const fs = require("fs");
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

    fs.writeFile("./vocab.html", html, "utf-8", (error) => {
      if (error) throw error;
      else console.log("Successfully wrote to vocab.html");
    });
  } catch (error) {
    console.error(error);
  }
};

/*
  Parse the provided HTML file, then store all the vocabulary words in a text file
  called words.txt. This file is stored in the directory the script is executed in.
*/
const parseHTML = (htmlFile) => {
  // Read html
  const html = fs.readFileSync(htmlFile, "utf-8");
  // Parse html
  const root = parse(html);
  // Select all words
  const words = root.querySelectorAll(".word");
  // Create a write stream
  let logger = fs.createWriteStream("words.txt", {
    flags: "w",
  });
  // Write each word to the text file
  words.forEach((word) => {
    logger.write(`${word.text}\n`);
  });
  // Close the write stream
  logger.end();
};
