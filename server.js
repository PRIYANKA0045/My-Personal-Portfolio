import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the 'portfolio' directory
app.use(express.static(path.join(__dirname, 'portfolio')));

// Redirect any other route to index.html for smooth clientside handling
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'portfolio', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
