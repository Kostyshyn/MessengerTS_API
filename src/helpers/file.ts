import * as fs from 'fs';
import { normalize, resolve } from 'path';
import * as shell from 'shelljs';
import { renderFile } from 'ejs';
import config from '@config/index';
import ErrnoException = NodeJS.ErrnoException;

export type fileAction = ErrnoException | null | boolean;

export const moveFile = (
  oldPath: string,
  newPath: string
): Promise<fileAction> => {
  const from = normalize(oldPath);
  const to = normalize(newPath);
  return new Promise((resolve, reject) => {
    fs.rename(from, to, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

export const deleteFile = (filePath: string): Promise<fileAction> => {
  const p = normalize(filePath);
  return new Promise((resolve, reject) => {
    fs.unlink(p, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

export const checkDir = (filePath: string): void => {
  const p = normalize(filePath);
  try {
    fs.statSync(p);
  } catch (err) {
    shell.mkdir('-p', p);
  }
};

export const renderTemplate = async (
  filePath: string,
  payload: object = {},
  options: object = {}
): Promise<string> => {
  const { TEMPLATES_FOLDER, TEMPLATES_EXT } = config;
  const templatePath = resolve(process.cwd(), TEMPLATES_FOLDER, `${filePath}.${TEMPLATES_EXT}`);
  return await renderFile(templatePath, payload, options);
};
