import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middlewares';

const app = express();

// Global middleware
app.use(cors({
  origin: config.corsOrigin.split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, '0.0.0.0', () => {
  console.log(`\n\ud83d\ude80 CUFA Pernambuco API`);
  console.log(`   Server running on port ${config.port}`);
  console.log(`   CORS origin: ${config.corsOrigin}`);
  console.log(`   Data directory: ${config.dataDir}\n`);
});

export default app;
