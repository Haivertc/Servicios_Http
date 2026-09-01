const Estudiante = require('../models/Estudiante');

// Campos en los que se permite buscar texto libre (search)
const CAMPOS_BUSQUEDA = ['nombre', 'apellido', 'correo', 'programa'];

// Campos en los que se permite ordenar (sortBy)
const CAMPOS_ORDENAMIENTO = ['nombre', 'apellido', 'correo', 'fecha_nacimiento', 'programa', 'createdAt'];

// Escapa caracteres especiales de regex para que "search" no rompa la consulta
// ni permita inyectar patrones no deseados
const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /estudiantes  -> lista paginada, con búsqueda y ordenamiento
const getEstudiantes = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const { search, sortBy, order } = req.query;

    // --- Filtro de búsqueda ---
    // Busca coincidencias parciales (case-insensitive) en nombre, apellido o correo
    const filtro = {};
    if (search && search.trim() !== '') {
      const regex = new RegExp(escaparRegex(search.trim()), 'i');
      filtro.$or = CAMPOS_BUSQUEDA.map((campo) => ({ [campo]: regex }));
    }

    // --- Ordenamiento ---
    // Por defecto se ordena por _id ascendente si no se especifica sortBy
    let ordenamiento = { _id: 1 };
    if (sortBy) {
      if (!CAMPOS_ORDENAMIENTO.includes(sortBy)) {
        return res.status(400).json({
          message: `El campo de ordenamiento '${sortBy}' no es válido`,
          camposPermitidos: CAMPOS_ORDENAMIENTO,
        });
      }
      const direccion = order && order.toLowerCase() === 'desc' ? -1 : 1;
      ordenamiento = { [sortBy]: direccion };
    }

    const [estudiantes, total] = await Promise.all([
      Estudiante.find(filtro).sort(ordenamiento).skip(skip).limit(limit),
      Estudiante.countDocuments(filtro),
    ]);

    res.status(200).json({
      data: estudiantes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los estudiantes', error: error.message });
  }
};

// GET /estudiantes/:id
const getEstudianteById = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json(estudiante);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    res.status(500).json({ message: 'Error al obtener el estudiante', error: error.message });
  }
};

// POST /estudiantes
const createEstudiante = async (req, res) => {
  try {
    const nuevoEstudiante = await Estudiante.create(req.body);
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear el estudiante', error: error.message });
  }
};

// PUT /estudiantes/:id -> reemplazo total
const replaceEstudiante = async (req, res) => {
  try {
    const { nombre, apellido, correo, fecha_nacimiento, programa } = req.body;

    // En un reemplazo total (PUT) se espera que vengan todos los campos del recurso
    const datosCompletos = { nombre, apellido, correo, fecha_nacimiento, programa };

    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      datosCompletos,
      { new: true, runValidators: true, overwrite: true, context: 'query' }
    );

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json(estudiante);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al reemplazar el estudiante', error: error.message });
  }
};

// PATCH /estudiantes/:id -> actualización parcial
const updateEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json(estudiante);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    if (error.name === 'ValidationError' || error.code === 11000) {
      return res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el estudiante', error: error.message });
  }
};

// DELETE /estudiantes/:id
const deleteEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'El id proporcionado no es válido' });
    }
    res.status(500).json({ message: 'Error al eliminar el estudiante', error: error.message });
  }
};

module.exports = {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  replaceEstudiante,
  updateEstudiante,
  deleteEstudiante,
};