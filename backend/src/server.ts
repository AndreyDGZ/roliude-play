import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRoutes } from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares essenciais de segurança e parsing (Seção 24)
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);

// Middleware global de captura de erros não tratados
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro interno não tratado:', err);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor.'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
