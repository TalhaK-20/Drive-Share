const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));




// ---------------------------- MongoDB Schema ----------------------------

const MONGODB_URI = 'Your MongoDB url here';

mongoose.connect(MONGODB_URI, {});

const fileSchema = new mongoose.Schema({
    filename: String,
    mimeType: String,
    googleDriveId: String,
});

const File = mongoose.model('File', fileSchema);




// ----------- Google Drive API Credentials -----------

const GOOGLE_DRIVE_FOLDER_ID = 'Here, use your Drive Folder ID';

const USER_EMAIL = 'Your email on which you want to share the uploaded file';

const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });




// Here, all your credentials will come (Google Service Account)
const auth = new google.auth.GoogleAuth({
    credentials: {
        type: "",
        project_id: "",
        private_key_id: "",
        private_key: ``,
        client_email: "",
        client_id: "",
        auth_uri: "",
        token_uri: "",
        auth_provider_x509_cert_url: "",
        client_x509_cert_url: "",
        universe_domain: ""
    },

    scopes: ['https://www.googleapis.com/auth/drive.file']

});

const drive = google.drive({ version: 'v3', auth });










// ----------- Routes -----------


app.get('/', (req, res) => {
    res.render('index');
});


app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const mimeType = req.file.mimetype;

    try {
        
        // Upload the file to Google Drive (This is the drive of special account made by using API; not our personal drive)

        const response = await drive.files.create({
            requestBody: {
                name: req.file.originalname,
                mimeType: mimeType,
            },
            
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
        });

        const fileId = response.data.id;

        // Share the file with your Google account (This code allows the API to share the file in our personal drive)

        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'user',
                emailAddress: USER_EMAIL,
            },
        });


        // Move the file to the shared folder (Here, the most important point. First create folder in your drive and set the it's permissions to visible/editor to anyone with this link)

        // Note: Otherwise it will create problems for the authentication!
         
        await drive.files.update({
            fileId: fileId,
            addParents: GOOGLE_DRIVE_FOLDER_ID,
            removeParents: 'root', // Only if you need to move from root to folder
            fields: 'id, parents',
        });


        // Save the file details to the database (MongoDB)
        const file = new File({
            filename: req.file.originalname,
            mimeType: mimeType,
            googleDriveId: fileId,
        });


        await file.save();
        fs.unlinkSync(filePath);
        res.redirect(`/upload/${file._id}`);
    } 

    catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        res.status(500).send('Error uploading file to Google Drive');
    }
});


app.get('/upload/:id', async (req, res) => {
    const file = await File.findById(req.params.id);
    res.render('upload', { file });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
