import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import 'dotenv/config';


import fs from 'fs';
import { NodeSSH } from 'node-ssh';

import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

routes.post(
  '/upload/file',
  upload.single('file'),
  (req, res) => {
      const { filename } = req.file;

      const filepath = `${path.resolve(__dirname, '..', 'tmp', 'uploads')}/${filename}`;

      const ssh = new NodeSSH()

      ssh.connect({
        host: process.env.HOST,
        username: 'root',
        privateKey: fs.readFileSync(`${process.env.SSH_KEY_PATH}/id_rsa`, 'utf8')
      })
      .then(() => {
          ssh.putFile(filepath,`/home/root/${filename}`);
      });

      return res.status(200).json({ filename: filename });
  }
);


routes.get(
  '/download/file',
  (req, res) => {
      const { filename } = req.query;
      const filepath = `${path.resolve(__dirname, '..', 'tmp', 'downloads')}/${filename}`;

      const ssh = new NodeSSH()

      ssh.connect({
        host: process.env.HOST,
        username: 'root',
        privateKey: fs.readFileSync(`${process.env.SSH_KEY_PATH}/id_rsa`, 'utf8')
      })
      .then(() => {
        ssh.getFile(filepath, `/home/root/${filename}`).then(() => {
          return res.sendFile(filepath);
        })
      })

      // return res.status(404).send();
  }
);

routes.get(
  '/list/file',
  (req, res) => {
      const ssh = new NodeSSH()

      ssh.connect({
        host: process.env.HOST,
        username: 'root',
        privateKey: fs.readFileSync(`${process.env.SSH_KEY_PATH}/id_rsa`, 'utf8')
      })
      .then(() => {
        ssh.execCommand('ls', { cwd:'/home/root' }).then((result) => {
          return res.status(200).json({ files: result.stdout.split('\n') });
        });
      });
  }
);

routes.delete('/delete/file', (req, res) => {
  const { filename } = req.query;

  const ssh = new NodeSSH()

  ssh.connect({
    host: process.env.HOST,
    username: 'root',
    privateKey: fs.readFileSync(`${process.env.SSH_KEY_PATH}/id_rsa`, 'utf8')
  })
  .then(() => {
    ssh.execCommand(`rm ${filename}`, { cwd:'/home/root' }).then(() => {
      return res.status(200).send();
    });
  });
});



  export default routes;
