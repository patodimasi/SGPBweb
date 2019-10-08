function colorestado(estado){
    var resultado = new Object();

    if(estado == 'V'){
        resultado.imagen = "./images/details_green.png";
        resultado.deshabilitar_e = "disabled";
        resultado.deshabilitar_r = '';
    }
    if(estado == 'A'){
        resultado.imagen = "./images/details_yellow.png";
        resultado.deshabilitar_e = ''  ;
        resultado.deshabilitar_r = "disabled";
    }
    if(estado == 'R'){
        resultado.imagen = "./images/details_red.png"
        resultado.deshabilitar_e = "disabled";
        resultado.deshabilitar_r = "disabled";
    }
    return resultado;
}

function formatdetalle(rowData){
    console.log(rowData);
    var div = $('<div/>')
        .addClass( 'loading' )
        .text( 'Loading...' );
  
    var jsondetalle = {};
        $.ajax( {
            type: "GET",
            url: '/detallehisto',
            
            data: {
                name: rowData.PLN_CODIGO
            
            },
            success: function(res){
                //aca tengo todas las versiones de los planos
                var jsondetalle = JSON.parse(res);
              
               // prueba(jsondetalle);

                var tbody = '';
                tbody += '<table id="tabledetalle" class="table">';
                tbody += '<thead class="thead-dark">';
                tbody += '<tr>';
                tbody  += '<th>'+'Estado' +'</th>';
                tbody  += '<th>'+'F.Alta'+'</th>';
                tbody  += '<th>'+'N°Rev'+'</th>';
                tbody  += '<th>'+'F.Aprobación'+'</th>';
                tbody  += '<th>'+'U.Aprobación'+'</th>';
                tbody  += '<th>'+'Ubicación'+'</th>';
                tbody  += '<th>'+'&nbsp;&nbsp;&nbsp;Tareas'+'</th>';
                tbody  += '</tr>';
                tbody += '<thead>';

                for (var i = 0; i < jsondetalle.length; i++) {
                    var myString = (colorestado(jsondetalle[i].PLN_ESTADO));
                    tbody += '<tr>';
                    tbody += '<td>'+"<img id='"+jsondetalle[i]._id+"' src='"+myString.imagen+"' >"+'</td>';
                    tbody += '<td>'+jsondetalle[i].PLN_FECHA+'</td>';
                    tbody += '<td>'+jsondetalle[i].PLN_NRO_REV+'</td>';
                    tbody += '<td>'+'<label id="mybfa'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_FECHA_APR+'</label>'+'</td>';
                    tbody += '<td>'+'<label id="mybua'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_USUARIO_APR+'</label>'+'</td>';
                    tbody += '<td>'+"<button  style='margin-left: 17px;border-width: 1px' id='myBtn' class='Abrirup fa fa-folder-open data-toggle='tooltip' title='Ubicación'/>"+'</td>';
                    tbody += '<td>'+"<button id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "'  ' " + myString.deshabilitar_e +" '  style='margin-left: 11px;border-width: 1px'  class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                                  "<button id='"+jsondetalle[i]._id+ "' style='border-width: 1px' ' " + myString.deshabilitar_r +" ' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
                             '</td>';
                    tbody += '</tr>';
        
                }
                
                tbody += '</table>';
               
                
                div
                .html(tbody)
                .removeClass( 'loading' );
            
                
            }
            
        })   
            
     return   div;
     
}
//Rechazar
$('#examplep tbody').on('click', 'button.GetRechazar', function () {
    //En esta funcion lo que ago es cambiar el estado de verde a rojo y bloquear el boton
    inforp = $(this).attr("id");
    console.log(inforp);
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/rechazar_p",
        dataType : 'json',
        data:{inforp},
     
        success: function(res){ 
            Actualizar_detalle(res);
         
        }
    })
    
})


