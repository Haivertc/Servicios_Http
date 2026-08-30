const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Sistema Académico - Fase 1',
    version: '1.0.0',
    description:
      'Documentación de los servicios HTTP CRUD para Estudiantes, Materias e Inscripciones. ' +
      'Laboratorio 2 - Sistemas Distribuidos.',
  },
  servers: [
    {
      url: process.env.BASE_URL || 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  components: {
    schemas: {
      Estudiante: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66d2f1a2b3c4d5e6f7a8b9c0' },
          nombre: { type: 'string', example: 'Ana' },
          apellido: { type: 'string', example: 'Gómez' },
          correo: { type: 'string', format: 'email', example: 'ana.gomez@correo.com' },
          fecha_nacimiento: { type: 'string', format: 'date', example: '2001-05-14' },
          programa: { type: 'string', example: 'Ingeniería de Sistemas' },
        },
      },
      EstudianteInput: {
        type: 'object',
        required: ['nombre', 'apellido', 'correo', 'fecha_nacimiento', 'programa'],
        properties: {
          nombre: { type: 'string', example: 'Ana' },
          apellido: { type: 'string', example: 'Gómez' },
          correo: { type: 'string', format: 'email', example: 'ana.gomez@correo.com' },
          fecha_nacimiento: { type: 'string', format: 'date', example: '2001-05-14' },
          programa: { type: 'string', example: 'Ingeniería de Sistemas' },
        },
      },
      Materia: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66d2f1a2b3c4d5e6f7a8b9c1' },
          nombre: { type: 'string', example: 'Sistemas Distribuidos' },
          codigo: { type: 'string', example: 'SD101' },
          creditos: { type: 'integer', example: 3 },
          semestre: { type: 'integer', example: 7 },
        },
      },
      Inscripcion: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66d2f1a2b3c4d5e6f7a8b9c2' },
          estudiante_id: { type: 'string', example: '66d2f1a2b3c4d5e6f7a8b9c0' },
          materia_id: { type: 'string', example: '66d2f1a2b3c4d5e6f7a8b9c1' },
          periodo: { type: 'string', example: '2026-1' },
          estado: { type: 'string', enum: ['activa', 'cancelada', 'finalizada'], example: 'activa' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Datos inválidos' },
          error: { type: 'string', example: 'Detalle técnico del error' },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  // Rutas donde swagger-jsdoc buscará los comentarios @openapi
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;