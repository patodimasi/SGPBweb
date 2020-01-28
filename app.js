#!/usr/bin/env node
const express = require('express');
const app = express();
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
var aplanos = require("./models/aplanos");
var permisos = require("./models/permisos");
var url = require('url');
mongoose.set('useFindAndModify', false);
var bodyParser = require("body-parser");
const fs = require('fs');
var path = require('path');
var _ = require('lodash');
var program = require('commander');
var router = express.Router();
var multer = require("multer");
var ejs = require('ejs');
var gm = require('gm');
var sharp = require('sharp');

global.logonusu;

var storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, './public/uploadas')
    },
    filename: function (req, file, cb){
      cb(null, file.originalname)
    }
  });

var upload = multer({
    storage: storage
});

//permite direccionar a direcciones estaticas....todas las paginas que esten en la carpeta public
app.set('port',3000);
app.use(express.static(__dirname + '/public/'));

var test = global.test;

mongoose.connect('mongodb://localhost:27017/SGPBAUX',{ useNewUrlParser: true },function(err,res){
    if(err) throw err;
    console.log('Base de datos conectada');
});

// -------------------------------------------- DOCUMENTOS ------------------------------------------
app.get('/getUbicacion', function(req, res){
        
    planos.find({_id:req.query.id_ubi}, function(err, plano) {
        if(err) throw err;

        fs.exists(plano[0].PLN_UBICACION,function(exists){
            console.log(plano[0].PLN_UBICACION);
            if(exists){
                var ubiResult =
                {
                    resultado : "OK",
                    url :    "/altapAux.html",
                    ubicacion : plano[0].PLN_UBICACION       
                }
              //  res.write(JSON.stringify(respuesta)); 
                //return res.end(); 
                
            }else{
                 var ubiResult =
                {
                    resultado : "NOOK"
             
                }
            }
           
            res.write(JSON.stringify(ubiResult)); 
            return res.end(); 
        });
       
    });
    
    
});

app.get('/b', function(req, res) {
    let file;
    var direccionfinal = req.headers.referer.split("ubi=")[1];
    console.log(direccionfinal);
  
    file = direccionfinal + "\\" + req.query.f;
   
    res.sendFile(decodeURI(file));
})

app.get('/aceptarmodif_ubi', function(req, res) {
    console.log(req.query.aceptar_ubip);
    console.log(req.query.ubi_modifp);
    var msjerror = null;

    planos.updateOne({_id:req.query.aceptar_ubip},{$set:{PLN_UBICACION:req.query.ubi_modifp}}, function(err, result) {
        if(err){
            msjerror = "NO_OK"
        }
        else{
            msjerror = "OK"
            res.write(JSON.stringify(msjerror)); 
            return res.end();   
        }
       
      console.log(result);
    });
})

app.get('/modif_ubi', function(req, res) {

    planos.find({_id: req.query.ubiplano},function(err,plano){
        if (err){
            throw err;
        }
       
        res.write(JSON.stringify(plano[0].PLN_UBICACION)); 
        return res.end();   
    })

})

