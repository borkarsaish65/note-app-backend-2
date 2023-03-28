// Import required modules
const express = require('express');
const userRoutes = require('./routes/user.routes')
const noteRoutes = require('./routes/note.routes')
// Create Express app
const app = express();
const cors = require("cors");

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/user',userRoutes);
app.use('/note',noteRoutes);




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});