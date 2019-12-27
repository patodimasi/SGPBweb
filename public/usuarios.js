
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
      
        "<div style='margin-top:20px'>"+
            "<button id=bpbusuario onclick='Consultausu(nombreusu,apellidousu)' type='button' class='btn btn-primary btn-sm'>Buscar</button>"+
            "<button id=bptusuario type='button' style='margin-left:5px' class='btn btn-secondary btn-sm'>Todos</button>"+    
        "</div>"+
         
        "<div style='margin-left: -15px;margin-top: 40px' class='container'>"+
            "<table id='tusuarios' class='display'>" +
                "<thead>" +
                    "<tr>"+
                        //"<th style='width: 150px'></th>"+
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
            if(res[0].PER_INGJ == 'N'){
               // $("#PER_INGJ").attr("disabled", true);
                $("#PER_INGJ").attr('checked', false);
            }                   
         
            if(res[0].PER_INGS == 'N'){
              //  $("#PER_INGS").attr("disabled", true);
                $("#PER_INGS").attr('checked', false);
            }
           
            if(res[0].PER_CC == 'N'){
                //$("#PER_CC").attr("disabled", true);
                $("#PER_CC").attr('checked', false);
            }

            if(res[0].PER_P == 'N'){
                //$("#PER_P").attr("disabled", true);
                $("#PER_P").attr('checked', false);
            }
            
            if(res[0].PER_ADMIN == 'N'){
                //$("#PER_ADMIN").attr("disabled", true);
                $("#PER_ADMIN").attr('checked', false);
            }

            if(res[0].PER_ROOT == 'N'){
                //$("#PER_ROOT").attr("disabled", true);
                $("#PER_ROOT").attr('checked', false);
            }
        }
        
    });
    
};

$(document).ready(function(){
    $("#Cerrarper").click(function(){
    //habilito todos los checkbox
        $("#PER_INGJ").attr("disabled", true);
        $("#PER_INGS").attr("disabled", true);
        $("#PER_CC").attr("disabled", true);
        $("#PER_P").attr("disabled", true);
        $("#PER_ADMIN").attr("disabled", true);
        $("#PER_ROOT").attr("disabled", true);
        
    })
});

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Busca un usuario en particular---------------------------------------------------------------------------

function Consultausu(nombre, apellido){
    var nombre = nombre.value;
    var apellido = apellido.value;

    $.ajax({
        method : "GET",
        async: true,
        url:"/buscarusu",
        dataType : 'json',
        data: {nombre,apellido},

        success: function(respuesta){
            console.log(respuesta);
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
                            
                            return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip'  title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                        }
                    },
                   
                    { title: "Baja", 
                    "data": null,
                    "className": "text-center",
                        'render': function (data, type, row) {
                            return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip'  title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
                        }
                    },
                    
                ],
                    "order": [[1, 'asc']] ,
            });
            
        }

    })
};

function Baja(item){
    infousu = $(item).attr("id");
    console.log(infousu);
   /* $.ajax({
        method : "GET",
        async:true,
        url:"/baja_usu",
        dataType : 'json',
        data:{infousu},
     
        success: function(res){ 
          
           
        }
        
    })
    */
}