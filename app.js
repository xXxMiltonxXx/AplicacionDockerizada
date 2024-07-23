// Nombre de integrantes:
// George Joseph Paredes Carrillo 
// Jhon Luis Pilco Quiroz
// Jandry Jahir Cedeño Mero
// Justin Enrique Morales Bravo
const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db('mydatabase');
    const collection = db.collection('documents');

    app.get('/', async (req, res) => {
        const docs = await collection.find({}).toArray();
        res.send(docs);
    });

    app.post('/add', async (req, res) => {
        const { task } = req.body;
        if (!task) {
            return res.status(400).send({ error: 'Task is required' });
        }
        await collection.insertOne({ task, completed: false });
        res.send({ success: true });
    });

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

main().catch(console.error);

