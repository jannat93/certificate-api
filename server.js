const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON bodies
app.use(express.static("uploads"));  // Serve uploaded certificates files

// --- Multer storage for certificates ---
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Upload certificate file
app.post("/upload", upload.single("certificate"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ filename: req.file.filename });
});

// List certificates files
app.get("/certificates", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read folder" });
    res.json(files);
  });
});

// --- Publications handling with JSON file ---
const publicationsFile = path.join(__dirname, "publications.json");

// Helper to read publications
function readPublications() {
  try {
    return JSON.parse(fs.readFileSync(publicationsFile));
  } catch {
    return [];
  }
}

// Helper to save publications
function savePublications(data) {
  fs.writeFileSync(publicationsFile, JSON.stringify(data, null, 2));
}

// Get all publications
app.get("/publications", (req, res) => {
  const pubs = readPublications();
  res.json(pubs);
});

// Add new publication link (expects JSON body with { title, url })
app.post("/publications", (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Title and URL required" });

  const publications = readPublications();

  publications.push({ id: Date.now(), title, url });
  savePublications(publications);

  res.status(201).json({ message: "Publication added", publication: { title, url } });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
