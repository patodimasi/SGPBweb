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
             "<button style='margin-top:20px' type='button' id=mybtnAltau onclick='Btnaltau()' class='btn btn-info btn-circle btn-xl' data-toggle='tooltip'  title='Alta Usuario'><i class='fa fa-plus'></i>"+
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


function desbloquear_estado(estado){
    var boton = null;

    if(estado == 'BA'){

        boton =  'disabled';
    }
     else{
       
        boton =  " ";
    }
 
     return boton;
}

//alta usuario
function Btnaltau(){
    $("#nombrealtau").val('');
    $("#apellidoaltau").val('');
    $("#logonusu").val('');
    $('#PER_INGJ').prop('checked', true);
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
                        
                        return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip' ' " + desbloquear_estado(data.USR_ESTADO) +" title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                    }
                },
               
                { title: "Baja", 
             
                "data": null,
                "className": "text-center",
                    'render': function (data, type, row) {
                        return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip' ' " + desbloquear_estado(data.USR_ESTADO) +" ' title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
                     
                    }
                },
                        
            ],

            "order": [[1, 'asc']],

            
        })

    });
});
// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Se guardan los permisos modificados--------------------------------------------------------
function Aceptarmodif(item){
    console.log("Aceptarmodif");
    var INGJ =  $('#P_PER_INGJ').is(":checked");
    var INGS = $('#P_PER_INGS').is(":checked");
    var CC = $("#P_PER_CC").is(":checked");
    var P =   $("#P_PER_P").is(":checked");
    var ADMIN = $("#P_PER_ADMIN").is(":checked");
    var ROOT = $("#P_PER_ROOT").is(":checked");

    var permisos = [INGJ,INGS,CC,P,ADMIN,ROOT];
    console.log(permisos);
    for(var i = 0;i < permisos.length;i++){
        if((permisos[i] == true)){
            permisos[i] = 'S'
        }
        else{
            permisos[i] = 'N'
        }
    }

    var logon =  $('#usuariopermiso').val();
    console.log(logon);

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
/*$("input:checkbox").on('click', function() {
    var box = $(this);
    if (box.is(":checked")) {
      var group = "input:checkbox[name='" + box.attr("name") + "']";
      $(group).prop("checked", false);
      box.prop("checked", true);
    } else {
      box.prop("checked", false);
    }
  });
*/
// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Modifica  los permisos de un usuario---------------------------------------------------------------------------- 
$(document).ready(function(){
    $("#modif_permiso").click(function(){
    //habilito todos los checkbox
        $('#Aceptarmodifpu').attr('disabled', false);
        $("#P_PER_INGJ").attr("disabled", false);
        $("#P_PER_INGS").attr("disabled", false);
        $("#P_PER_CC").attr("disabled", false);
        $("#P_PER_P").attr("disabled", false);
        $("#P_PER_ADMIN").attr("disabled", false);
        $("#P_PER_ROOT").attr("disabled", false);
        
    })
})



// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Muestra los permisos de un usuario----------------------------------------------------------------------------

function Permiso(item){
    $('#Aceptarmodifpu').attr('disabled', true);

    infodp = JSON.parse($(item).attr("id"));
 
    $('#myModalpermiso').modal();

  
    $("#nombrepermiso").val(infodp.USR_NOMBRE);
    $("#apellidopermiso").val(infodp.USR_APELLIDO);
    $("#usuariopermiso").val(infodp.USR_LOGON);
    
    codigo = infodp.USR_CODIGO;
    
    //paso el codigo del usuario para que se busque en la tabla
    $.ajax({
        method : "GET",
        async:true,
        url:"/mostrar_usu",
        dataType : 'json',
        data:{codigo},
        success: function(res){ 
            console.log(res[0]);
            console.log("-----------------------")
            for( var prop in res[0] ) {
               
                if(res[0][prop] == 'S'){
                    
                    console.log("SI" + " " + prop);
                  
                    $("#P_" +  prop).prop('checked',true);
                  
                    console.log("-----------------------")
                }
                else{
                    console.log("NO" + " " + prop);
                    $("#P_" + prop).prop('checked',false);
                }
                
            }
          
        }
        
        
    });
    
};

$(document).ready(function(){
   $("#Cerrarper").click(function(){
   
       /* $("#P_PER_INGJ").attr("checked", false);
        $("#P_PER_INGS").attr("checked", false);
        $("#P_PER_CC").attr("checked", false);
        $("#P_PER_P").attr("checked", false);
        $("#P_PER_ADMIN").attr("checked", false);
        $("#P_PER_ROOT").attr("checked", false);
        */
     
        $("#P_PER_INGJ").attr("disabled", true);
        $("#P_PER_INGS").attr("disabled", true);
        $("#P_PER_CC").attr("disabled", true);
        $("#P_PER_P").attr("disabled", true);
        $("#P_PER_ADMIN").attr("disabled", true);
        $("#P_PER_ROOT").attr("disabled", true);
        
       
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
                            
                            return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip'  " + desbloquear_estado(data.USR_ESTADO) +"  title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                        }
                    },
                   
                    { title: "Baja", 
                    "data": null,
                    "className": "text-center",
                        'render': function (data, type, row) {
                            return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip'  " + desbloquear_estado(data.USR_ESTADO) +" title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
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
        
        var nombre = $('#nombrealtau').val();
        var apellido =  $('#apellidoaltau').val();

        console.log(nombre);
       
        var logon = nombre.charAt(0) + apellido;
        
        $("#logonusu").val(logon).attr( "disabled", true);

       }

      
    });
});    

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Da de alta (btn) un usuario en la base de datos---------------------------------------------------------------------------------------

function Aceptaraltausu(nombre, apellido){
    var estado_check;
    var logon;
   
    $('#myModalaltausuario').modal('hide');  
   
    if($("#logonusu").val()=="")
    {
        alert("Debe generar un usuario");

    }
    else{
        logon = $("#logonusu").val();
        $('input[type=radio]:checked').each(function() {
            estado_check = $(this).prop("id");
            console.log(estado_check);
        });
        console.log(estado_check,nombre,apellido,logon);
        $.ajax({
            method : "GET",
            async:true,
            url:"/alta_usu",
            dataType : 'json',
            data:{estado_check,nombre,apellido,logon},
        
            success: function(res){ 
            if(res == "OK"){
                $("#myModalalta_usu").modal('show');
            
            }
            
            }
            
        })
    }
};
 
