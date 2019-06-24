import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/locales/:lng/:ns', async (req: Request, res: Response, next: NextFunction) => {
  const lng = req.params.lng;
  const ns = req.params.ns;
  const filePath = `${__dirname}/locales/${lng}/${ns}.json`;

  await fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) next(err);
    res.send(data);
  });
});

export default router;
