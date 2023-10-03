const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv").config();
const app = express();
const PORT=process.env.PORT||4000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors)

// app.use(
//   cors({
//     origin: "https://all-in-super-shop.netlify.app ",
//   })
// );

const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("the database is connecting");

    // Data-base Management start

    const db=client.db("ADDA_RESTURENT");
    const slidercollet=db.collection("sliders");
    const top_products=db.collection("Top_products");
    // slider management
    app.get("/api/slideone", async (req, res) => {
      const total_product=await slidercollet.countDocuments();
      let skip=0;
      if (total_product > 4) {
        skip=total_product - 4;
      } else {
        skip=0;
      }

      const result=await slidercollet.find().skip(skip).toArray();
      res.send(result);
    });

    //top products management
    app.get("/api/top-product", async (req, res) => {
      const total_product=await top_products.countDocuments();
      let skip=0;
      if (total_product > 6) {
        skip = total_product - 6;
      } else {
        skip = 0;
      }
      const result=await top_products.find().skip(skip).toArray();
      res.send(result);
    });

    //ALL products management
    app.get(" ", async(req, res) => {
      const result=await top_products.find().toArray();
      res.send(result);
    });

    //Deshbord slider management
    app.post('/api/slideone',async(req,res)=>{
      let slider_data=req.body
      const result=await slidercollet.insertOne(slider_data)
      res.send(result)
      
    })

     //Deshbord top products management
     app.post("/api/top-product", async (req, res) => {
       let top_product_data=req.body;
       const result=await top_products.insertOne(top_product_data);
       res.send(result);
       
     });

    app.listen(PORT, () => {
      console.log(`the server is connecting ${PORT}`);
    });
  } finally {
  }
}
run().catch(console.dir);



     