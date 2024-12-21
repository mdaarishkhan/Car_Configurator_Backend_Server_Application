const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 5000;

// MongoDB connection URI (replace <dbname> with your actual database name, e.g., "carConfigurator")
const uri = "mongodb+srv://mohammadaarishkhan:Commander_0@cluster0.hnhdu.mongodb.net/<dbname>?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}
connectToDatabase();

// Define the database and collection
const db = client.db('carConfigurator'); // Replace 'carConfigurator' with your database name if different
const carModelsCollection = db.collection('carModels'); // Collection name

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Car Configurator Backend!');
});

// Add car models to the database
app.post('/models', async (req, res) => {
  try {
    const carModel = req.body; // Expecting { name: 'Sedan', basePrice: 20000, features: ['Feature1', 'Feature2'] }
    const result = await carModelsCollection.insertOne(carModel);
    res.json({ message: 'Car model added!', result });
  } catch (error) {
    console.error('Error adding car model:', error);
    res.status(500).json({ message: 'Error adding car model', error });
  }
});

// Get all car models from the database
app.get('/models', async (req, res) => {
  try {
    const carModels = await carModelsCollection.find().toArray();
    res.json(carModels);
  } catch (error) {
    console.error('Error fetching car models:', error);
    res.status(500).json({ message: 'Error fetching car models', error });
  }
});

// Example route to handle POST requests
app.post('/configurations', (req, res) => {
  const configuration = req.body;
  res.send({
    message: 'Configuration received!',
    configuration: configuration,
  });
});

// Example route for a different GET endpoint
app.get('/about', (req, res) => {
  res.send('About the Car Configurator Backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
