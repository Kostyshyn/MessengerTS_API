import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import ErrnoException = NodeJS.ErrnoException;

export type fileAction = ErrnoException | null | boolean;

export const moveFile = (
    oldPath: string,
    newPath: string
  ): Promise<fileAction> => {
  const from = path.normalize(oldPath);
  const to = path.normalize(newPath);
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
  const p = path.normalize(filePath);
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
  const p = path.normalize(filePath);
  try {
    fs.statSync(p);
  } catch (err) {
    shell.mkdir('-p', p);
  }
};