const express = require('express');
const router = express.Router();
const {
  getMaterias,
  getMateriaById,
  createMateria,
  replaceMateria,
  updateMateria,
  deleteMateria,
} = require('../controllers/materiaController');

/**
 * @openapi
 * /materias:
 *   get:
 *     summary: Lista todas las materias
 *     description: Obtiene un listado paginado de materias.
 *     tags:
 *       - Materias
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
 *         description: Listado de materias obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Materia'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getMaterias);

/**
 * @openapi
 * /materias/{id}:
 *   get:
 *     summary: Obtiene una materia por su id
 *     tags:
 *       - Materias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la materia (ObjectId de MongoDB)
 *     responses:
 *       200:
 *         description: Materia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       400:
 *         description: El id proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Materia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getMateriaById);

/**
 * @openapi
 * /materias:
 *   post:
 *     summary: Crea una nueva materia
 *     tags:
 *       - Materias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - codigo
 *               - creditos
 *               - semestre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Sistemas Distribuidos
 *               codigo:
 *                 type: string
 *                 example: SD101
 *               creditos:
 *                 type: integer
 *                 example: 3
 *               semestre:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       400:
 *         description: Datos inválidos (campos faltantes, código duplicado, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createMateria);

/**
 * @openapi
 * /materias/{id}:
 *   put:
 *     summary: Reemplaza completamente una materia existente
 *     description: Reemplaza todos los campos de la materia. Se deben enviar todos los campos del recurso.
 *     tags:
 *       - Materias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la materia (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - codigo
 *               - creditos
 *               - semestre
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               creditos:
 *                 type: integer
 *               semestre:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Materia reemplazada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       400:
 *         description: Datos inválidos o id no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Materia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', replaceMateria);

/**
 * @openapi
 * /materias/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una materia
 *     description: Actualiza solo los campos enviados en el cuerpo de la petición.
 *     tags:
 *       - Materias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la materia (ObjectId de MongoDB)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               creditos:
 *                 type: integer
 *               semestre:
 *                 type: integer
 *             example:
 *               creditos: 4
 *     responses:
 *       200:
 *         description: Materia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       400:
 *         description: Datos inválidos o id no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Materia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', updateMateria);

/**
 * @openapi
 * /materias/{id}:
 *   delete:
 *     summary: Elimina una materia
 *     tags:
 *       - Materias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id de la materia (ObjectId de MongoDB)
 *     responses:
 *       204:
 *         description: Materia eliminada exitosamente (sin contenido)
 *       400:
 *         description: El id proporcionado no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Materia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deleteMateria);

module.exports = router;