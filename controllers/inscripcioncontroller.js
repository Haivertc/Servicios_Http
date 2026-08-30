const Inscripcion = require('../models/Inscripcion');
const Estudiante = require('../models/Estudiante');
const Materia = require('../models/Materia');

// Valida que estudiante_id y materia_id (si vienen en el body) existan realmente
const validarReferencias = async (estudiante_id, materia_id) => {
  const errores = [];

  if (estudiante_id) {
    const existeEstudiante = await Estudiante.exists({ _id: estudiante_id });
    if (!existeEstudiante) errores.push('El estudiante_id no corresponde a un estudiante existente');
  }

  if (materia_id) {
    const existeMateria = await Materia.exists({ _id: materia_id });
    if (!existeMateria) errores.push('El materia_id no corresponde a una materia existente');
  }

  return errores;
};

// GET /inscripciones -> lista paginada
const getInscripciones = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const [inscripciones, total] = await Promise.all([
      Inscripcion.find()
        .populate('estudiante_id', 'nombre apellido correo')
        .populate('materia_id', 'nombre codigo')
        .skip(skip)
        .limit(limit),
      Inscripcion.countDocuments(),
    ]);

    res.status(200).json({
      data: inscripciones,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las inscripciones', error: error.message });
  }
};

// GET /inscripciones/:id
const getInscripcionById = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id)
      .populate('estudiante_id', 'nombre apellido correo')
      .populate('materia_id', 'nombre codigo');

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    res.status(200).json(inscripcion);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    res.status(500).json({ message: 'Error al obtener la inscripción', error: error.message });
  }
};

// POST /inscripciones
const createInscripcion = async (req, res) => {
  try {
    const { estudiante_id, materia_id, periodo, estado } = req.body;

    if (!estudiante_id || !materia_id) {
      return res.status(400).json({ message: 'estudiante_id y materia_id son obligatorios' });
    }

    const errores = await validarReferencias(estudiante_id, materia_id);
    if (errores.length > 0) {
      return res.status(400).json({ message: 'Datos inválidos', errores });
    }

    const nuevaInscripcion = await Inscripcion.create({ estudiante_id, materia_id, periodo, estado });
    res.status(201).json(nuevaInscripcion);
  } catch (error) {
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear la inscripción', error: error.message });
  }
};

// PUT /inscripciones/:id -> reemplazo total
const replaceInscripcion = async (req, res) => {
  try {
    const { estudiante_id, materia_id, periodo, estado } = req.body;

    const errores = await validarReferencias(estudiante_id, materia_id);
    if (errores.length > 0) {
      return res.status(400).json({ message: 'Datos inválidos', errores });
    }

    const datosCompletos = { estudiante_id, materia_id, periodo, estado };

    const inscripcion = await Inscripcion.findByIdAndUpdate(
      req.params.id,
      datosCompletos,
      { new: true, runValidators: true, overwrite: true, context: 'query' }
    );

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    res.status(200).json(inscripcion);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al reemplazar la inscripción', error: error.message });
  }
};

// PATCH /inscripciones/:id -> actualización parcial
const updateInscripcion = async (req, res) => {
  try {
    const { estudiante_id, materia_id } = req.body;

    const errores = await validarReferencias(estudiante_id, materia_id);
    if (errores.length > 0) {
      return res.status(400).json({ message: 'Datos inválidos', errores });
    }

    const inscripcion = await Inscripcion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    res.status(200).json(inscripcion);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar la inscripción', error: error.message });
  }
};

// DELETE /inscripciones/:id
const deleteInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    res.status(500).json({ message: 'Error al eliminar la inscripción', error: error.message });
  }
};

module.exports = {
  getInscripciones,
  getInscripcionById,
  createInscripcion,
  replaceInscripcion,
  updateInscripcion,
  deleteInscripcion,
};