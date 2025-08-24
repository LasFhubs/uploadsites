import express from 'express';
import multer  from 'multer';
import cors    from 'cors';
import path    from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use('/v', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');
  const publicUrl = `${req.protocol}://${req.get('host')}/v/${req.file.filename}`;
  res.json({ url: publicUrl });
});

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
