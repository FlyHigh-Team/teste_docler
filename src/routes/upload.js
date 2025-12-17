const express = require("express");
const multer = require("multer");
const fs = require("fs");
const unzipper = require("unzipper");
const { createBotContainer } = require("../services/docker");

const router = express.Router();

const upload = multer({ dest: "/tmp" });

router.post("/", upload.single("file"), async (req, res) => {
  const botName = req.body.name;
  const botDir = `/data/bots/${botName}`;

  fs.mkdirSync(botDir, { recursive: true });

  fs.createReadStream(req.file.path)
    .pipe(unzipper.Extract({ path: botDir }))
    .on("close", async () => {
      await createBotContainer(botName);
      res.json({ success: true, bot: botName });
    });
});

module.exports = router;
