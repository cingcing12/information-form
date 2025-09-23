const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
const Url = "mongodb+srv://cing16339:1234@db-eccomerce.qts16aa.mongodb.net/?retryWrites=true&w=majority&appName=DB-eccomerce";

const itemSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number
})

const item = mongoose.model("example_Table", itemSchema);

mongoose.connect(Url)
.then(() => {
    console.log("MongoDB Connected!");

    app.post("/postData", async (req, res) => {
        try{
            const {first_name, last_name, age} = req.body;
            const dataitem = new item({first_name, last_name, age});
            await dataitem.save();
            res.status(201).json({data: dataitem, mess: "Information Save!"});
        }catch(err){
            res.status(500).json({err: err.message});
        }
    })

    app.get("/",async (req, res) => {
        try{
            const itemData = await item.find();
            res.status(200).json(itemData);

        }catch(err){
            res.status(500).json({err: err.message});
        }
    })
    
    app.delete("/delete/:id", async (req, res) => {
        try{
            const {id} = req.params;
            const deleted = await item.findByIdAndDelete(id);
            if(deleted){
                res.status(200).json("Item Deleted!");
            }else{
                res.status(404).json("Not Found!");
            }
        }catch(err){
            res.status(500).json({err: err.message});
        }
    })

    app.listen(port, () => {
        console.log(`Server is running: http://localhost:${port}`);
    })


})
.catch(err => {
    console.error(err.message);
})