function Actualizar_detalle(jsondetalle){

    for(var i = 0;i < jsondetalle.length;i++){
        var myString = (colorestado(jsondetalle[i].PLN_ESTADO));
        if(jsondetalle[i].PLN_ESTADO == "R"){
            //cambio de color el led a rojo
            $("#"+ jsondetalle[i]._id ).attr('src', myString.imagen);
            //desabilito el boton de aprobacion
            $("[id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "']").attr("disabled",true);
            //desabilito el boton de rechazado
            $("[id='"+jsondetalle[i]._id+"']").attr("disabled",true);
        }
        if(jsondetalle[i].PLN_ESTADO == "V"){
            //agrego a la celda el nombre del usuario aprobacion
            $('#mybua'+ jsondetalle[i]._id ).text(jsondetalle[i].PLN_USUARIO_APR);
            //agrego la fecha de aprobacion
            $('#mybfa'+ jsondetalle[i]._id ).text(jsondetalle[i].PLN_FECHA_APR);
            //cambio led a verde
            $("#"+ jsondetalle[i]._id ).attr('src', myString.imagen);

            $("[id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "']").attr("disabled",true);
            $("[id='"+jsondetalle[i]._id+"']").attr("disabled",false);
        }
    }
 
}

//aprobar
$('#examplep tbody').on('click', 'button.GetDetalle', function () {
    //obtengo el codigo y el id imagen de la fila presionada
    infodp = $(this).attr("id");
    var logon = sessionStorage["logon"];
    
    id_p = (infodp.split('/')[0]);
    codigo = (infodp.split('/')[1]);
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/aprobar_dp",
        dataType : 'json',
        data:{codigo,id_p,logon},
     
        success: function(res){ 
            Actualizar_detalle(res); 
           
        }
        

    })
    
  
})

//Muestra los datos de una nueva revision
$('#examplep tbody').on('click', 'button.GetNuevaRev', function () {
    $('#myModal1').modal();
    infodp = JSON.parse($(this).attr("id"));
    var f = new Date();
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
    $("#codigonr").val(infodp.PLN_CODIGO);
    $("#nrorevnr").val(infodp.PLN_NRO_REV);
    $("#descripcionnr").val(infodp.PLN_DESCRIPCION);
    $("#usuarioanr").val(infodp.PLN_USUARIO_ALTA);
    $("#faltanr").val(infodp.PLN_FECHA);
    $("#faprobnr").val(infodp.PLN_FECHA_APR);
    $("#usuarioaprnr").val(infodp.PLN_USUARIO_APR);
    $("#frecnr").val(infodp.PLN_FECHA_REC);
    $("#usuariorecnr").val(infodp.PLN_USUARIO_REC);

    $("#nuevarevp").val(infodp.PLN_NRO_REV + 1);
    $("#descripcion_nrp").val(infodp.PLN_DESCRIPCION);
    $("#fechaaltanrp").val(fecha);
  
})
//confirma la nueva revision
$("#signin").on( "click", function() {

    var PLN_FECHA  =  $("#fechaaltanrp").val();
    var PLN_CODIGO =  $("#codigonr").val();
    var PLN_DESCRIPCION =  $("#descripcionnr").val();
    var PLN_NRO_REV =  parseInt($("#nuevarevp").val());
    var PLN_ESTADO = "A"
    var PLN_USUARIO_ALTA = $("#usuarioanr").val();
    var PLN_USUARIO_APR =  "";
    var PLN_FECHA_APR =  "";
   // var PLN_FECHA_REC =  $("#frecnr").val();
    //var PLN_USUARIO_REC =  $("#usuariorecnr").val();

    $.ajax({
        method : "GET",
        async:true,
        url:"/confirmar_nuevarev_p",
        dataType : 'json',
        data:{ PLN_FECHA,PLN_CODIGO,PLN_DESCRIPCION,PLN_NRO_REV,PLN_ESTADO,PLN_USUARIO_ALTA,PLN_USUARIO_APR,PLN_FECHA_APR},

        success: function(res){ 
         if (res == "OK"){
             console.log("llega");
             $("#bpb").click();
           
         }
               
        }
        
    })
  
    $('#myModal1').modal('hide');  
});
//trigger next modal
$("#signin").on( "click", function() {
   
    $('#myModal2').modal('show');  
  
});

