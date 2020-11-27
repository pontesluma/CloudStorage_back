import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
  );

app.listen(3333, ()=>{
    console.log('Server up on port 3333!');
})

export default app;