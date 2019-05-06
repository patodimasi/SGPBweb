// Inicializo el servidor express

const express = require('express');
const app = express();

//settings defino configuracion de express
app.set('port',3000);
app.use('/public', express.static('public'));
//app.use(express.static(__dirname + '/views'));


//routes
app.get('/',(req,res)=>{
    console.log(req.url);
    console.log(app);
    res.send('hello moto');
})

app.get('/patricia',(req,res)=>{
    console.log(req.url);
    res.send('hola');
})


//inicio el servidor
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})