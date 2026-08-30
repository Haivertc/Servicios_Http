const express = require('express');
const router = express.Router();
const {
  getMaterias,
  getMateriaById,
  createMateria,
  replaceMateria,
  updateMateria,
  deleteMateria,
} = require('../controllers/materiacontroller');

router.get('/', getMaterias);
router.get('/:id', getMateriaById);
router.post('/', createMateria);
router.put('/:id', replaceMateria);
router.patch('/:id', updateMateria);
router.delete('/:id', deleteMateria);

module.exports = router;