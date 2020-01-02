
$(document).ready(function(){
 
    $("#dcusuarios").html("<div class='row'>" +
            "<div class='form-group col-md-12'>" +
                "<h2>Consulta Usuarios</h2>" +
            "</div>"+
        "</div>"+
        "<div class='row'>"+
        "</div>" +
        "<hr>" +
        
       "<form class='form'>" +
            "<div class='row'>"+
                "<div class='col-md-8'>"+
                    "<div class='row'>"+
                        "<div class='col-md-12'>"+
                            "<label for='codigo'><strong>Nombre</strong></label>"+
                            "<input id='nombreusu' type='text' class='form-control' id='nombref' placeholder='' value='' required></input>"+
                        "</div>"+ 
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-12'>"+
                            "<label for='descripcion'><strong> Apellido</strong></label>"+
                            "<input type='text' class='form-control' id='apellidousu' placeholder='' value='' required>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                "<div class='col-md-4'>"+
                    "<img style='margin-top:-170px' src='./images/logocolores3.png'>"+
                   
                "</div>"+
            "</div>"+
        "</form>" +
        "<div>"+
             "<button style='margin-top:20px' type='button' id=mybtnAltau onclick='Btnaltau()' class='btn btn-info btn-circle btn-xl' data-toggle='tooltip'  title='Alta Plano'><i class='fa fa-plus'></i>"+
        "</div>"+
        "<div style='margin-top:20px'>"+
            "<button id=bpbusuario onclick='Consultausu(nombreusu.value,apellidousu.value)' type='button' class='btn btn-primary btn-sm'>Buscar</button>"+
            "<button id=bptusuario type='button' style='margin-left:5px' class='btn btn-secondary btn-sm'>Todos</button>"+    
        "</div>"+
         
        "<div style='margin-left: -15px;margin-top: 40px' class='container'>"+
            "<table id='tusuarios' class='display'>" +
                "<thead>" +
                    "<tr>"+
                        
                        "<th style='width: 250px'></th>"+
                        "<th style='width: 250px'></th>"+
                        "<th style='width: 250px'></th>"+
                        "<th style='width: 250px'></th>"+  
                        "<th style='width: 250px'></th>"+ 
                        "<th style='width: 250px'></th>"+ 
                    "</tr>"+
                "</thead>" +  
                "<tbody>"+

                "</tbody>"+  
            "</table>"+
        "</div>"   
        
    
    );
        
});

//alta usuario
function Btnaltau(){
    $('#myModalaltausuario').modal();
    
}

