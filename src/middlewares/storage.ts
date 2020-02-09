import * as express from 'express';
import * as path from 'path';

export const publicFolder = express.static(path.join(process.cwd(), 'public'));