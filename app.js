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


app.get('/ModifP',(req,res)=>{
    planos.updateOne({PLN_CODIGO:req.query.codigo}, {$set:{PLN_DESCRIPCION:req.query.descripcion}}, function(err, result) {
   
        //deberia mostrar mensaje de error
     });
});   

function estado(estadoactual){
    var estadofinal;
    if(estadoactual == "PA"){
        estadofinal = "PR"
    }
    else{
        estadofinal = "AC"
    }
    return estadofinal;
}

app.get('/archi',(req,res)=>{
    var file = fs.readFileSync('C:/Users/PatriciaDimasi/','binary');
    res.setHeader('Content-Length',file.length);
    res.write(file, 'binary');
    res.end();
});

app.get('/aprobar_p',(req,res)=>{

    console.log("Datos iniciales");
    console.log(req.query.codigo);
    console.log(req.query.boton_p);
   
    var msjerror = null

    planos.find({PLN_CODIGO:req.query.codigo}, function(err, item) {
        if(req.query.boton_p == "myBap" ){
            console.log(item[0].PLN_ESTADO)
            if((item[0].PLN_ESTADO == "AC") || (item[0].PLN_ESTADO == "PR")){
              
               msjerror =
               {
                   result : "ERROR",
                   estado : "A",
                  
               }
           
               res.write(JSON.stringify(msjerror));
               return res.end();
            }
            else{
                console.log("Estado actual")
                console.log(item[0].PLN_ESTADO)
                console.log("Estado final que va a tener")
                var auxestado = estado(item[0].PLN_ESTADO);
                console.log(auxestado);
                planos.updateOne({PLN_CODIGO:req.query.codigo}, {$set:{PLN_ESTADO:auxestado}}, function(err, result) {
                    console.log(err);
                    console.log(result);
                    if (err){
                    
                        msjerror =
                            {
                                result : "NO_OK",
                                estado : "A",
                               
                            }
                        
                    }
                    else{
                        msjerror =
                        {
                            result : "OK",
                            estado : "A",
                           
                        }
                     
                    
                    }
                  
                    res.write(JSON.stringify(msjerror));
                    return res.end();
     
                 });
              
            }
        }

        if(req.query.boton_p == "myBrp" ){
            // console.log(item[0].PLN_ESTADO)
             if((item[0].PLN_ESTADO == "AC") || (item[0].PLN_ESTADO == "PA")){
               
                msjerror =
                {
                    result : "ERROR",
                    estado : "R",
                   
                }
            
                res.write(JSON.stringify(msjerror));
                return res.end();
             }
             else{
                 console.log("Estado actual")
                 console.log(item[0].PLN_ESTADO)
                 console.log("Estado final que va a tener")
                 var auxestado = estado(item[0].PLN_ESTADO);
                 console.log(auxestado);
                 planos.updateOne({PLN_CODIGO:req.query.codigo}, {$set:{PLN_ESTADO:auxestado}}, function(err, result) {
                     console.log(err);
                     console.log(result);
                     if (err){
                     
                         msjerror =
                             {
                                 result : "NO_OK",
                                 estado : "R",
                                
                             }
                         
                     }
                     else{
                         msjerror =
                         {
                             result : "OK",
                             estado : "R",
                            
                         }
                      
                     
                     }
                   
                     res.write(JSON.stringify(msjerror));
                     return res.end();
      
                  });
               
             }
         }
       

    });    
  
});   

function modificar_estado(estado,codigo) {
    planos.updateOne({ PLN_CODIGO: codigo }, { $set: { PLN_ESTADO: estado } }, function (err, result) {
        if (err) {
            msjerror = "NO_OK";
        }
        else {
            msjerror = "OK";
        }
      //  res.write((msjerror));
      //  return res.end();
      return msjerror;
    });
}

app.get('/buscarubi',(req,res)=>{
   // console.log(req.query.cplano);
   
    planos.find({PLN_CODIGO:req.query.cplano}, function(err, item) {
        //tengo que devovler en la respuesta, la ubicacion para mostrarla
       // console.log(item[0].PLN_UBICACION);
        res.write(item[0].PLN_UBICACION);
        return res.end();
    });   

});

app.get('/maxp',(req,res)=>{
    var nummax = null;

    var max = planos.find().sort({'PLN_CODIGO': -1}).limit(1)

    max.exec(function(err, maxResult){
        if(err){

        }
        else{
            console.log("else");
            nummax = parseInt((maxResult[0].PLN_CODIGO.split('-')[1])) + 1 ;
            console.log(nummax);
          //  res.write("hhhh")
            res.write(JSON.stringify("DB4-" + nummax));
            return res.end();
      
        }
       
    });
  
});

app.get('/altap',(req,res)=>{
    
    var f = new Date();
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
   
    var myobj = 
        { PLN_FECHA: fecha,PLN_CODIGO:req.query.codigo,PLN_DESCRIPCION:req.query.descripcion,PLN_UBICACION:req.query.ubicacion, PLN_NRO_REV:0,PLN_ESTADO:"PA",
         PLN_USUARIO_ALTA:req.query.logon,PLN_SUPERADO:"NS",PLN_USUARIO_APR: "",PLN_FECHA_APR:"", PLN_USUARIO_REC:"", PLN_FECHA_REC:""};
     
    planos.create(myobj, function(err, resultadop) {
        if (err){
            /*var msjerror = {
                resultado : "NO_OK",
                msj: err

            }
            */
           var msjerror = "NO_OK"
        }
        else{
          /*  var msjerror = {
                resultado : "OK",
                msj: resultadop

            }*/
            var msjerror = "OK"
            console.log("1 document inserted");
            res.write(JSON.stringify(msjerror));
            return res.end();
        }    
    });    
});