app.get('/files', function(req, res) {

    let dir = req.query.ubi;
   // console.log("la primera dir" + "" + dir)
    currentDir =  dir;
    var query = req.query.path || '';
   // console.log("el query" + "" + query);
    if (query) currentDir = path.join(dir, query);
   // console.log("browsing ", currentDir);
    fs.readdir(currentDir, function (err, files) {
        if (err) {
           throw err;
         }
         var data = [];
         files
         .filter(function (file) {
             return true;
         }).forEach(function (file) {
           try {
                   //console.log("processing ", file);
                   var stats = fs.statSync(path.join(currentDir,file));
                   var time = stats["atime"];
                   var date = time.toString().substr(4,11);
   
                   var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                   if (isDirectory) {
                     data.push({ Name : file,Date : date, IsDirectory: true, Path : path.join(query, file)  });
                   } else {
                     var ext = path.extname(file);
                     if(program.exclude && _.contains(program.exclude, ext)) {
                       console.log("excluding file ", file);
                       return;
                     }       
                     data.push({ Name : file,Date:date, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
                   }
   
           } catch(e) {
             console.log(e); 
           }        
   
         });
         data = _.sortBy(data, function(f) { return f.Name});
         res.json(data);
    });
    
});

//modifica la descripcion de un plano
app.get('/ModifP',(req,res)=>{
    console.log(req.query.codigo,req.query.descripcion);

    planos.updateMany({PLN_CODIGO:req.query.codigo},{$set:{PLN_DESCRIPCION:req.query.descripcion}}, function(err, result) {
        if(err) throw err;
       
    });
    
});   

//rechazar plano
app.get('/rechazar_p',(req,res)=>{
    msj_rech = []

    planos.findOneAndUpdate({_id:req.query.inforp}, {$set:{PLN_ESTADO:"R"}},{new:true}, function(err, item) {
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
    planos.create(req.query, function(err, resultadonrv) {
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
    planos.findOneAndUpdate({PLN_CODIGO:req.query.codigo,PLN_ESTADO:"V"}, {$set:{PLN_ESTADO:"R"}},{new:true}, function(err, item) {
        if (err) throw err;
        else{
           if(item != null){
                msj_apro.push(item);
           }  
           //modifico el plano en amarillo, pasandolo a verde con el usuario y fecha de aprobacion
            planos.findOneAndUpdate({_id:req.query.id_p}, {$set:{PLN_ESTADO:"V",PLN_USUARIO_APR:req.query.logon,PLN_FECHA_APR:fecha}},{new:true}, function(err, result) {  
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

    var max = planos.find().sort({'PLN_CODIGO': -1}).limit(1)
    
    max.exec(function(err, maxResult){
        if(err) throw err;
        
        else{
          console.log("El maximo del plano es:" + " " + maxResult[0].PLN_CODIGO);
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
     
    planos.create(myobj, function(err, resultadop) {
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

    planos.find({PLN_CODIGO:req.query.name}, function(err, plano) {
        res.write(JSON.stringify(plano));
        return res.end();
    });
  
});

//busca un plano
app.get('/buscarp',(req,res)=>{
    var  filtro = {}
    console.log(req.query.codigo);
    if((req.query.codigo == '') && (req.query.nrorev == '') && (req.query.descripcion == ''))
    {
       
        res.write(JSON.stringify([]));
        return res.end();
       
    }
    else
    {
        if(req.query.codigo != '')
        {
            filtro.PLN_CODIGO = {'$regex': '.*' + req.query.codigo + '.*',$options : 'i'}
           
          
        }
   
        if(req.query.nrorev != '')
        {
            filtro.PLN_NRO_REV = parseInt(req.query.nrorev);
          
        }
   
        if(req.query.descripcion != '')
        {
            filtro.PLN_DESCRIPCION = {'$regex': '.*' + req.query.descripcion + '.*',$options : 'i'}
            
        } 
        
        planos.aggregate([
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
                    "PLN_COMENTARIO" : {$first:"$PLN_COMENTARIO"},
                    "ID":{$first:"$_id"},
                    
            }}
            ]
            ,  function(err,docs) {
                 console.log(docs);
                 res.write(JSON.stringify(docs));
                 return res.end();
              
             }
         );    
          

    }

   
});

//busca todos los planos
app.get('/buscarTodosp',(req,res)=>{
    planos.aggregate([
   
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
            "PLN_COMENTARIO": {$first:"$PLN_COMENTARIO"},
            "ID":{$first:"$_id"},
            
        }}
    ]
        ,function(err,docs) {
            if(err) throw err;
            console.log(docs);
            res.write(JSON.stringify(docs));
            return res.end();
      
        }
    );    
       
})

 //login usuario

app.get('/login',(req,res)=>{

  //  console.log("Request recibido.")
  //  console.log(req.url);
    var q = url.parse(req.url, true);
    usuarios.find({USR_LOGON: q.query.usr,USR_PASS: q.query.pass},function(err,docs){
     
      var loginResult = null;

       if(docs != "" ){
           console.log("no esta vacio");
           global.logonusu = docs[0].USR_LOGON;
         
            var loginResult =
            {
                result : "SUCCESS",
                url : "/principal.html",
                iniciales : docs[0].USR_INICIAL, 
                nombre : docs[0].USR_NOMBRE + " " + docs[0].USR_APELLIDO,
                codigo : docs[0].USR_CODIGO,
                foto: docs[0].USR_FOTO,
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
        //console.log(JSON.stringify(loginResult));
        res.write(JSON.stringify(loginResult));
        return res.end();
        
    });   

});

app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
})

// ----------------------------------------------------------------------------------------------------
// ------------------------------------------ USUARIOS ------------------------------------------------

//buscar los usuarios
app.get('/buscarTodosu',(req,res)=>{
   
    usuarios.find(function(err, usuario){
        if(err) throw err;
    
        res.write(JSON.stringify(usuario));
        return res.end();
        
   });
      
});
//muestra los permisos del usuario
app.get('/mostrar_usu',(req,res)=>{
    //console.log("Es el codigo" + " " + req.query.codigo);
    permisos.find({PER_CODIGO: req.query.codigo},function(err, permiso) {
       // console.log("Es el permiso" + " " + permiso);
        res.write(JSON.stringify(permiso));
        return res.end();
    });
    
});
//guarda los permisos modificados
app.get('/modpermiso_usu',(req,res)=>{
    // console.log(req.query.logon);
     //console.log(req.query.permisos[0]);
     console.log(req.query.permisos);
    usuarios.find({USR_LOGON: req.query.logon},function(err, usuario) {
         if(err) throw err;
         permisos.updateOne({PER_CODIGO:usuario[0].USR_CODIGO},{$set:{PER_INGJ:req.query.permisos[0],PER_INGS:req.query.permisos[1],
             PER_CC:req.query.permisos[2],PER_P:req.query.permisos[3],PER_ADMIN:req.query.permisos[4],PER_ROOT:req.query.permisos[5]}}, function(err, result) {
 
             if (err){
                 var msj = "ERROR"
             }
             else{
                 var msj = "OK"
             }
 
             res.write(JSON.stringify(msj));
             return res.end();
 
        });
 
    });
     
     
});
 //Buscar un usuario en particular
app.get('/buscarusu',(req,res)=>{
    var  filtro = {}
    
    // console.log(req.body.nombre,req.body.apellido);
    if((req.query.nombre == '') && (req.query.apellido == '')){
        res.write(JSON.stringify([]));
        return res.end();
    }

    else
    {
        if(req.query.nombre != '')
        {
            filtro.USR_NOMBRE = {'$regex': '.*' + req.query.nombre + '.*',$options : 'i'}
        }
        if(req.query.apellido != '')
        {
            filtro.USR_APELLIDO = {'$regex': '.*' + req.query.apellido + '.*',$options : 'i'}
        }

        usuarios.find(filtro,function(err,usuario){
            if (err){
                throw err;
            }
           
            res.write(JSON.stringify(usuario));
            return res.end();
        })
    
    }
  
});

//se da de baja un usuario
app.get('/baja_usu',(req,res)=>{
    usuarios.updateOne({_id: req.query.infousu},{$set:{USR_ESTADO: 'BA'}},{new:true}, function(err, result) {
            
        if (err){
            throw err;
        }
        else{
            usuarios.find({_id: req.query.infousu}, function(err, result) {
                res.write(JSON.stringify(result));
                return res.end();
            });
                
        }
            
           
    });
     
});

// alta usuario
app.get('/alta_usu',(req,res)=>{
   
    console.log(req.query.nombre,req.query.apellido,req.query.logon,req.query.estado_check);

    var f = new Date();
    
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
    console.log(fecha);
    var maximo = usuarios.find().sort({'USR_CODIGO':-1}).limit(1); // for MAX
    var codigo_usr;
    
    maximo.exec(function(err, maxResult){
        if(err) throw err;
        
        else{
          console.log("El maximo del usuario es:" + " " + maxResult[0].USR_CODIGO);
          codigo_usr = parseInt(maxResult[0].USR_CODIGO) + 1;
            
          var myobjusuario = 
          {
              USR_CODIGO: codigo_usr,USR_NOMBRE: req.query.nombre,USR_APELLIDO: req.query.apellido,USR_LOGON: req.query.logon,
              USR_PASS: req.query.logon, USR_ESTADO: 'AC',USR_FECHA_ALTA: fecha ,
          };
     
         

          usuarios.create(myobjusuario, function(err, resultadop) {
            if(err) throw err;
           // console.log(req.query.estado_check);
           weekdays =  getFullName(req.query.estado_check,codigo_usr);
         
            var myobjpermiso = 
            {
                PER_CODIGO: codigo_usr, PER_INGJ: weekdays.PER_INGJ, PER_INGS: weekdays.PER_INGS, PER_CC: weekdays.PER_CC,
                PER_P: weekdays.PER_P, PER_ADMIN: weekdays.PER_ADMIN,PER_ROOT: weekdays.PER_ROOT,
            };

            permisos.create(myobjpermiso, function (error, resultadousu){
                if (err) throw err;
                var mensaje = "OK";
                res.write(JSON.stringify(mensaje));
                return res.end();
            });
            
          });    
          
        }
       
    });
    
});

function getFullName(weekDay,codigo_usr) {
    var weekdays = {
        PER_INGJ : 'N',
        PER_INGS : 'N',
        PER_CC : 'N',
        PER_P: 'N',
        PER_ADMIN: 'N',
        PER_ROOT: 'N'
    }
    
    for( var prop in weekdays ) { 
        if (prop == weekDay){   
            weekdays[ prop ] = 'S';
        }
    }

    return weekdays;
}

//imagen usuario

app.post('/upload', upload.single('file'), function (req, res, next) {
    var url = '/uploadas/' + req.file.filename;
 
    console.log("logon usuario" + " " +  global.logonusu);
    var group = (req.file.filename.split(".")[0]);
    console.log(req.file);
    sharp(req.file.path)
    
    .resize(200, 200, {
        kernel: sharp.kernel.nearest,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0.5 }
    })
    
    .toFile('public/uploadas/' + group + "-resize.jpg", function (err) {
           
        if (err) console.log(err);
         
        usuarios.updateOne({USR_LOGON: global.logonusu},{$set:{USR_FOTO: '/uploadas/' + group + '-resize.jpg'}}, function(err, result) {
                console.log(result);
                res.json({
                    code : 1,
                    data :'/uploadas/' + group + "-resize.jpg"
                });
                res.end();

            });
    });
     
});


