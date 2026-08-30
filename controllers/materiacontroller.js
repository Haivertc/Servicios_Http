const Materia = require('../models/Materia');

// Campos en los que se permite buscar texto libre (search)
const CAMPOS_BUSQUEDA = ['nombre', 'codigo'];

// Campos en los que se permite ordenar (sortBy)
const CAMPOS_ORDENAMIENTO = ['nombre', 'codigo', 'creditos', 'semestre'];

// Escapa caracteres especiales de regex para que "search" no rompa la consulta
// ni permita inyectar patrones no deseados
const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /materias -> lista paginada, con búsqueda y ordenamiento
const getMaterias = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const { search, sortBy, order } = req.query;

    // --- Filtro de búsqueda ---
    // Busca coincidencias parciales (case-insensitive) en nombre o codigo
    const filtro = {};
    if (search && search.trim() !== '') {
      const regex = new RegExp(escaparRegex(search.trim()), 'i');
      filtro.$or = CAMPOS_BUSQUEDA.map((campo) => ({ [campo]: regex }));
    }

    // --- Ordenamiento ---
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

    const [materias, total] = await Promise.all([
      Materia.find(filtro).sort(ordenamiento).skip(skip).limit(limit),
      Materia.countDocuments(filtro),
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