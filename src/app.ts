import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';


const app = express();

app.use(bodyParser.json());


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
