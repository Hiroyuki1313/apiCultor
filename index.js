require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Aumentar el tiempo de espera
    socketTimeoutMS: 45000, // Aumentar el tiempo de espera del socket
})
.then(() => {
    // Imprimir el nombre de la colección conectada
    const db = mongoose.connection;
    console.log(`Connected to MongoDB. Using database: ${db.name}`);
})
.catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware para parsear JSON
app.use(express.json());

// Definir el esquema y el modelo de Mongoose
const cultivoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    clima: {
        temperatura: Number,
        humedad: String
    },
    suelo: {
        ph: String,
        nutrientes: String,
        texturaYDrenaje: String
    },
    agua: {
        riego: String,
        fuentesDeAgua: String
    },
    luzSolar: {
        exposicion: String,
        sombra: String
    },
    seleccionDeVariedades: {
        resistencia: {
            plagas: String,
            enfermedades: String
        },
        adaptacionClimatica: String
    },
    rotacionDeCultivos: {
        frecuencia: String,
        objetivo: String
    },
    controlDePlagasYEnfermedades: {
        metodos: String,
        monitoreo: String
    },
    espaciamientoYDensidad: {
        recomendaciones: String
    },
    calendarioDeSiembra: {
        epocaDelAno: String,
        cicloDeCrecimiento: String
    },
    manejoDeMalezas: {
        tecnicas: String
    },
    cosecha: {
        momento: String,
        metodos: String
    },
    almacenamientoYComercializacion: {
        condicionesDeAlmacenamiento: String,
        mercado: String
    },
    tipoDeCrecimiento: {
        determinacion: String,
        cicloDeVida: String
    }
});

const Cultivo = mongoose.model('Cultivo', cultivoSchema, 'tCultivo'); // Nombre de la colección: tCultivo

// Crear un nuevo cultivo (Create)
app.post('/cultivos', async (req, res) => {
    const cultivoData = req.body;
    const newCultivo = new Cultivo(cultivoData);
    try {
        const savedCultivo = await newCultivo.save();
        res.status(201).json(savedCultivo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar un cultivo existente (Update)
app.put('/cultivos/:id', async (req, res) => {
    const { id } = req.params;
    const cultivoData = req.body;
    try {
        const updatedCultivo = await Cultivo.findByIdAndUpdate(id, cultivoData, { new: true, runValidators: true });
        if (updatedCultivo) {
            res.json(updatedCultivo);
        } else {
            res.status(404).json({ message: 'Cultivo not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un cultivo (Delete)
app.delete('/cultivos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCultivo = await Cultivo.findByIdAndDelete(id);
        if (deletedCultivo) {
            res.json(deletedCultivo);
        } else {
            res.status(404).json({ message: 'Cultivo not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});