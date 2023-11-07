const express = require('express');
const router = express.Router();
const Model = require('../model/model')

//Post Method
router.post('/post', async (req, res) => {
    console.log(req.body)
    const data = new Model({
        name: req.body.name,
        date: req.body.date,
        chocolateName: req.body.chocolateName
    })
    
    try{
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
        
    }
    catch (error) {
        console.log(error)
        res.status(400).json({message: error.message, stack: error.stack});
    }
})

//Get all Method
router.get('/getAllKhataList', async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
module.exports = router;