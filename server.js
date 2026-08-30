require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');

const estudianteRoutes = require('./routes/estudianteroutes');
const materiaRoutes = require('./routes/materiaroutes');
const inscripcionRoutes = require('./routes/inscripcionroutes');

const app = express();

// Conexión a la base de datos
connectDB();

// Middlewares
app.use(express.json());

// Documentación Swagger / OpenAPI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/estudiantes', estudianteRoutes);
app.use('/materias', materiaRoutes);
app.use('/inscripciones', inscripcionRoutes);

// Ruta raíz simple
app.get('/', (req, res) => {
  res.json({ message: 'API Sistema Académico - Fase 1' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});