//buscar todos
$(document).ready(function(){ 
    $("#bpt").click(function(){
        $(document).ready(function() {
            $('#examplep').dataTable().fnDestroy();
           
            var table = $('#examplep').DataTable({
                language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
                "ajax":{
                    "url": "/buscarTodosp",
                    "dataSrc":""
                },
                "columns": [
                    {
                        "className":      'details-control',
                        "orderable":      false,
                        "data":           null,    
                        "defaultContent": ''
                    },  
                    { title: "Código","className": "text-center","data": "PLN_CODIGO" },
                    { title: 'N°Rev',"className": "text-center","data": "PLN_NRO_REV"},
                    { title: "Descripción","className": "text-center","data": "PLN_DESCRIPCION"},
                    {    
                        title: "Ubicación", 
                       "data": null,
                       "className": "text-center",
                       "defaultContent": "<label class='btn btn-light'><input type= 'image' src='./images/carpeta1.png'></label>"
                    },
                    
                    {
                        title: "Tarea", 
                       "data": null,
                       "className": "button",
                       "defaultContent": "<div class='btn-group' "+ 
                       "role='group' aria-label='Basic example'> "+
                       "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' title='Aprobar'><input type= 'image' src='./images/aprobar.png'></label>"+
                       "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' title='Recibir'><input type= 'image' src='./images/recibir.png'></label>"+
                       "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' title='Superar'><input type= 'image' src='./images/superar.png'></label>"
                    }

                ],    
                "order": [[1, 'asc']]
            });   
            table.MakeCellsEditable({
                "onUpdate": myCallbackFunction,
                "inputCss":'my-input-class',
                "columns": [2],
                "confirmationButton": { // could also be true
                    "confirmCss": 'my-confirm-class',
                    "cancelCss": 'my-cancel-class'
                },
                "inputTypes": []
            }); 

            function myCallbackFunction (updatedCell, updatedRow, oldValue) {
                console.log("The new value for the cell is: " + updatedCell.data());
                console.log("The old value for that cell was: " + oldValue);
                console.log("The values for each cell in that row are: " + updatedRow.data());
            }
              
            function destroyTable() {
                if ($.fn.DataTable.isDataTable('#myAdvancedTable')) {
                    table.destroy();
                    table.MakeCellsEditable("destroy");
                }
            }
            $('#examplep tbody').on('click', 'td.details-control', function () {
                
                var tr = $(this).closest('tr');
                var row = table.row( tr );
             
                if ( row.child.isShown() ) {
                   
                   
                    //fila que esta abierta y la cierro
                    console.log("fila que esta abierta y la cierro")
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                 
                    //abrir fila
                    console.log("abrir fila");
                    row.child( formathistorico(row.data()) ).show();
                
                
                }

            });   


        });     
    });    
});

//login usuario

$(document).ready(function(){
    if (sessionStorage["nombre"]){
      var nombre = sessionStorage["nombre"];
       $('<p>'+ nombre +'</p>').appendTo('#usrnombre');
    }
    else
    {
     $('<p>NN</p>').appendTo('#usrnombre');
    }
});

//buscar el maximo de un plano para luego realizar el alta del mismo
$(document).ready(function(){
    $("#mybtnAlta").click(function(){
        //limpio los campos del formulario
        $("#maxcodigo").val("");
        $("#descplano").val("");
        $("#ubiplano").val("");

        $('#MymodalAltap').modal();
         
        $.ajax({
            method : "GET",
            async:true,
            url:"/maxp",
            dataType : 'json',

            success: function(res){
               //obtengo en la respuesta el maximo y lo muestro en el formulario  
              $("#maxcodigo").val(res).prop('disabled', true);;
           
            }

        });
          
    });
});    

