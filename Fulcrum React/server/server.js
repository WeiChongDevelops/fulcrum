import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.enable("trust proxy");
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "https://fulcrumfinance.app"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const serveStatic = express.static(path.join(__dirname, "../dist"), {
  setHeaders: (res, path) => {
    if (path.endsWith(".jpg") || path.endsWith(".png") || path.endsWith(".svg") || path.endsWith(".webp")) {
      res.set("Cache-Control", "public, max-age=31557600");
    }
  },
});
app.use(serveStatic);

app.use("/api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://backend:8080/api${req.url}`,
      // url: `http://localhost:8080/api${req.url}`,
      data: req.body,
    });
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      res.status(statusCode).send(`${statusCode} Error: ${error}`);
    } else {
      res.status(500).send("Error in proxying request");
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
