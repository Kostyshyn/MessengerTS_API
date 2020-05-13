import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';

export const moveFile = (
    oldPath: string,
    newPath: string
  ): Promise<any> => {
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

export const deleteFile = (filePath: string): Promise<any> => {
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

// export const copyFile = (from, to): Promise<any> => {

// };

//     function copy() {
//         var readStream = fs.createReadStream(oldPath);
//         var writeStream = fs.createWriteStream(newPath);

//         readStream.on('error', callback);
//         writeStream.on('error', callback);

//         readStream.on('close', function () {
//             fs.unlink(oldPath, callback);
//         });

//         readStream.pipe(writeStream);
//     }