//Alta plano
$(document).ready(function(){
    $("#altaplano").click(function(){
        var codigo =  $("#maxcodigo").val();
        var ubicacion = $("#descplano").val();
        var descripcion = $("#ubiplano").val();
        var logon = sessionStorage["logon"];

        //envio al servidor los datos del formulario
        $.ajax({
            method : "GET",
            async:true,
            url:"/altap",
            dataType : 'json',
            data:{codigo, ubicacion,descripcion,logon},
            success: function(res){
             
            //si la respuesta en correcta oculto el formulario
                if(res == "OK"){
                    $('#MymodalAltap').modal('hide'); 
                }
        
            }

        });
       
    });
});    

$("#altaplano").on( "click", function() {
   
    $('#MymodalAltah').modal('show');  
  
});


//Buscar un plano
$(document).ready(function(){
    $("#bpb").click(function(){
        
        var codigo = $("#codigof").val();
        var descripcion = $("#descripcionf").val();
        var nrorev = $("#nrorevf").val();
        var maxrev;
        $.ajax({
            method : "POST",
            async: true,
            url:"/buscarp",
            dataType : 'json',
            data: {codigo,descripcion,nrorev},
            success: function(respuesta){
                
                $('#examplep').dataTable().fnDestroy();

                table =  $('#examplep').DataTable({     
                    data: respuesta,
                      
                    language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
                    
                    "columns": [
                        {
                        
                            "class":          "details-control",
                            "orderable":      false,
                            "data":           null,
                            "defaultContent": ""
                      
                       
                        } ,
                        
                        { title: "Código","className": "text-center","data": "PLN_CODIGO" },
                      
                        { title: "Descripción","className": "text-left","data": "PLN_DESCRIPCION"},
                        { title: "Nueva Revisión", 
                            "data": null,
                            "className": "text-center",
                            'render': function (data, type, row) {
                                return "<button id='"+JSON.stringify(data)+ "' class='GetNuevaRev fa fa-plus' data-toggle='tooltip' title='Nueva Revisión'/>"
                            }
                        },
                      
                                
                    ],
                       
                    "order": [[1, 'asc']] 
                       
                });    
              
                //modificar la descripcion
                table.MakeCellsEditable({
                    "onUpdate": myCallbackFunction,
                    "inputCss":'my-input-class',
                    "columns": [2],
                    "confirmationButton": { // could also be true
                        "confirmCss": 'my-confirm-class',
                        "cancelCss": 'my-cancel-class'
                    },
                    "inputTypes": []
                }); 

                function myCallbackFunction (updatedCell, updatedRow, oldValue) {
                    console.log("The new value for the cell is: " + updatedCell.data());
                    console.log("The old value for that cell was: " + oldValue);
                    console.log("The values for each cell in that row are: " + JSON.stringify(updatedRow.data()));
                    var codigo = (updatedRow.data().PLN_CODIGO);
                    var descripcion = (updatedRow.data().PLN_DESCRIPCION);
                    

                    $.ajax({
                        method : "GET",
                        async: true,
                        url:"/ModifP",
                        dataType : 'json',
                        data : {codigo,descripcion},
                       

                    })      
                    
                }    
     
                //abrir y cerrar el icono de detalle
                $('#examplep tbody').off('click', 'td.details-control');
                $('#examplep tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                      
                    if (row.child.isShown()) {
                        //fila que esta abierta y la cierro
                        // console.log("fila que esta abierta y la cierro")
                       
                        row.child.hide();
                        tr.removeClass('shown');
                        
                    }
                    else {
                        //abrir fila
                      
                        row.child( formatdetalle(row.data())).show();
                     
                        
                        tr.addClass('shown');
                        
                    } 
                    
                    
                });

               
              
            }

            
        });

       
            
    });

});     

