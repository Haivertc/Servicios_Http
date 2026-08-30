const express = require('express');
const router = express.Router();
const {
  getInscripciones,
  getInscripcionById,
  createInscripcion,
  replaceInscripcion,
  updateInscripcion,
  deleteInscripcion,
} = require('../controllers/inscripcionController');

/**
 * @openapi
 * /inscripciones:
 *   get:
 *     summary: Lista todas las inscripciones
 *     description: Obtiene un listado paginado de inscripciones, con los datos del estudiante y la materia referenciados.
 *     tags:
 *       - Inscripciones
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
 *         description: Listado de inscripciones obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inscripcion'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 500
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 25
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getInscripciones);

/**
 * @openapi
 * /inscripciones/{id}:
 *   get:
 *     summary: Obtiene una inscripción por su id
 *     tags:
 *       - Inscripciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la inscripción (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Inscripción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: El id proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inscripción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getInscripcionById);

/**
 * @openapi
 * /inscripciones:
 *   post:
 *     summary: Crea una nueva inscripción
 *     description: Relaciona un estudiante existente con una materia existente en un periodo determinado.
 *     tags:
 *       - Inscripciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante_id
 *               - materia_id
 *               - periodo
 *             properties:
 *               estudiante_id:
 *                 type: string
 *                 example: 66d2f1a2b3c4d5e6f7a8b9c0
 *               materia_id:
 *                 type: string
 *                 example: 66d2f1a2b3c4d5e6f7a8b9c1
 *               periodo:
 *                 type: string
 *                 example: 2026-1
 *               estado:
 *                 type: string
 *                 enum: [activa, cancelada, finalizada]
 *                 example: activa
 *     responses:
 *       201:
 *         description: Inscripción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: Datos inválidos (campos faltantes, estudiante_id o materia_id inexistentes, inscripción duplicada, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createInscripcion);

/**
 * @openapi
 * /inscripciones/{id}:
 *   put:
 *     summary: Reemplaza completamente una inscripción existente
 *     description: Reemplaza todos los campos de la inscripción. Se deben enviar todos los campos del recurso.
 *     tags:
 *       - Inscripciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la inscripción (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante_id
 *               - materia_id
 *               - periodo
 *               - estado
 *             properties:
 *               estudiante_id:
 *                 type: string
 *               materia_id:
 *                 type: string
 *               periodo:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [activa, cancelada, finalizada]
 *     responses:
 *       200:
 *         description: Inscripción reemplazada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: Datos inválidos o id no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inscripción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', replaceInscripcion);

/**
 * @openapi
 * /inscripciones/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una inscripción
 *     description: Actualiza solo los campos enviados en el cuerpo de la petición (por ejemplo, cambiar el estado).
 *     tags:
 *       - Inscripciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la inscripción (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudiante_id:
 *                 type: string
 *               materia_id:
 *                 type: string
 *               periodo:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [activa, cancelada, finalizada]
 *             example:
 *               estado: finalizada
 *     responses:
 *       200:
 *         description: Inscripción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscripcion'
 *       400:
 *         description: Datos inválidos o id no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inscripción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', updateInscripcion);

/**
 * @openapi
 * /inscripciones/{id}:
 *   delete:
 *     summary: Elimina una inscripción
 *     tags:
 *       - Inscripciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la inscripción (ObjectId de MongoDB)
 *     responses:
 *       204:
 *         description: Inscripción eliminada exitosamente (sin contenido)
 *       400:
 *         description: El id proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Inscripción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteInscripcion);

module.exports = router;