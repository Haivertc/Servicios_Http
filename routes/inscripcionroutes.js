const express = require('express');
const router = express.Router();
const {
  getInscripciones,
  getInscripcionById,
  createInscripcion,
  replaceInscripcion,
  updateInscripcion,
  deleteInscripcion,
} = require('../controllers/inscripcioncontroller');

router.get('/', getInscripciones);
router.get('/:id', getInscripcionById);
router.post('/', createInscripcion);
router.put('/:id', replaceInscripcion);
router.patch('/:id', updateInscripcion);
router.delete('/:id', deleteInscripcion);

module.exports = router;