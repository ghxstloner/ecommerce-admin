import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storeId = req.query.storeId as string;

  // Crear la carpeta en `public/storeId` si no existe
  const dir = path.join(process.cwd(), `public/${storeId}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Configurar formidable con las opciones necesarias
  const form = new IncomingForm({
    uploadDir: dir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }

    const file = files.image as FormidableFile | FormidableFile[];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Manejar el caso donde file es un array
    const singleFile = Array.isArray(file) ? file[0] : file;

    const oldPath = singleFile.filepath;
    const newPath = path.join(dir, singleFile.originalFilename || 'file');

    // Mover el archivo a la nueva ubicación
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error moving file' });
      }

      const imageUrl = `/${storeId}/${path.basename(newPath)}`;
      return res.status(200).json({ url: imageUrl });
    });
  });
}
