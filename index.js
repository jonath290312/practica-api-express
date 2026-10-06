require('dotenv').config();

const express = require('express');
const db = require('./config/db');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;


// Ruta principal
app.get('/', (req, res) => {

    res.send('Servidor funcionando correctamente');

});


// GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {

    try {

        const [productos] = await db.execute(
            'SELECT * FROM productos'
        );

        res.status(200).json(productos);

    } catch (error) {

        console.error('Error al obtener los productos:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }

});


// GET - Obtener producto por ID
app.get('/api/productos/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [productos] = await db.execute(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );

        if (productos.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json(productos[0]);

    } catch (error) {

        console.error('Error al buscar el producto:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }

});


// POST - Crear producto
app.post('/api/productos', async (req, res) => {

    try {

        const { nombre, precio } = req.body;

        if (!nombre || precio === undefined) {
            return res.status(400).json({
                mensaje: 'Los campos nombre y precio son obligatorios'
            });
        }

        const [resultado] = await db.execute(
            'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
            [nombre, precio]
        );

        res.status(201).json({
            id: resultado.insertId,
            nombre,
            precio
        });

    } catch (error) {

        console.error('Error al crear el producto:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }

});


// PUT - Actualizar producto
app.put('/api/productos/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const { nombre, precio } = req.body;

        if (!nombre || precio === undefined) {
            return res.status(400).json({
                mensaje: 'Los campos nombre y precio son obligatorios'
            });
        }

        const [resultado] = await db.execute(
            'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?',
            [nombre, precio, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Producto actualizado correctamente',
            producto: {
                id: Number(id),
                nombre,
                precio
            }
        });

    } catch (error) {

        console.error('Error al actualizar el producto:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }

});


// DELETE - Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const [resultado] = await db.execute(
            'DELETE FROM productos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            mensaje: 'Producto eliminado correctamente'
        });

    } catch (error) {

        console.error('Error al eliminar el producto:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }

});


// Iniciar servidor y comprobar conexión
async function iniciarServidor() {

    try {

        const conexion = await db.getConnection();

        console.log('Conectado exitosamente a la base de datos');

        conexion.release();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {

        console.error('Error al conectar con la base de datos:', error.message);

        process.exit(1);
    }

}

iniciarServidor();