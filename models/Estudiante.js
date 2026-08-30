const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo no tiene un formato válido'],
    },
    fecha_nacimiento: { type: Date, required: [true, 'La fecha de nacimiento es obligatoria'] },
    programa: { type: String, required: [true, 'El programa académico es obligatorio'], trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Estudiante', estudianteSchema);