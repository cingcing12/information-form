const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require('dotenv').config(); // Load .env file

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
const Url = process.env.MONGODB_URL;

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


    app.put("/update/:id", async (req, res) => {
        try{
            const {id} = req.params;
            const {first_name, last_name, ageEdite} = req.body;
            const dataUpdate = await item.findByIdAndUpdate(id, {
                first_name: first_name, last_name: last_name, age: ageEdite
            }, 
            {new: true});

            if(dataUpdate){
                res.status(200).json({item: dataUpdate, message: "Update Successfully!"});
                console.log(item.findById(id));
                console.log(first_name, last_name, ageEdite)
            }else{
                res.status(404).json("Not Found!");
            }
        }catch(err){
            res.status(500).json({err: err.message});
        }
    })

    app.post('/login', async (req, res) => {
        try{
            const {email, password} = req.body;
            if(email === "vongsokpheak@gmail.com" && password === "XfightGG@@"){
                res.status(200).json("Login Successfully!");
            }else{
                res.status(404).json({err: "Invalid email or password."});
            }
        }catch(err){
            res.status(500).json({err: err.message});
        }
    })

    app.post("/logout", async (req, res) => {
        try{
            res.status(200).json("Logout successfully!");
        }catch(err){
            res.status(500).json({err: err.message});
        }
    })

    app.listen(PORT, () => {
        console.log(`Server is running: http://localhost:${PORT}`);
    })


})
.catch(err => {
    console.error(err.message);
})
