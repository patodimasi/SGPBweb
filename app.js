// Inicializo el servidor express

const express = require('express');
const app = express();

//settings defino configuracion de express
app.set('port',3000)

//routes
app.get('/',(req,res)=>{
    res.send('hello');
})
//inicio el servidor
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})