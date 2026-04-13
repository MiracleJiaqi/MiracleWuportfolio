import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = process.env.DATA_FILE ?? "/PersonalWeb/archive-data.json";
const ADMIN_PW  = process.env.ADMIN_PASSWORD ?? "wjq030501+";

async function readData() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
  } catch {
    return { items: [], hiddenIds: [] };
  }
}

async function writeData(data: object) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Archive API — must be before static middleware
  app.get("/api/archive", async (_req, res) => {
    res.json(await readData());
  });

  app.post("/api/archive", async (req, res) => {
    if (req.headers["x-admin-password"] !== ADMIN_PW)
      return res.status(401).json({ error: "Unauthorized" });
    await writeData(req.body);
    res.json({ ok: true });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
