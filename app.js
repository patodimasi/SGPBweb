const express = require('express');
const app = express();
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
//var planosh = require("./models/planosh");

var url = require('url');

//permite direccionar a direcciones estaticas....todas las paginas que esten en la carpeta public
app.set('port',3000);
app.use(express.static(__dirname + '/public/'));

var test = global.test;

mongoose.connect('mongodb://localhost:27017/SGPB',function(err,res){
    if(err) throw err;
    console.log('Base de datos conectada');
});

app.get('/buscarp',(req,res)=>{
    var codigoplano = req.query.codigo;
    //planos.find({PLN_CODIGO: codigoplano.toUpperCase()},function(err,docs){
    planos.find({PLN_CODIGO: {'$regex': '.*' + codigoplano.toUpperCase() + '.*'}},function(err,docs){
        //console.log(docs);
        res.write(JSON.stringify(docs));
        return res.end();
         
    });     
});

app.get('/patricia',(req,res)=>{
    res.write(test)
    return res.end();

});

app.get('/buscarTodosp',(req,res)=>{
    /* console.log("GET MATERIALES");
     planos.find(function(err, plano){
       if(err){
           res.send("Ocurrió error obteniendo los planos");
       }else{
        console.log(plano);
        res.write(JSON.stringify(plano));
        return res.end();
           
       }
   
    });
    */
   var buscarTodosp ={
       
     "data":[
         {
         "codigo": "DB4-0001",
         "descripcion" : "SER",
         "ubicacion": "/boherdiserver/ingenieria",
         "ualta": "LMOTREL",
         "falta": "25/04/2017",
         "uaprobacion": "MDIFAZIO",
         "faprobacion": "03/02/2015",
         "urecepcion": "PRIOS",
         "frecepcion": "25/04/021",
        
         }
     ]
 }
    res.write(JSON.stringify(buscarTodosp));
    return res.end();
 })

app.get('/login',(req,res)=>{

    console.log("Request recibido.")
    console.log(req.url);
    var q = url.parse(req.url, true);
    usuarios.find({USR_LOGON: q.query.usr,USR_PASS: q.query.pass},function(err,docs){
     
      console.log(docs);
      var loginResult = null;

       if(docs != "" ){
           console.log("no esta vacio");
           
           /* usuarios.find ({USR_LOGON: q.query.usr}, {USR_INICIAL: 1},function(err,ini){
           
            console.log(ini);
           });
        */
            var loginResult =
            {
                result : "SUCCESS",
                url : "/principal.html",
                iniciales : docs[0].USR_INICIAL 
            }
            test= q.query.usr;
         
           //res.write("/principal.html");
           //return res.end();
           
       }
       else{
        
        console.log("ERROR");

        var loginResult =
        {
            result : "ERROR"
        }
    }

    res.write(JSON.stringify(loginResult));
    return res.end();

});   

});
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})