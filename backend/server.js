const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');

const app = express();
const port = 3000;

// Neo4j setup
const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'password'));

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors());         // To allow frontend access

// Utility function to execute queries
const executeQuery = async (query, params = {}) => {
    const session = driver.session();
    try {
        const result = await session.run(query, params);
        return result.records.map(record => record.toObject());
    } finally {
        await session.close();
    }
};

// Original Page API: Handles predefined queries with parameters
app.post('/api/query', async (req, res) => {
    const { query, params } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const results = await executeQuery(query, params);
        res.json(results);
    } catch (err) {
        console.error('Error running query', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New Page API: Handles user-defined direct queries
app.post('/api/direct_query', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const results = await executeQuery(query);
        res.json(results);
    } catch (err) {
        console.error('Error running direct query', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Close Neo4j driver connection on server exit
process.on('exit', async () => {
    await driver.close();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
