const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre de la materia es obligatorio'], trim: true },
    codigo: {
      type: String,
      required: [true, 'El código de la materia es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    creditos: { type: Number, required: [true, 'Los créditos son obligatorios'], min: [1, 'Los créditos deben ser al menos 1'] },
    semestre: { type: Number, required: [true, 'El semestre es obligatorio'], min: [1, 'El semestre debe ser al menos 1'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Materia', materiaSchema);