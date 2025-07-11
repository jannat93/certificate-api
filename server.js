const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("uploads"));  // Serve uploaded images

// Set Storage Engine for Multer
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Upload Route
app.post("/upload", upload.single("certificate"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// API to List Certificates (Optional)
app.get("/certificates", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read folder" });
    res.json(files);
  });
});


const publicationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'publications'); // Folder for publications
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadPublication = multer({ storage: publicationStorage });


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