app.get('/modifubi',(req,res)=>{

  var msjubicacion = null;
  planos.updateOne({PLN_CODIGO:req.query.cplano}, {$set:{PLN_UBICACION:req.query.ubicacion}}, function(err, result) {
   
    if(err){
        //variable mensaje error
        msjubicacion = "ERROR"
      /*  msjubicacion =
        {
            result : "ERROR",
            codigo : req.query.cplano,
            
        }
        */
    }
    else{
      /*  msjubicacion =
        {
            result : "OK",
            codigo : req.query.cplano,
            
        }
        */
        msjubicacion = "OK"
    }
    res.write((msjubicacion));
    return res.end();
     
  });

});

app.get('/detallehisto',(req,res)=>{
    //traigo todos los planos que coincidan con la busqueda, ya no tengo dos tablas

    aplanos.find({PLN_CODIGO:req.query.name}, function(err, plano) {
        res.write(JSON.stringify(plano));
        return res.end();
    });
   /* var datos  = [];
   
    phistoricos.find({PLN_CODIGO:req.query.name}, function(err, historico) {
      
        for (var i in historico){
            datos.push({ 
                "PLN_FECHA"  : historico[i].PLN_FECHA,
                "PLN_CODIGO" : historico[i].PLN_CODIGO,
                "PLN_NRO_REV" : historico[i].PLN_NRO_REV,
                "PLN_USUARIO_ALTA:" : historico[i].PLN_USUARIO_ALTA,
                "PLN_USUARIO_APR" :  historico[i].PLN_USUARIO_APR,
                "PLN_FECHA_APR":  historico[i].PLN_FECHA_APR,
                "PLN_FECHA_REC" : historico[i].PLN_FECHA_REC,
                "PLN_USUARIO_REC": historico[i].PLN_USUARIO_REC,
                "PLN_ESTADO": historico[i].PLN_ESTADO,
                "PLN_SUPERADO":historico[i].PLN_SUPERADO,
                "PLN_DESCRIPCION":historico[i].PLN_DESCRIPCION
             
            });
        }
     
    });

    planos.find({PLN_CODIGO:req.query.name}, function(err, plano) {
        for(var k in plano){
            datos.push({ 
                "PLN_FECHA"  : plano[k].PLN_FECHA,
                "PLN_CODIGO" : plano[k].PLN_CODIGO,
                "PLN_NRO_REV" : plano[k].PLN_NRO_REV,
                "PLN_USUARIO_ALTA:" : plano[k].PLN_USUARIO_ALTA,
                "PLN_USUARIO_APR" :  plano[k].PLN_USUARIO_APR,
                "PLN_FECHA_APR":  plano[k].PLN_FECHA_APR,
                "PLN_FECHA_REC" : plano[k].PLN_FECHA_REC,
                "PLN_USUARIO_REC": plano[k].PLN_USUARIO_REC,
                "PLN_ESTADO" : plano[k].PLN_ESTADO,
                "PLN_SUPERADO": plano[k].PLN_SUPERADO,
                "PLN_DESCRIPCION": plano[k].PLN_DESCRIPCION
             
            });
        }
       
      res.write(JSON.stringify(datos));
      return res.end();
    });
    */
     
});

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
     
            filtro['PLN_CODIGO'] = {'$regex': '.*' + req.body.codigo + '.*',$options : 'i'}
        }
   
        if(req.body.nrorev != '')
        {
   
            filtro['PLN_NRO_REV'] = req.body.nrorev
        }
   
        if(req.body.descripcion != '')
        {
            filtro['PLN_DESCRIPCION'] = {'$regex': '.*' + req.body.descripcion + '.*',$options : 'i'}
        } 
        
   /*     aplanos.aggregate([{$match: filtro},
                         {$group:{_id:"$PLN_CODIGO",PLANOS:{ '$push': "$$ROOT"}}}],function(err,resp){
         console.log(resp);
        });
      
*/
      /*  aplanos.aggregate([
            { $match: 
            
                    filtro  
            },
            { $group: {
                "_id": "$PLN_CODIGO",
                "max_num_sold":{$max:"$PLN_NRO_REV"},
                
                "PLANO": { 
                    $push: 
                    "$$ROOT"
                }
            }}
        ],  function(err,docs) {
               // res.write(JSON.stringify(docs));
              //  return res.end();
              console.log(docs);
            }
        );     
            */

           aplanos.aggregate([
            { $match: 
            
                filtro  
             },
            {$sort: {"PLN_NRO_REV":-1}},
            {$group:{"_id": "$PLN_CODIGO",
                    "PLN_CODIGO":{$first: "$PLN_CODIGO"},
                    "PLN_NRO_REV" : {$first:"$PLN_NRO_REV"},
                    "PLN_DESCRIPCION" :{$first:"$PLN_DESCRIPCION"},
                    "PLN_ESTADO":{$first:"$PLN_ESTADO"}
            }}
            ]
            ,  function(err,docs) {
                 res.write(JSON.stringify(docs));
                 return res.end();
               //console.log(docs);
             }
         );     

          
        
    }

});

/*app.post('/buscarp',(req,res)=>{
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
     
            filtro['PLN_CODIGO'] = {'$regex': '.*' + req.body.codigo + '.*',$options : 'i'}
        }
   
        if(req.body.nrorev != '')
        {
   
            filtro['PLN_NRO_REV'] = req.body.nrorev
        }
   
        if(req.body.descripcion != '')
        {
            filtro['PLN_DESCRIPCION'] = {'$regex': '.*' + req.body.descripcion + '.*',$options : 'i'}
        } 
   
        planos.find(filtro, function(err, item) {
         
           res.write(JSON.stringify(item));
        
           return res.end();
         
        });
    
    }
       
});
*/

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


