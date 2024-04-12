require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
let urls = [];

app.post("/api/shorturl", function (req, res) {
  let originalUrl;
  try {
    originalUrl = new urlParser.URL(req.body.url);
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(originalUrl.hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    } else {
      const shortUrl = urls.push(req.body.url);
      res.json({ original_url: req.body.url, short_url: shortUrl - 1 });
    }
  });
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  const shortUrl = Number(req.params.shorturl);
  if (shortUrl < urls.length) {
    res.redirect(urls[shortUrl]);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
