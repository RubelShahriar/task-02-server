const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

const uri =
  "mongodb+srv://taskuser32:taskuser32@cluster0.qudl0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect to the MongoDB server
    await client.connect((err) => {
      if (err) {
        console.error("Error connecting to MongoDB:", err);
      } else {
        console.log("Connected to MongoDB");
      }
    });

    // POST request to insert and return data
    app.post("/insert-and-return", async (req, res) => {
      const dataToInsert = req.body;

      // Access the MongoDB collection (replace 'your-db' and 'your-collection' with your database and collection names)
      const collection = client.db("jobtask").collection("taskcollection");

      try {
        // Insert data into the collection
        const result = await collection.insertOne(dataToInsert);

        // Get the _id of the inserted document
        const insertedId = result.insertedId;

        // Retrieve the inserted document based on its _id
        const insertedData = await collection.findOne({
          _id: new ObjectId(insertedId),
        });

        res.status(201).json(insertedData);
      } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Define a route
app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
