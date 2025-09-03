const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const movieRoutes = require('./Routes/movie.route.js');
const swaggerDocument = require('./swagger-output.json');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4001; 
const MONGO_URL = process.env.MONGO_URI; // Update if needed


app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/movies", movieRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api-docs`);
});

module.exports = app;