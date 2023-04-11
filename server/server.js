const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const multer = require('multer');

const app = express();

// Enable CORS
app.use(cors());

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Set up file upload
const upload = multer({ dest: 'uploads/' });

// Define routes
app.get('/api/files', (req, res) => {
  fs.readdir('public', (err, files) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(files);
    }
  });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const filename = file.originalname;
  const destination = `public/${filename}`;
  fs.move(file.path, destination, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('File uploaded successfully!');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
