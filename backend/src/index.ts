import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middlewares';

const app = express();

// Global middleware
app.use(cors({ origin: config.corsOrigin, credentials: true }));
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
app.listen(config.port, () => {
  console.log(`\n🚀 ONG Wilson Aquino API`);
  console.log(`   Server running on http://localhost:${config.port}`);
  console.log(`   CORS origin: ${config.corsOrigin}`);
  console.log(`   Data directory: ${config.dataDir}\n`);
});

export default app;
