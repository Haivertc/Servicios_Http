const express = require('express');
const router = express.Router();
const {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  replaceEstudiante,
  updateEstudiante,
  deleteEstudiante,
} = require('../controllers/estudiantecontroller');

/**
 * @openapi
 * /estudiantes:
 *   get:
 *     summary: Lista todos los estudiantes
 *     description: Obtiene un listado paginado de estudiantes.
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página a consultar
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Listado de estudiantes obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Estudiante'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 1000
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 50
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getEstudiantes);

/**
 * @openapi
 * /estudiantes/{id}:
 *   get:
 *     summary: Obtiene un estudiante por su id
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del estudiante (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: El id proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Estudiante no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getEstudianteById);

/**
 * @openapi
 * /estudiantes:
 *   post:
 *     summary: Crea un nuevo estudiante
 *     tags:
 *       - Estudiantes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstudianteInput'
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Datos inválidos (campos faltantes, correo duplicado, formato incorrecto, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createEstudiante);
router.put('/:id', replaceEstudiante);
router.patch('/:id', updateEstudiante);
router.delete('/:id', deleteEstudiante);

module.exports = router;