// Inicializo el servidor express

const express = require('express');
const app = express();

//settings defino configuracion de express
app.set('port',3000)
app.use('/public',express.static('public'));

//routes
app.get('/',(req,res)=>{
    console.log(req.url);
    console.log(app);
    res.send('hello');
})

app.get('/patricia',(req,res)=>{
    console.log(req.url);
    res.send('hola mundo');
})
//inicio el servidor
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})