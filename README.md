# 🎬 MovieInfo APIs

A backend service for managing movies with CRUD operations, pagination, validation, Swagger documentation, and testing support. Built as part of a backend development assignment.

---

# 📌 Project Info

This API allows you to:

- Add, update, delete movies  
- Get movies by ID  
- List movies with pagination  
- Fetch all movies without pagination  
- Access API docs via Swagger  

---

# 🛠️ Tech Stack Used

- **Node.js & Express** → Server and routing  
- **MongoDB & Mongoose** → Database and models  
- **express-validator** → Request validation  
- **swagger-autogen & swagger-ui-express** → API documentation  
- **Jest & Supertest** → Testing  
- **mongodb-memory-server** → In-memory DB for integration tests  
- **dotenv** → Environment variables  

---

# 🚀 How to Run Project

1) Install dependencies  
   ```bash
   npm install

2) Generate Swagger JSON (if swagger.js not in root)
   ```bash
   node swagger.js

3) Start the server
   ```bash
   npm start

# 🧪 How to Run Test Cases

1) Unit Test

1) Service Layer
   ```bash
   npm test --tests/Unit/movie.service.test.js

2) Controller Layer
     ```bash
     npm test --tests/Unit/movie.controller.test.js

2. Integration Test
1) End-to-end API tests
   ```bash
   npm test --tests/Integration/movie.integration.test.js

# 📖 How to Access Swagger Documentation

1) Run the server
   ```bash
   npm start

2) Swagger docs available at
👉 http://localhost:4000/api-docs

This will open the API documentation in your browser, where you can test endpoints, view request/response schemas, and explore the available APIs.   


