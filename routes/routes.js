const express = require('express');
const router = express.Router();
const Model = require('../model/model')
const multer = require('multer');
const admin = require('firebase-admin');

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Firebase Admin SDK Initialization
const serviceAccount = require('/etc/secrets/firebasjson.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://chocolatebook-a2ad0-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'gs://chocolatebook-a2ad0.appspot.com'
  });


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


// Endpoint for file upload
router.post('/addChocolates', upload.single('file'), async (req, res) => {
    console.log('kya kiya jae');
    console.log(req.headers);
    console.log('req.headers');
    try {
        console.log(req.headers);
        const file = req.file;
        const data = req.body;
    
        // Save file to Firebase Storage
        const bucket = admin.storage().bucket();
        const fileUpload = bucket.file(file.originalname);
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });
    
        stream.end(file.buffer);
    
        // Wait for the file to be uploaded
        await new Promise((resolve, reject) => {
          stream.on('finish', resolve);
          stream.on('error', reject);
        });
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

        // Save file URL and data to Firebase Realtime Database
        const db = admin.database();
        const ref = db.ref('chocolateBook');
        const newDataRef = ref.push();
        newDataRef.set({ fileUrl, ...data });
    
        res.status(200).json({ message: 'File and data uploaded successfully.' });
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });
    
  
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

router.get('/getAllChocolist', async (req, res) => {
  try {
    const db = admin.database();
    const ref = db.ref('chocolateBook'); 

    // Fetch data from the database
    const snapshot = await ref.once('value');
    const data = snapshot.val();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/getCheckListByStatus/:status', async (req, res) => {
    try {
        const status = req.params.status === 'true'; // Convert the string parameter to a boolean

        // Create a filter to match documents with the specified "status" value
        const filter = { status };
  
      // Use Mongoose's find method to retrieve documents that match the filter
      const data = await Model.find(filter);
  
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

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

router.patch('/updateCheckOutList', async (req, res) => {
    try {
      const updateData = req.body; // An array of objects representing updates
  
      // Extract the IDs from each object
      const ids = updateData.map(item => item.id);
  
      // Create a filter to match the documents based on their IDs
      const filter = { _id: { $in: ids } };
  
      // Define the update to set the "status" field to 1 for all matched documents
      const update = { $set: { status: true } };
  
      // Use updateMany to update the matching documents
      const result = await Model.updateMany(filter, update);
  
      res.send(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

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