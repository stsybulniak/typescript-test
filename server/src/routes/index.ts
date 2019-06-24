import express from 'express';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ message: req.t('common:general:helloWorld') });
});

export default router;
