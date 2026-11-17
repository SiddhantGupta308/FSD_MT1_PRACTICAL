
const express = require('express');

const app = express();
app.use(express.json());

let products = [
    { id: 301, name: "Wireless Mouse", category: "Electronics", price: 799, quantity: 25, inStock: true },
    { id: 302, name: "Notebook", category: "Stationery", price: 60, quantity: 100, inStock: true },
    { id: 303, name: "USB Keyboard", category: "Electronics", price: 999, quantity: 0, inStock: false }
];

app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

app.post('/api/products', (req, res) => {
    const { name, category, price, quantity, inStock } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof category !== 'string' || !category.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
        typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0 ||
        typeof inStock !== 'boolean'
    ) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const newProduct = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        name,
        category,
        price,
        quantity,
        inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get('/api/products/filter', (req, res) => {
    const category = req.query.category;

    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }

    const filteredProducts = products.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
    );

    res.status(200).json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
});

app.put('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, category, price, quantity, inStock } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof category !== 'string' || !category.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
        typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 0 ||
        typeof inStock !== 'boolean'
    ) {
        return res.status(400).json({ message: "Invalid input" });
    }

    Object.assign(product, { name, category, price, quantity, inStock });

    res.status(200).json(product);
});

app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(index, 1);
    res.status(200).json({ message: "Product deleted successfully" });
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
