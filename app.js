const express = require('express');
const app = express();
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
//es una prueba a la base de datos p_historico
var phistoricos= require("./models/phistoricos");
var aplanos = require("./models/aplanos");
const fs = require('fs');
var url = require('url');
mongoose.set('useFindAndModify', false);
var bodyParser = require("body-parser")
var groupBy = require('json-groupby')


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

//modifica la descripcion de un plano
app.get('/ModifP',(req,res)=>{
    console.log(req.query.codigo,req.query.descripcion);

    aplanos.updateMany({PLN_CODIGO:req.query.codigo},{$set:{PLN_DESCRIPCION:req.query.descripcion}}, function(err, result) {
        if(err) throw err;
       
    });
    
});   

//rechazar plano
app.get('/rechazar_p',(req,res)=>{
    msj_rech = []

    aplanos.findOneAndUpdate({_id:req.query.inforp}, {$set:{PLN_ESTADO:"R"}},{new:true}, function(err, item) {
         if (err) throw err;
         else{
             msj_rech.push(item);
             res.write(JSON.stringify(msj_rech)); 
             return res.end();       
         }
    })
    
});

//confirma la nueva revision de un plano
app.get('/confirmar_nuevarev_p',(req,res)=>{
    msjnrev = null;
    console.log(req.query);
    aplanos.create(req.query, function(err, resultadonrv) {
        if (err) throw err;
        else{
            msjrev = "OK";
            /*  res.write(JSON.stringify(resultadonrv)); 
            return res.end();   
            */    
            res.write(JSON.stringify(msjrev)); 
            return res.end(); 
        }
    })
    
    
})


//aprueba un plano en el detalle
app.get('/aprobar_dp',(req,res)=>{
    msj_apro = []
    var f = new Date();
    console.log(req.query.logon);
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

    //primero busco si hay un plano en verde, ya que tendra que ser cambiado a rojo, si hay lo pongo en un arreglo
    aplanos.findOneAndUpdate({PLN_CODIGO:req.query.codigo,PLN_ESTADO:"V"}, {$set:{PLN_ESTADO:"R"}},{new:true}, function(err, item) {
        if (err) throw err;
        else{
           if(item != null){
                msj_apro.push(item);
           }  
           //modifico el plano en amarillo, pasandolo a verde con el usuario y fecha de aprobacion
            aplanos.findOneAndUpdate({_id:req.query.id_p}, {$set:{PLN_ESTADO:"V",PLN_USUARIO_APR:req.query.logon,PLN_FECHA_APR:fecha}},{new:true}, function(err, result) {  
                if (err) throw err;
                else{
                    msj_apro.push(result);
                    res.write(JSON.stringify(msj_apro)); 
                    return res.end();          
                 }

            })
        
        }
         
    })
    
})

app.get('/maxp',(req,res)=>{
    var nummax = null;

    var max = aplanos.find().sort({'PLN_CODIGO': -1}).limit(1)

    max.exec(function(err, maxResult){
        if(err) throw err;

        else{
          console.log(maxResult);
          nummax = ((maxResult[0].PLN_CODIGO.split('-')[1]));
          console.log(nummax + 1);
          nummax = parseInt((maxResult[0].PLN_CODIGO.split('-')[1])) + 1 ;
           
          
          res.write(JSON.stringify("DB4-" + nummax));
          return res.end();
            
        }
       
    });
  
});

app.get('/altap',(req,res)=>{
    
    var f = new Date();
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
   
    var myobj = 
        { PLN_FECHA: fecha,PLN_CODIGO:req.query.codigo,PLN_DESCRIPCION:req.query.descripcion,PLN_UBICACION:req.query.ubicacion, PLN_NRO_REV:0,PLN_ESTADO:"A",
         PLN_USUARIO_ALTA:req.query.logon,PLN_USUARIO_APR: "",PLN_FECHA_APR:""};
     
    aplanos.create(myobj, function(err, resultadop) {
        if (err){
          
           var msjerror = "NO_OK"
        }
        else{
        
            var msjerror = "OK"
            console.log("1 document inserted");
            res.write(JSON.stringify(msjerror));
            return res.end();
        }    
    });    
});
//trae todas las revisiones (detalle) del plano seleccionado
app.get('/detallehisto',(req,res)=>{
    //traigo todos los planos que coincidan con la busqueda, ya no tengo dos tablas

    aplanos.find({PLN_CODIGO:req.query.name}, function(err, plano) {
        res.write(JSON.stringify(plano));
        return res.end();
    });
  
});

//busca un plano
app.post('/buscarp',(req,res)=>{
    var  filtro = {}
    
    if((req.body.codigo == '') && (req.body.nrorev == '') && (req.body.descripcion == ''))
    {
       
        res.write(JSON.stringify([]));
        return res.end();
       
    }
    else
    {
        if(req.body.codigo != '')
        {
            filtro.PLN_CODIGO = {'$regex': '.*' + req.body.codigo + '.*',$options : 'i'}
           
          
        }
   
        if(req.body.nrorev != '')
        {
            filtro.PLN_NRO_REV = parseInt(req.body.nrorev);
          
        }
   
        if(req.body.descripcion != '')
        {
            filtro.PLN_DESCRIPCION = {'$regex': '.*' + req.body.descripcion + '.*',$options : 'i'}
            
        } 
        
        aplanos.aggregate([
            { $match: 
            
                filtro  
             },
            {$sort: {"PLN_NRO_REV":-1}},
            {$group:{"_id": "$PLN_CODIGO",
                    "PLN_CODIGO":{$first: "$PLN_CODIGO"},
                    "PLN_NRO_REV" : {$first:"$PLN_NRO_REV"},
                    "PLN_DESCRIPCION" :{$first:"$PLN_DESCRIPCION"},
                    "PLN_ESTADO":{$first:"$PLN_ESTADO"},
                    "PLN_USUARIO_ALTA":{$first:"$PLN_USUARIO_ALTA"},
                    "PLN_FECHA":{$first:"$PLN_FECHA"},
                    "PLN_FECHA_APR": {$first:"$PLN_FECHA_APR"},
                    "PLN_USUARIO_APR": {$first:"$PLN_USUARIO_APR"},
                    "PLN_FECHA_REC": {$first:"$PLN_FECHA_REC"},
                    "PLN_USUARIO_REC": {$first:"$PLN_USUARIO_REC"},
                    "ID":{$first:"$_id"},
                    
            }}
            ]
            ,  function(err,docs) {
                 res.write(JSON.stringify(docs));
                 return res.end();
              
             }
         );    
          

    }

   
});

//busca todos los planos
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

 //login usuario

app.get('/login',(req,res)=>{

    console.log("Request recibido.")
    console.log(req.url);
    var q = url.parse(req.url, true);
    usuarios.find({USR_LOGON: q.query.usr,USR_PASS: q.query.pass},function(err,docs){
     
     // console.log(docs);
      var loginResult = null;

       if(docs != "" ){
           console.log("no esta vacio");
           
         
            var loginResult =
            {
                result : "SUCCESS",
                url : "/principal.html",
                iniciales : docs[0].USR_INICIAL, 
                nombre : docs[0].USR_NOMBRE + " " + docs[0].USR_APELLIDO,
                logon : docs[0].USR_LOGON
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
        console.log(loginResult);
        console.log(JSON.stringify(loginResult));
        res.write(JSON.stringify(loginResult));
        return res.end();

    });   

});
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})


