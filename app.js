const express = require('express');
const app = express();
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
//es una prueba a la base de datos p_historico
var phistoricos= require("./models/phistoricos");

var url = require('url');
var bodyParser = require("body-parser")



app.use(bodyParser.urlencoded({
extended: true
}));
  

//permite direccionar a direcciones estaticas....todas las paginas que esten en la carpeta public
app.set('port',3000);
app.use(express.static(__dirname + '/public/'));

var test = global.test;

mongoose.connect('mongodb://localhost:27017/SGPB',function(err,res){
    if(err) throw err;
    console.log('Base de datos conectada');
});


app.get('/detallehisto',(req,res)=>{

    //console.log(req.query.name);
   
    phistoricos.find({PLN_CODIGO:req.query.name}, function(err, item) {
       // console.log(item)
        res.write(JSON.stringify(item));
        return res.end();
      });
});

app.post('/buscarp',(req,res)=>{

  // console.log("POST");
 //  console.log(req.body);
   //console.log(req.body.codigo);
   
   var filtro = {};

   if(req.body.codigo != ''){
       filtro['PLN_CODIGO'] = {'$regex': '.*' + req.body.codigo + '.*',$options : 'i'}
   }
   

   if(req.body.nrorev != ''){
      filtro['PLN_NRO_REV'] = req.body.nrorev
   }
 
   if(req.body.descripcion != '')
   {
    filtro['PLN_DESCRIPCION'] = {'$regex': '.*' + req.body.descripcion + '.*',$options : 'i'}
   } 

   
   planos.find(filtro, function(err, item) {
    //console.log(item)
    res.write(JSON.stringify(item));
    return res.end();
  });

  
});


app.get('/buscarTodosp',(req,res)=>{
   
     planos.find(function(err, plano){
       if(err){
           res.send("Ocurrió error obteniendo los planos");
       }else{
     
        res.write(JSON.stringify(plano));
        return res.end();
           
       }
   
    });
       
 })

/*app.get('/buscaritem',(req,res)=>{
    console.log(req.query);

    planos.find(req.query, function(err, item) {
        //console.log(item)
        res.write(JSON.stringify(item));
        return res.end();
      });
   
});     
*/
app.get('/login',(req,res)=>{

    console.log("Request recibido.")
    console.log(req.url);
    var q = url.parse(req.url, true);
    usuarios.find({USR_LOGON: q.query.usr,USR_PASS: q.query.pass},function(err,docs){
     
      console.log(docs);
      var loginResult = null;

       if(docs != "" ){
           console.log("no esta vacio");
           
         
            var loginResult =
            {
                result : "SUCCESS",
                url : "/principal.html",
                iniciales : docs[0].USR_INICIAL 
            }
            test= q.query.usr;
         
           
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