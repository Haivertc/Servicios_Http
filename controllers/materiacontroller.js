const Materia = require('../models/Materia');

// GET /materias -> lista paginada
const getMaterias = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const [materias, total] = await Promise.all([
      Materia.find().skip(skip).limit(limit),
      Materia.countDocuments(),
    ]);

    res.status(200).json({
      data: materias,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las materias', error: error.message });
  }
};

// GET /materias/:id
const getMateriaById = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);

    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    res.status(200).json(materia);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    res.status(500).json({ message: 'Error al obtener la materia', error: error.message });
  }
};

// POST /materias
const createMateria = async (req, res) => {
  try {
    const nuevaMateria = await Materia.create(req.body);
    res.status(201).json(nuevaMateria);
  } catch (error) {
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear la materia', error: error.message });
  }
};

// PUT /materias/:id -> reemplazo total
const replaceMateria = async (req, res) => {
  try {
    const { nombre, codigo, creditos, semestre } = req.body;
    const datosCompletos = { nombre, codigo, creditos, semestre };

    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      datosCompletos,
      { new: true, runValidators: true, overwrite: true, context: 'query' }
    );

    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    res.status(200).json(materia);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al reemplazar la materia', error: error.message });
  }
};

// PATCH /materias/:id -> actualización parcial
const updateMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    res.status(200).json(materia);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar la materia', error: error.message });
  }
};

// DELETE /materias/:id
const deleteMateria = async (req, res) => {
  try {
    const materia = await Materia.findByIdAndDelete(req.params.id);

    if (!materia) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    res.status(500).json({ message: 'Error al eliminar la materia', error: error.message });
  }
};

module.exports = {
  getMaterias,
  getMateriaById,
  createMateria,
  replaceMateria,
  updateMateria,
  deleteMateria,
};