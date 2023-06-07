require('dotenv').config();
const express = require('express'); 
const path = require('path');
const app = express(); 
// PUERTO A UTILIZAR 
const PORT = process.env.PORT; 
// RUTAS PATH 
const publicPath = path.join(__dirname ,'/public');
const cors = require('cors');


/************ REQUIRE DE RUTAS  **************/ 
const mainRoute =  require('./routes/mainRoute.js');  
const productsRoute = require('./routes/productsRoute');
const carritoRoute =  require('./routes/carritoRoute.js'); 
const usersRoute =  require('./routes/usersRoute'); 
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

/************** REQUIRE DE RUTAS PARA API *******************/
const apiUsersRoute = require('./routes/api/apiUsersRoute');
const apiProductsRoute = require('./routes/api/apiProductsRoute')

/******* REQUIRE DE SESSION *******/
const cookieParser = require('cookie-parser');
const session = require('express-session'); 

/********** CAPTURAR INFO DE POST *************/
app.use(express.urlencoded( { extended:false } ));
app.use(express.json());

/********* CONFIGURANDO EL METODO OVERRIDE  ************/
const methodOverride = require('method-override'); 
app.use(methodOverride('_method')); 

/******** MIDDLEWARES DE APLICACION **********/
app.use(session({
    secret: 'secretito', 
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(cors())
app.use(userLoggedMiddleware); 

/**********  ESCUCHANDO EL PUERTO   *********/
app.listen(PORT , ()=>{
    console.log('Servidor corriendo en el puerto ' + PORT)
});

/*********  SETEANDO LAS VISTAS PARA TRABAJAR CON EJS ***********/
app.set('view engine', 'ejs'); 
app.set("views", path.join(__dirname, "views"));

/********** CONFIGURANDO LA CARPETA PUBLIC  ***********/
app.use(express.static(publicPath)); 

/********** USE DE RUTAS PRINCIPALES *************/

app.use('/' , mainRoute );
app.use('/products' , productsRoute)
app.use('/carrito' , carritoRoute);
app.use('/user' , usersRoute);

/****************  API ROUTES ****************************/
app.use('/api/users' , apiUsersRoute); 
app.use('/api/products' , apiProductsRoute); 


/********   CLOUDINARY   ********/
//const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/******************  MANEJADOR DE ERRORES MIDDLEWARE   *********************/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json( { error:'Hubo un error en el servidor' } );
  });
  

// probando pruebas de seguridad