const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3000;

let productos = [
    { id: 1, nombre: 'Laptop', precio: 15000 },
    { id: 2, nombre: 'Mouse', precio: 350 },
    { id: 3, nombre: 'Teclado', precio: 700 }
];

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.json(producto);
});

app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
        id: productos.length + 1,
        nombre: req.body.nombre,
        precio: req.body.precio
    };

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
});
app.put('/api/productos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    producto.nombre = req.body.nombre;
    producto.precio = req.body.precio;

    res.json(producto);
});
app.delete('/api/productos/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    productos.splice(indice, 1);

    res.json({
        mensaje: 'Producto eliminado correctamente'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});