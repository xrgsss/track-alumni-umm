const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "data", "alumni.json");

// Middleware to parse JSON bodies and serve static files
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

// --- Simple Security Config ---
const ADMIN_CRED = { user: "admin", pass: "admin123" };
const VIEWER_CRED = { user: "user", pass: "user123" };
const SESSION_TOKENS = new Set();

// Authentication Middleware
function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (SESSION_TOKENS.has(token)) {
    // Basic check for admin role for destructive actions
    if (req.method !== "GET" && token !== "token_admin") {
       return res.status(403).json({ message: "Akses ditolak. Hanya admin yang diperbolehkan." });
    }
    next();
  } else {
    res.status(401).json({ message: "Sesi tidak valid. Silakan login kembali." });
  }
}

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Auth Routes ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CRED.user && password === ADMIN_CRED.pass) {
    const token = "token_admin"; // In production, use JWT or crypto.randomBytes
    SESSION_TOKENS.add(token);
    return res.json({ token, role: "admin" });
  } else if (username === VIEWER_CRED.user && password === VIEWER_CRED.pass) {
    const token = "token_viewer";
    SESSION_TOKENS.add(token);
    return res.json({ token, role: "viewer" });
  }
  res.status(401).json({ message: "Kredensial salah!" });
});

app.post("/api/logout", (req, res) => {
  const token = req.headers["authorization"];
  SESSION_TOKENS.delete(token);
  res.json({ message: "Logout berhasil" });
});

// --- Cache alumni data in memory to avoid reading 44MB file on every request ---
let alumniCache = null;
let cacheValid = false;

function ensureDataFile() {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, "[]", "utf-8");
      console.log("File data/alumni.json dibuat otomatis.");
    }
  } catch (error) {
    console.error("Gagal memastikan file data.", error);
  }
}

function readAlumniData() {
  // Return cached data if available
  if (cacheValid && alumniCache !== null) {
    return alumniCache;
  }

  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    alumniCache = Array.isArray(parsed) ? parsed : [];
    cacheValid = true;
    console.log(`Loaded ${alumniCache.length} alumni records into cache.`);
    return alumniCache;
  } catch (error) {
    console.error("Gagal membaca data alumni.", error);
    return [];
  }
}

function writeAlumniData(data) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    // Update cache
    alumniCache = data;
    cacheValid = true;
    return true;
  } catch (error) {
    console.error("Gagal menulis data alumni.", error);
    return false;
  }
}

function invalidateCache() {
  cacheValid = false;
  alumniCache = null;
}


// GET /alumni/stats -> lightweight stats without sending all data
app.get("/alumni/stats", (req, res) => {
  const alumni = readAlumniData();
  const total = alumni.length;
  let identified = 0;
  let verify = 0;
  let untracked = 0;

  const yearMap = {};
  const facultyMap = {};

  alumni.forEach((item) => {
    const status = item.status || "";
    if (status === "Teridentifikasi") identified++;
    else if (status === "Perlu Verifikasi") verify++;
    else untracked++;

    // For charts - use graduation year if possible
    let year;
    if (item.tanggalLulus && !isNaN(new Date(item.tanggalLulus).getFullYear())) {
      year = new Date(item.tanggalLulus).getFullYear();
    } else {
      year = (parseInt(item.tahunMasuk) || 2020) + 4;
    }
    yearMap[year] = (yearMap[year] || 0) + 1;
    const fac = item.fakultas || 'Lainnya';
    facultyMap[fac] = (facultyMap[fac] || 0) + 1;
  });

  res.json({ total, identified, verify, untracked, yearMap, facultyMap });
});

// GET /alumni/search?name=...&page=1&limit=50 -> search by name with pagination
app.get("/alumni/search", (req, res) => {
  const query = (req.query.name || "").toString().trim().toLowerCase();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));

  const alumni = readAlumniData();

  let filtered = alumni;
  if (query) {
    filtered = alumni.filter((item) =>
      (item.namaLulusan || "").toLowerCase().includes(query)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const data = filtered.slice(start, start + limit);

  res.json({ data, total, page: safePage, totalPages, limit });
});

// GET /alumni -> list alumni with pagination
app.get("/alumni", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));

  const alumni = readAlumniData();
  const total = alumni.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const data = alumni.slice(start, start + limit);

  res.json({ data, total, page: safePage, totalPages, limit });
});

