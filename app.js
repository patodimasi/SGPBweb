var express = require('express');
var app = express();

//permite direccionar a direcciones estaticas....todas las paginas que esten en la carpeta public
app.use(express.static(__dirname + '/public/'));
app.set('port',3000);
// respond with "hello world" when a GET request is made to the homepage


app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})