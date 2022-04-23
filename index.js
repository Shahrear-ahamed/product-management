const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middle ware are here
app.use(cors());
app.use(express.json());

// server home page test
app.get("/", (req, res) => {
  res.send("It's a project management server");
});

// connect server and many more
const uri = `mongodb+srv://dbShahrear1:Sh1314435712@cluster0.nzlhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("It's a product management server");
});

const run = async () => {
  try {
    await client.connect();
    const productCollection = client.db("daraz").collection("productData");

    // Crud Operation are here

    // get data from database
    app.get("/products", async (req, res) => {
      const query = {};
      const cusror = productCollection.find(query);
      const result = await cusror.toArray();
      res.send(result);
    });

    // post data to database
    app.post("/product", async (req, res) => {
      const body = req.body;
      const result = await productCollection.insertOne(body);
      res.send(result);
    });

    // update data to database
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const body = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: body,
      };
      const result = await productCollection.updateOne(
        query,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // delete data from database
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // client.close()
  }
};
run().catch(console.dir);

// start server
app.listen(port, () => {
  console.log("Server is loagin....." + port);
});
