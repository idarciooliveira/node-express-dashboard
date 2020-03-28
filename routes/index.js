const express = require("express");
const router = express.Router();
const fileService = require("../services/file-service")
const { settings, writeSettings, getDefaultDir, isValidDir } = require("../services/settings-service.js");
const { check, validationResult } = require("express-validator");
const { body } = require("express-validator");

fileService.setcwd(getDefaultDir());

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Log Dashboard", logFile: req.query.logFile });
});

/* GET select file. */
router.get("/select-file", function(req, res, next) {
  res.render("select-file", { title: "Select Log File" });
});

/* GET settings. */
router.get("/settings", function(req, res, next) {
  res.render("settings", { title: "Settings", settings });
});

router.post("/settings", [
  body("defaultDir").custom(dirPath => {
    if (dirPath && !isValidDir(dirPath)) {
      throw new Error("Default directory is not valid")
    }
    return true
  })
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("settings", { title: "Settings", errors: errors.array()[0], settings });
  }
  settings.user = req.body
  writeSettings()
  res.render("settings", { message: "Settings Saved", title: "Settings", settings });
})

/* GET files. */
router.get("/files", fileService.get)

module.exports = router;