$(document).ready(function(){
    $("#bptusuario").click(function(){
       
        $('#tusuarios').dataTable().fnDestroy();
        var table = $('#tusuarios').DataTable({

            language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
            "ajax":{
                "url": "/buscarTodosu",
                "dataSrc":""
            },

            "columns": [
              
                { title: "Nombre","className": "text-center","data": "USR_NOMBRE"},
                { title: "Apellido","className": "text-center","data": "USR_APELLIDO" },
                { title: "Usuario","className": "text-center","data": "USR_LOGON" },
                { title: "Estado","className": "text-center","data": "USR_ESTADO" },   
               
                { title: "Permisos", 
                "data": null,
                "className": "text-center",
                    'render': function (data, type, row) {
                        
                        return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip'  title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                    }
                },
               
                { title: "Baja", 
                "data": null,
                "className": "text-center",
                    'render': function (data, type, row) {
                        return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip'  title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
                     
                    }
                },
                        
            ],

            "order": [[1, 'asc']],

            
        })

    });
});
// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Se guardan los permisos modificados
function Aceptarmodif(item){
  
    var INGJ =  $('#PER_INGJ').is(":checked");
    var INGS = $('#PER_INGS').is(":checked");
    var CC = $("#PER_CC").is(":checked");
    var P =   $("#PER_P").is(":checked");
    var ADMIN = $("#PER_ADMIN").is(":checked");
    var ROOT = $("#PER_ROOT").is(":checked");
    $('#Aceptarmodifpu').attr('disabled', false);

    var permisos = [INGJ,INGS,CC,P,ADMIN,ROOT];
   
    for(var i = 0;i < permisos.length;i++){
        if((permisos[i] == true)){
            permisos[i] = 'S'
        }
        else{
            permisos[i] = 'N'
        }
    }

    var logon =  $('#usuario').val();
    console.log(permisos);

    $.ajax({
        method : "GET",
        async:true,
        url:"/modpermiso_usu",
        dataType : 'json',
        data:{logon,permisos},

        success: function(res){
            console.log(res);
            var myModalmodifper = $('#myModalmodifper');
            if(res == "OK"){
                myModalmodifper.find('.modal-body').text('Los permisos del usuario se modificaron correctamente').attr('style', 'text-align: center','bold').css('font-weight','Bold');
                   
            }
            else{
                myModalmodifper.find('.modal-body').text('Error al modificar los permisos para el usuario').attr('style', 'text-align: center','bold').css('font-weight','Bold');
            }
            myModalmodifper.modal('show');
        }
    })
    $('#myModalpermiso').modal('hide');  
    $('#Cerrarper').click();
}
// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Prohibe que se pueda modificar mas de un checkbox--------------------------------------------------------------
$("input:checkbox").on('click', function() {
    console.log("llega el checkkkkkkkkk")
    var box = $(this);
    if (box.is(":checked")) {
      var group = "input:checkbox[name='" + box.attr("name") + "']";
      $(group).prop("checked", false);
      box.prop("checked", true);
    } else {
      box.prop("checked", false);
    }
  });

// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Modifica  los permisos de un usuario---------------------------------------------------------------------------- 
$(document).ready(function(){
    $("#modif_permiso").click(function(){
    //habilito todos los checkbox
        $("#PER_INGJ").attr("disabled", false);
        $("#PER_INGS").attr("disabled", false);
        $("#PER_CC").attr("disabled", false);
        $("#PER_P").attr("disabled", false);
        $("#PER_ADMIN").attr("disabled", false);
        $("#PER_ROOT").attr("disabled", false);
    })
})
// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Muestra los permisos de un usuario----------------------------------------------------------------------------

function Permiso(item){
    infodp = JSON.parse($(item).attr("id"));
 
    $('#myModalpermiso').modal();
  //  $('#Aceptarmodifpu').attr('disabled', true);
    $("#nombre").val(infodp.USR_NOMBRE);
    $("#apellido").val(infodp.USR_APELLIDO);
    $("#usuario").val(infodp.USR_LOGON);
    
    codigo = infodp.USR_CODIGO;
    
    //paso el codigo del usuario para que se busque en la tabla
    $.ajax({
        method : "GET",
        async:true,
        url:"/mostrar_usu",
        dataType : 'json',
        data:{codigo},
        success: function(res){ 
            console.log(res)
        
            if(res[0].PER_INGJ == 'S'){
                $("#PER_INGJ").attr('checked', true);
            }                   
            if(res[0].PER_INGS == 'S'){
            
                $("#PER_INGS").attr('checked', true);  
            }
            if(res[0].PER_CC == 'S'){
                $("#PER_CC").attr('checked', true); 
            }
            if(res[0].PER_P == 'S'){
                $("#PER_P").attr('checked', true);  
            }
            if(res[0].PER_ADMIN == 'S'){
                $("#PER_ADMIN").attr('checked', true);   
            }
            if(res[0].PER_ROOT == 'S'){
                $("#PER_ROOT").attr('checked', true);
            }
               
            
        }
        
    });
    
};

$(document).ready(function(){
   $("#Cerrarper").click(function(){
   
        $("#PER_INGJ").attr("checked", false);
        $("#PER_INGS").attr("checked", false);
        $("#PER_CC").attr("checked", false);
        $("#PER_P").attr("checked", false);
        $("#PER_ADMIN").attr("checked", false);
        $("#PER_ROOT").attr("checked", false);
        
    })
   
});

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Busca un usuario en particular---------------------------------------------------------------------------

function Consultausu(nombre, apellido){

    $.ajax({
        method : "GET",
        async: true,
        url:"/buscarusu",
        dataType : 'json',
        data: {nombre,apellido},

        success: function(respuesta){
            //console.log(respuesta)
            $('#tusuarios').dataTable().fnDestroy();

            table =  $('#tusuarios').DataTable({ 
                data: respuesta,

                language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},

                "columns": [
              
                    { title: "Nombre","className": "text-center","data": "USR_NOMBRE"},
                    { title: "Apellido","className": "text-center","data": "USR_APELLIDO" },
                    { title: "Usuario","className": "text-center","data": "USR_LOGON" },
                    { title: "Estado","className": "text-center","data": "USR_ESTADO" },  
                   
                    { title: "Permisos", 
                    "data": null,
                    "className": "text-center",
                        'render': function (data, type, row) {
                            
                            return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip'  title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                        }
                    },
                   
                    { title: "Baja", 
                    "data": null,
                    "className": "text-center",
                        'render': function (data, type, row) {
                            return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip'  title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
                        }
                    },
                    
                ],
                    "order": [[1, 'asc']] ,
            });
            
        }

    })
};

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Baja de un usuario---------------------------------------------------------------------------

function Baja(item){
    infousu = JSON.parse($(item).attr("id"));

    $.ajax({
        method : "GET",
        async:true,
        url:"/baja_usu",
        dataType : 'json',
        data:{infousu},
     
        success: function(res){ 
         
          Consultausu(res[0].USR_NOMBRE, res[0].USR_APELLIDO);
        }
        
    })
    
}

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Generar un usuario---------------------------------------------------------------------------------------

$(document).ready(function(){
    $("#generarusu").click(function(){
       
        //primero tiene que validar que se aya ingrasado nombre y apellido
        //y luego lo genera
    
       if($("#nombrealtau").val()=="" || $("#apellidoaltau").val()=="" ){
            alert("Debe completar el nombre y el apellido");
       }
       else
       {
        var nombre = $(nombrealtau).val();
        var apellido =  $(apellidoaltau).val();
        var logon = nombre.charAt(0) + apellido;

        $("#logonusu").val(logon).attr( "disabled", true);

       }

      
    });
});    

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Da de alta (btn) un usuario en la base de datos---------------------------------------------------------------------------------------

function Aceptaraltausu(item){
    //se tiene que fijar que aya generado el usuario y un permiso
    console.log("llegamos al alta");
 
    if($("#logonusu").val()=="")
    {
        alert("Debe generar un usuario");
    }
    
    
    
    
}