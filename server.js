require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();


connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Body parser
//added to parse JSON bodies 
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/appointments', require('./routes/appointments.routes'));
app.use('/api/patients', require('./routes/patients.routes'));

app.use(express.static('public'));




app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
