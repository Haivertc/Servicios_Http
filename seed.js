require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const connectDB = require('./config/db');
const Estudiante = require('./models/Estudiante');
const Materia = require('./models/Materia');

const TOTAL_ESTUDIANTES = 1000;
const TOTAL_MATERIAS = 20;

const PROGRAMAS = [
  'Ingeniería de Sistemas',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Ciencias de la Computación',
  'Administración de Empresas',
  'Matemáticas',
];

// Genera un estudiante ficticio
const generarEstudiante = () => {
  const nombre = faker.person.firstName();
  const apellido = faker.person.lastName();

  return {
    nombre,
    apellido,
    // unique en correo -> se apoya en un número aleatorio para evitar colisiones
    correo: faker.internet
      .email({ firstName: nombre, lastName: apellido, provider: 'universidad.edu.co' })
      .toLowerCase(),
    fecha_nacimiento: faker.date.birthdate({ min: 17, max: 28, mode: 'age' }),
    programa: faker.helpers.arrayElement(PROGRAMAS),
  };
};

// Genera una materia ficticia con código único basado en el índice
const generarMateria = (index) => {
  const numero = String(index + 1).padStart(3, '0');

  return {
    nombre: faker.company.catchPhrase(),
    codigo: `MAT${numero}`,
    creditos: faker.number.int({ min: 1, max: 5 }),
    semestre: faker.number.int({ min: 1, max: 10 }),
  };
};

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Limpiando colecciones existentes...');
    await Estudiante.deleteMany({});
    await Materia.deleteMany({});

    console.log(`Generando ${TOTAL_ESTUDIANTES} estudiantes...`);
    const correosUsados = new Set();
    const estudiantes = [];

    // Se asegura que no se generen correos duplicados en el mismo lote
    while (estudiantes.length < TOTAL_ESTUDIANTES) {
      const estudiante = generarEstudiante();
      if (!correosUsados.has(estudiante.correo)) {
        correosUsados.add(estudiante.correo);
        estudiantes.push(estudiante);
      }
    }

    console.log(`Generando ${TOTAL_MATERIAS} materias...`);
    const materias = Array.from({ length: TOTAL_MATERIAS }, (_, i) => generarMateria(i));

    console.log('Insertando estudiantes en la base de datos...');
    await Estudiante.insertMany(estudiantes);

    console.log('Insertando materias en la base de datos...');
    await Materia.insertMany(materias);

    console.log(`Carga inicial completada: ${TOTAL_ESTUDIANTES} estudiantes y ${TOTAL_MATERIAS} materias insertados.`);
  } catch (error) {
    console.error('Error durante la carga inicial de datos:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
  }
};

seedDB();