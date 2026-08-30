const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema(
  {
    estudiante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: [true, 'El estudiante es obligatorio'] },
    materia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: [true, 'La materia es obligatoria'] },
    periodo: {
      type: String,
      required: [true, 'El periodo es obligatorio'],
      trim: true,
      match: [/^\d{4}-[12]$/, 'El periodo debe tener el formato AAAA-1 o AAAA-2'],
    },
    estado: {
      type: String,
      required: [true, 'El estado es obligatorio'],
      enum: ['activa', 'cancelada', 'finalizada'],
      default: 'activa',
    },
  },
  { timestamps: true }
);

inscripcionSchema.index({ estudiante_id: 1, materia_id: 1, periodo: 1 }, { unique: true });

module.exports = mongoose.model('Inscripcion', inscripcionSchema);