// POST /alumni -> add new alumni
app.post("/alumni", authenticate, (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { namaLulusan, nim, tahunMasuk, tanggalLulus, fakultas, programStudi, job, company, location } = req.body || {};

    // Basic validation (essential fields only)
    if (!namaLulusan || !nim || !tahunMasuk || !tanggalLulus || !fakultas || !programStudi) {
      return res.status(400).json({
        message: "Field Nama, NIM, Tahun Masuk, Tanggal Lulus, Fakultas, dan Prodi wajib diisi."
      });
    }

    const alumni = readAlumniData();
    const newAlumni = {
      ...req.body,
      id: Date.now(),
      namaLulusan: String(req.body.namaLulusan).trim(),
      nim: String(req.body.nim).trim()
    };

    alumni.push(newAlumni);
    const saved = writeAlumniData(alumni);

    if (!saved) {
      return res.status(500).json({ message: "Gagal menyimpan data alumni." });
    }

    res.status(201).json(newAlumni);
  } catch (error) {
    console.error("Error pada POST /alumni.", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

// POST /alumni/bulk -> add multiple alumni
app.post("/alumni/bulk", authenticate, (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Data harus berupa array." });
    }

    const alumni = readAlumniData();
    const newRecords = [];

    records.forEach((record, index) => {
      const { namaLulusan, nim, tahunMasuk, tanggalLulus, fakultas, programStudi, job, company, location } = record;
      
      const newAlumni = {
         id: Date.now() + index, // prevent id collision
         namaLulusan: String(namaLulusan || "").trim(),
         nim: String(nim || "").trim(),
         tahunMasuk: String(tahunMasuk || "").trim(),
         tanggalLulus: String(tanggalLulus || "").trim(),
         fakultas: String(fakultas || "").trim(),
         programStudi: String(programStudi || "").trim(),
         job: String(job || "").trim(),
         company: String(company || "").trim(),
         location: String(location || "").trim()
      };
      
      newRecords.push(newAlumni);
      alumni.push(newAlumni);
    });

    const saved = writeAlumniData(alumni);
    if (!saved) {
      return res.status(500).json({ message: "Gagal menyimpan data bulk alumni." });
    }

    res.status(201).json(newRecords);
  } catch (error) {
    console.error("Error pada POST /alumni/bulk.", error);
    res.status(500).json({ message: "Terjadi kesalahan bulk insert pada server." });
  }
});

// PUT /alumni/:id -> update alumni by id
app.put("/alumni/:id", authenticate, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { namaLulusan, nim, tahunMasuk, tanggalLulus, fakultas, programStudi, job, company, location } = req.body || {};

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID alumni tidak valid." });
    }

    // Basic validation (essential fields only)
    if (!namaLulusan || !nim) {
      return res.status(400).json({ message: "Field Nama dan NIM wajib diisi." });
    }

    const alumni = readAlumniData();
    const index = alumni.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Data alumni tidak ditemukan." });
    }

    const updatedAlumni = {
      ...alumni[index],
      ...req.body,
      id: id // preserve original id
    };

    alumni[index] = updatedAlumni;
    const saved = writeAlumniData(alumni);

    if (!saved) {
      return res.status(500).json({ message: "Gagal memperbarui data alumni." });
    }

    res.json(updatedAlumni);
  } catch (error) {
    console.error("Error pada PUT /alumni/:id.", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

// DELETE /alumni/:id -> delete alumni by id
app.delete("/alumni/:id", authenticate, (req, res) => {
  try {
    const id = Number(req.params.id);
    const alumni = readAlumniData();

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID alumni tidak valid." });
    }

    const updated = alumni.filter((item) => item.id !== id);

    if (updated.length === alumni.length) {
      return res.status(404).json({ message: "Data alumni tidak ditemukan." });
    }

    const saved = writeAlumniData(updated);
    if (!saved) {
      return res.status(500).json({ message: "Gagal menghapus data alumni." });
    }

    res.json({ message: "Data alumni berhasil dihapus." });
  } catch (error) {
    console.error("Error pada DELETE /alumni/:id.", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

// Ensure data file exists on startup
ensureDataFile();
// Pre-load cache on startup
readAlumniData();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
