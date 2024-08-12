const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Load products from Product.json file
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend', 'Product.json'), 'utf-8'));

// Database configuration
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    authentication: {
        type: 'default'
    }
};

// Connection pool variable
let poolPromise;

async function connectToDatabase() {
    if (!poolPromise) {
        poolPromise = sql.connect(config)
            .then(pool => {
                console.log("Connected to SQL Server successfully!");
                return pool;
            })
            .catch(err => {
                console.error("Connection error:", err);
                throw err;
            });
    }
    return poolPromise;
}

// Start the Express.js application
const app = express();

// API endpoint to fetch products
app.get('/api/products', (req, res) => {
    res.json(products); // Send products data as JSON to the client
});

// Import products from JSON file into the database
async function importProducts() {
    const pool = await connectToDatabase(); // Connect to the database

    for (const product of products) {
        await pool.request()
            .input('ProductID', sql.UniqueIdentifier, product.id || sql.NULL) // Use product.id if available, otherwise generate a new one
            .input('Image', sql.NVarChar(255), product.image)
            .input('ProductName', sql.NVarChar(255), product.name)
            .input('RatingStars', sql.Float, product.rating.stars)
            .input('RatingCount', sql.Int, product.rating.count)
            .input('PriceCents', sql.Money, product.priceCents / 100)
            .input('Description', sql.NVarChar(sql.MAX), product.description || "")
            .input('Keywords', sql.NVarChar(255), product.keywords.join(', '))
            .query(`
                INSERT INTO Products (ProductID, Image, ProductName, RatingStars, RatingCount, PriceCents, Description, Keywords) 
                VALUES (NEWID(), @Image, @ProductName, @RatingStars, @RatingCount, @PriceCents, @Description, @Keywords)
            `);
    }

    console.log("Products successfully uploaded to the database!");
}

// Start the server after connecting to the database and importing products
async function startServer() {
    try {
        await connectToDatabase(); // Attempt to connect to the database
        console.log("Successfully connected to the database!");

        await importProducts(); // Import products before starting the server

        // Start the server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (err) {
        console.error("Failed to start server, database connection unsuccessful:", err);
        process.exit(1); // Stop the application if the database connection fails
    }
}

startServer();

module.exports = { connectToDatabase, importProducts, products };
