const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Wine = require("./modules/Wine");
require("dotenv").config();

const app = express();

// MIDDLEWARES

app.use(bodyParser.json());
app.use(cors());

//Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ROUTES

let wines = [];

app.get("/", (req, res) => {
  res.send("this is the homepage");
});

// POST create one Wine
app.post("/wines", async (req, res) => {
  const wine = new Wine({
    image: req.body.image,
    typeName: req.body.typeName,
    specName: req.body.specName,
    price: req.body.price,
  });
  try {
    const savedWine = await wine.save();
    res.json(savedWine);
  } catch (err) {
    res.json({ message: err });
  }
});

// GET the Full List of Wines

app.get("/wines-list", async (req, res) => {
  const wineList = await Wine.find({}).exec();
  if (!wineList) throw Error("No Items");
  res.status(200).json(wineList);
});

// GET only one Wine selected by ID

app.get("/wines/:wineId", async (req, res) => {
  const wineId = req.params.wineId;
  const wine = await Wine.findOne({ _id: wineId });
  if (!wine) {
    res.status(404).end();
  } else {
    res.json(wine);
  }
});

// DELETE one Wine selected by ID

// EASY VERSION // more performant version 1 call to DB

app.delete("/wines/:wineId", async (req, res) => {
  const wineId = req.params.wineId;
  await Wine.deleteOne({ _id: wineId }).exec(); //
 //console.log(req.params.wineId)
  res.status(204).end();
});

// DANIELE VERSION // less performant version 2 calls to DB

/* app.delete("/wines/:wineId", async (req, res) => {
  const wineId = req.params.wineId;
  const wine = await Wine.findOne({ _id: wineId });
  if (!wine) {
    res.status(404).end();
  } else {
    await Wine.deleteOne(wine).exec(); //
    res.status(200).json(`deleted:  ${wine.specName}`);
  }
}); */

// PUT - Change the details of a Wine selected by Id

app.patch("/wines/:wineId", async (req, res) => {
  try {
    const wine = await Wine.findByIdAndUpdate(req.params.wineId, req.body, {
      new: true,
    }).exec();
    //console.log(wine);
    if (!wine) {
      res.status(404).json({ message: "no object was found" });
    }
    res.status(200).json(wine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "an internal error has occured" });
  }
});

// Listen

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server run at port ${PORT}`));
