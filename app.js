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


app.get('/ModifP',(req,res)=>{
    planos.updateOne({PLN_CODIGO:req.query.codigo}, {$set:{PLN_DESCRIPCION:req.query.descripcion}}, function(err, result) {
   
        //deberia mostrar mensaje de error
     });
});   

app.get('/aprobar_p',(req,res)=>{
    var msjerror = null;
    
    planos.find({PLN_CODIGO:req.query.codigo}, function(err, item) {
    console.log(item[0].PLN_ESTADO);    
       if(item[0].PLN_ESTADO == "PA"){
            planos.updateOne({PLN_CODIGO:req.query.codigo}, {$set:{PLN_ESTADO:"PR"}}, function(err, result) {
                if (err){
                    msjerror = "ERROR"
                }
                else{
                    msjerror = "OK"
                }
                res.write(msjerror);
                return res.end();

            });
       }
       else{
            msjerror = "NO_OK"
            res.write(msjerror);
            return res.end();
       }
       
    });

   // console.log(req.query.codigo);
   // console.log(req.query.estado);

  /*  if(req.query.estado == "PA"){
        planos.updateOne({PLN_CODIGO:req.query.codigo}, {$set:{PLN_ESTADO:"PR"}}, function(err, result) {
            if (err){
                msjerror = "ERROR"
            }
            else{
                msjerror = "OK"
            }
            res.write(msjerror);
            return res.end();
        });      
    }
    else{
        msjerror = "NO_OK"
        res.write(msjerror);
        return res.end();
    }
    */
    
});   


app.get('/botonUP',(req,res)=>{
    
  //  console.log("llega_ap");
  //  console.log(req.query.plano);
  var msjubicacion = null;
  planos.updateOne({PLN_CODIGO:req.query.plano}, {$set:{PLN_UBICACION:req.query.ubicacion}}, function(err, result) {
   
    if(err){
        //variable mensaje error
        msjubicacion = "ERROR"
    }
    else{
        msjubicacion = "OK"
    }
    res.write(msjubicacion);
    return res.end();
     
  });

});

app.get('/detallehisto',(req,res)=>{

    var datos  = [];
   
/*    phistoricos.find({PLN_CODIGO:req.query.name}, function(err, item) {
       // console.log(item)
        res.write(JSON.stringify(item));
        return res.end();
      });
      */  
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
   
        planos.find(filtro, function(err, item) {
         
           res.write(JSON.stringify(item));
        
           return res.end();
         
        });
    
    }
       
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