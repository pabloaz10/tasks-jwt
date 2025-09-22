const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./db');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

db.sync();

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/task', require('./routes/taskRoutes'));

// Rotas das Views
app.use('/', require('./routes/viewRoutes'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
