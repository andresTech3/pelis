// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html")); // Asegúrate de que el archivo HTML esté en la raíz del proyecto
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
