const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express()
require("dotenv").config()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(express.json())
app.use(cors())





const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nlw4swl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('carDoctor').collection('ourSErvice')
    const bookingCollection = client.db('carDoctor').collection('bookings')

    app.get('/ourService', async(req,res)=>{
      const cursor = serviceCollection.find();
      const result =  await cursor.toArray();
      res.send(result)
    })


    app.get('/ourService/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection:{title:1,service_id:1,price:1,img:1}
      }
      const result = await serviceCollection.findOne(query,options)
      res.send(result)
    })


    //booking

    app.post('/bookings', async(req,res) =>{
      const bookings= req.body
      console.log(bookings)
      const result = await bookingCollection.insertOne(bookings)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('car service server')
})
app.listen(port,() =>{
    console.log('car service server running',port)
})