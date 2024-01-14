const express = require('express');
const morgan = require('morgan');
var cors = require('cors'); 
const app = express();
const rutas = require('./Routes/index');
app.use(express.static('public'));
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());
app.use('/',rutas);
function logMessage() {
  
  console.log(`Hola estamos funcionando`);
}

setInterval(logMessage, 3600000);
const port = process.env.PORT || 4000; 
  app.listen(port, () => {
    console.log(' 🚀 El servidor ha despegado en el puerto ', port);
  });