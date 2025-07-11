const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("uploads"));  // Serve uploaded certificates
app.use('/publications', express.static('publications'));  // Serve uploaded publications

// Certificate Storage
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Certificate Upload Route
app.post("/upload", upload.single("certificate"), (req, res) => {
  res.json({ filename: req.file.filename });
});

// List Certificates
app.get("/certificates", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read folder" });
    res.json(files);
  });
});

// Publication Storage
const publicationStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'publications');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadPublication = multer({ storage: publicationStorage });

// Publication Upload Route
app.post('/upload-publication', uploadPublication.single('file'), (req, res) => {
  res.send('Publication uploaded successfully!');
});

// List Publications
app.get('/publications', (req, res) => {
  fs.readdir('publications', (err, files) => {
    if (err) return res.status(500).send([]);
    res.send(files);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
