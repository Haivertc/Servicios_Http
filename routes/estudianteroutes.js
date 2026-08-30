const express = require('express');
const router = express.Router();
const {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  replaceEstudiante,
  updateEstudiante,
  deleteEstudiante,
} = require('../controllers/estudianteController');

/**
 * @openapi
 * /estudiantes:
 *   get:
 *     summary: Lista todos los estudiantes
 *     description: >
 *       Obtiene un listado paginado de estudiantes. Permite buscar texto libre en
 *       nombre, apellido y correo, y ordenar el resultado por un campo específico.
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: >
 *           Texto a buscar (coincidencia parcial, sin distinguir mayúsculas/minúsculas)
 *           en los campos nombre, apellido y correo.
 *         example: gomez
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nombre, apellido, correo, fecha_nacimiento, programa, createdAt]
 *         description: Campo por el cual ordenar los resultados.
 *         example: nombre
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Dirección del ordenamiento (ascendente o descendente).
 *         example: asc
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
 *         description: Parámetros de consulta inválidos (ej. un valor de sortBy no permitido)
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
/**
 * @openapi
 * /estudiantes/{id}:
 *   put:
 *     summary: Reemplaza completamente un estudiante existente
 *     description: Reemplaza todos los campos del estudiante. Se deben enviar todos los campos del recurso.
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del estudiante (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EstudianteInput'
 *     responses:
 *       200:
 *         description: Estudiante reemplazado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Datos inválidos o id no válido
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
router.put('/:id', replaceEstudiante);

/**
 * @openapi
 * /estudiantes/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un estudiante
 *     description: Actualiza solo los campos enviados en el cuerpo de la petición.
 *     tags:
 *       - Estudiantes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del estudiante (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               programa:
 *                 type: string
 *             example:
 *               programa: "Ingeniería de Software"
 *     responses:
 *       200:
 *         description: Estudiante actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       400:
 *         description: Datos inválidos o id no válido
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
router.patch('/:id', updateEstudiante);

/**
 * @openapi
 * /estudiantes/{id}:
 *   delete:
 *     summary: Elimina un estudiante
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
 *       204:
 *         description: Estudiante eliminado exitosamente (sin contenido)
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
router.delete('/:id', deleteEstudiante);

module.exports = router;