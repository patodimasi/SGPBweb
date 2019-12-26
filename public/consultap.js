var permisos_usu = obtener_logon();

var myDictionary = new Object();
myDictionary["V"] = {"imagen": "./images/details_green.png", "aprobar": "disabled","rechazar": " "};
myDictionary["A"] = {"imagen": "./images/details_yellow.png", "aprobar": " ","rechazar": "disabled"};
myDictionary["R"] = {"imagen" : "./images/details_red.png", "aprobar": "disabled","rechazar": "disabled"};


$(document).ready(function(){
 
    $("#dconsultas").html("<div class='row'>" +
            "<div class='form-group col-md-12'>" +
                "<h2>Consulta Planos</h2>" +
            "</div>"+
        "</div>"+
        "<div class='row'>"+
        "</div>" +
        "<hr>" +
        
       "<form class='form'>" +
            "<div class='row'>"+
                "<div class='col-md-8'>"+
                    "<div class='row'>"+
                        "<div class='col-md-6'>"+
                            "<label for='codigo'><strong>Código</strong></label>"+
                            "<input  style='text-transform: uppercase' type='text' class='form-control' id='codigof' placeholder='' value='' required></input>"+
                        "</div>"+
                        "<div class='col-md-6'>"+
                            "<label  for='nrorev'><strong>NroRev</strong></label>"+
                            "<input  type='number' class='form-control' id='nrorevf' placeholder='' value='' required></input>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-12'>"+
                            "<label for='descripcion'><strong> Descripción</strong></label>"+
                            "<input type='text' class='form-control' id='descripcionf' placeholder='' value='' required>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                "<div class='col-md-4'>"+
                    "<img style='margin-top:-170px' src='./images/logocolores3.png'>"+
                    "<div class='card' style='width: 18rem;margin-top: -10px'>"+
                        "<div class='card-header'>"+
                            "<strong>Estados</strong>"+ 
                        "</div>"+
                        "<ul class='list-group list-group-flush'>"+
                            "<li class='list-group-item'> <img src='./images/details_green.png'>"+
                                "Planos vigentes" +
                            "</li>"+
                            "<li class='list-group-item'><img src='./images/details_yellow.png'>"+
                                " Planos pendiente de aprobación"+
                                
                            "</li>"+
                            "<li class='list-group-item'><img src='./images/details_red.png'>"+
                                " Planos no vigentes"+
                            "</li>"+
                        "</ul>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</form>" +
        "<div>"+
             "<button  type='button' "+permisos_usu.alta+" id=mybtnAlta onclick='Btnalta()' class='btn btn-info btn-circle btn-xl' data-toggle='tooltip'  title='Alta Plano'><i class='fa fa-plus'></i>"+
        "</div>"+
        "<div style='margin-top:20px'>"+
            "<button id=bpb type='button' onclick='Consulta(codigof,nrorevf,descripcionf)' class='btn btn-primary btn-sm'>Buscar</button>"+
            "<button id=bpt type='button' onclick='Consultat()'style='margin-left:5px' class='btn btn-secondary btn-sm'>Todos</button>"+    
        "</div>"+
        "<div style='margin-left: -15px;margin-top: 40px' class='container'>"+
            "<table id='examplep' class='display'>" +
                "<thead>" +
                    "<tr>"+
                    
                        "<th style='width: 5px'></th>"+
                        "<th style='width: 70px'></th>"+
                        "<th style='width: 350px'></th>"+
                        "<th style='width: 70px'></th>"+  
                    "</tr>"+
                "</thead>" +
                "<tbody>"+

                "</tbody>"+
            "</table>"+
        "</div>"   
        
    
    );
        

});

//-----------------------------------------------------------------------------------------------------------------------------------
//Consulta un solo plano viene del button bpb

function Consulta(codigo,nrorev,descripcion){
    //console.log("LLEGA ")
    var codigo = codigo.value;
    var descripcion = descripcion.value;
    var nrorev = nrorev.value;
   
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
                    
                    { title: "Código","className": "text-center","data": "PLN_CODIGO"},
                  
                    { title: "Descripción","className": "text-left","data": "PLN_DESCRIPCION"},
                    { title: "Nueva Revisión", 
                        "data": null,
                        "className": "text-center",
                        'render': function (data, type, row) {
                            return "<button "+permisos_usu.nuevarev+" id='"+JSON.stringify(data)+ "' onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                        }
                    },
                  
                            
                ],
                   
                "order": [[1, 'asc']] ,
             
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
                    row.child.hide();
                    tr.removeClass('shown');
                    
                }
                else {
                  
                    row.child( Formatdetalle(row.data())).show();
                    tr.addClass('shown');
                    
                } 
                
                
            });      
          
        }

    }); 
         
 };

//-----------------------------------------------------------------------------------------------------------------------------------
//Detalle de cada plano

function Formatdetalle(rowData){
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
                function sortJSON(data, key, orden) {
                    return data.sort(function (a, b) {
                        var x = a[key],
                        y = b[key];
                
                        if (orden === 'asc') {
                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        }
                
                        if (orden === 'desc') {
                            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                        }
                    });
                }
              
                var oJSON = sortJSON(jsondetalle, 'PLN_NRO_REV', 'asc');

                var tbody = '';
                tbody += '<table id="tabledetalle" class="table">';
                tbody += '<thead class="thead-dark">';
                tbody += '<tr>';
                tbody  += '<th style=" text-align: center">'+'Estado' +'</th>';
                tbody  += '<th style=" text-align: center">'+'N°Rev'+'</th>';
                tbody  += '<th style=" text-align: center">'+'F.Alta'+'</th>';
                tbody  += '<th style=" text-align: center">'+'U.Alta'+'</th>';
                tbody  += '<th style=" text-align: center">'+'F.Aprobación'+'</th>';
                tbody  += '<th style=" text-align: center">'+'U.Aprobación'+'</th>';
                tbody  += '<th style=" text-align: center">'+'&nbsp;&nbsp;Ubicación'+'</th>';
                tbody  += '<th style=" text-align: center">'+'&nbsp;&nbsp;&nbsp;Tareas'+'</th>';
                tbody  += '</tr>';
                tbody += '<thead>';

                for (var i = 0; i < jsondetalle.length; i++) {
                    var diccionario = Mostrar_detalle(jsondetalle[i].PLN_ESTADO,permisos_usu.aprobar,permisos_usu.rechazar);
                 
                    tbody += '<tr style=" text-align: center">';
                    tbody += '<td>'+"<img id='"+jsondetalle[i]._id+"' src='"+diccionario.imagen+"' >"+'</td>';
                 
                    tbody +=  '<td><span rel="tooltip" data-toggle="tooltipcom" data-placement="top" title="'+jsondetalle[i].PLN_COMENTARIO+'"  class="souligne">'+jsondetalle[i].PLN_NRO_REV+'</span></td>';


                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_FECHA+'</td>';
                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_USUARIO_ALTA+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybfa'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_FECHA_APR+'</label>'+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybua'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_USUARIO_APR+'</label>'+'</td>';
                 
                    var boton =  Existe_ubicacion(jsondetalle[i].PLN_UBICACION);
                    tbody += '<td>'+"<button id='mybtnubi"+"/"+jsondetalle[i]._id + "' ' "+boton+" ' style='margin-left: 17px;border-width: 1px' onclick='Abrirup(this)' class='Abrirup fa fa-folder-open data-toggle='tooltip' title='Ubicación'/>" + 
                             "<button id='mybtnmodifubi"+"/"+jsondetalle[i]._id + "' onclick='Mostrarmodif(this)' "+permisos_usu.modifdes+" class='GetModifUbi fa fa-pencil-square' data-toggle='tooltip' title='Modificar Ubicación'></button>" +  '</td>';
                             
                 /*   tbody += '<td>'+"<button id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "'  ' " + myString.deshabilitar_e +" '  style='margin-left: 11px;border-width: 1px' onclick='Aprobar(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                                  "<button id='"+jsondetalle[i]._id+ "' style='border-width: 1px' ' " + myString.deshabilitar_r +" ' onclick='Rechazar(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
                             '</td>';
                   */
                    tbody += '<td>'+"<button id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "'  ' " + diccionario.aprobar +" '  style='margin-left: 11px;border-width: 1px' onclick='Aprobarp(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                                "<button id='"+jsondetalle[i]._id+ "' style='border-width: 1px' ' " + diccionario.rechazar +" ' onclick='Rechazarp(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
                            '</td>';
                   
                    tbody += '</tr>';
                    

                }
                
                tbody += '</table>';

                $('body').tooltip({
                    selector: '[data-toggle="tooltipcom"]'
                   
                });
               
                div
                .html(tbody)
                .removeClass( 'loading' );
            
                
            }
            
        })   
            
     return   div;
     
}
// -------------------------------------------------------------------------------------------------------------------
// ------------------Todo lo referente a PERMISO usuario, existe ubicacion y Actualizar detalle en la tabla ----------
// en esta funcion me fijo si esta habilitado el permiso, el estado v,a,r y si existe la ubicacion
function Mostrar_detalle(estado,permiso_apro,permiso_rech){
   if (permiso_apro == 'disabled'){
        myDictionary[estado].aprobar =  "disabled";
   }
   if(permiso_rech == 'disabled'){
        myDictionary[estado].rechazar =  "disabled";
   }
 
   return myDictionary[estado];
}

function Existe_ubicacion(idubicacion){
    var boton = null;

    if(idubicacion == ""){

        boton =  'disabled';
    }
     else{
       
        boton =  "";
    }
 
     return boton;
}  

// -------------------------------------------------------------------------------------------------------------------
// ------------------Todo lo referente a APROBAR un documento y Actualizar detalle en la tabla -----------------------
function Aprobarp(item){
    infodp = $(item).attr("id");
  
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
    
}

//Actualizar la informacion en la tabla una vez que apruebo el documento
function Actualizar_detalle(jsondetalle){

    for(var i = 0;i < jsondetalle.length;i++){
        var myString = (Colorestado(jsondetalle[i].PLN_ESTADO));
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

function Colorestado(estado){
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

// ---------------------------------------------------------------------------------------------------------------------------------
// ------------------ Rechazar un documento ----------------------------------------------------------------------------------------
function Rechazarp(item){  
    //En esta funcion lo que ago es cambiar el estado de verde a rojo y bloquear el boton
    inforp = $(item).attr("id");
    
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
    
}
// ---------------------------------------------------------------------------------------------------------------------------------
// ------------------ Busca todos los documentos ------------------------------------------------------------------------------------
function Consultat(){
    $('#examplep').dataTable().fnDestroy();
           
    var table = $('#examplep').DataTable({
       
        language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
        "ajax":{
            "url": "/buscarTodosp",
            "dataSrc":""
        },
      
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
                    return "<button id='"+JSON.stringify(data)+ "' class='GetNuevaRev fa fa-plus'/>"
                }
            },
          
                    
        ],

        "order": [[1, 'asc']],
      
        
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
              
                row.child( Formatdetalle(row.data())).show();
             
                
                tr.addClass('shown');
                
            } 
            
            
        });

} 
// ---------------------------------------------------------------------------------------------------------------------------------
// ------------------ Abrir , modificar una ubicacion y copiar una ruta ------------------------------------------------------------

function Abrirup(item){
    infoubi = $(item).attr("id");
    id_ubi = infoubi.split("/")[1];
    $.ajax({
        method : "GET",
        async: true,
        url:"/getUbicacion",
        dataType : 'json',
        data: {id_ubi},
            
        success: function(respuesta){
         
           if(respuesta.resultado == "OK"){
               
                var varUrl = respuesta.url + '?ubi=' + respuesta.ubicacion;
               
                console.log("Es la varURL" + " " + varUrl);
                
                window.open(varUrl,'_blank');
           }
           else{ 
               console.log("llega no aca");
             //  $('#myModalubi').modal();
               
               var mymodalubi = $('#myModalubi');
               mymodalubi.find('.modal-body').text('La ubicación del plano no existe').attr('style', 'text-align: center','bold').css('font-weight','Bold');
               mymodalubi.modal('show');
           }
           
           
        }

    })
}
// ---------------------------------------------------------------------------------------------------------------------------------
// ------------------ Alta, de un documento visualizacion del formulario -----------------------------------------------------------
//Se muestra el formulario con el maximo del documento encontrado,este formulario se encuentra en el principal por que es comun a todos
//Este boton se encuentra en los consulta de cada documento
//Busca el maximo de un plano
function Btnalta(){
    console.log("LLEGA")
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
}

//se realiza el alta del documento en la base de datos
function Altadoc(){
    $('#MymodalAltah').modal('show'); 
    var codigo =  $("#maxcodigo").val();
    var ubicacion = $("#ubiplano").val();
    var descripcion = $("#descplano").val();
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
   
}
// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Nueva Revision, de un documento, muetra en pantalla la nueva revision y la acepta  ---------------------------
//Muestra la nueva revision
function NuevaRev(item){
    $('#myModal1').modal();
   
    infodp = JSON.parse($(item).attr("id"));
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
    $("#Textarearev").val(" ");

    $("#nuevarevp").val(infodp.PLN_NRO_REV + 1);
    $("#descripcion_nrp").val(infodp.PLN_DESCRIPCION);
    $("#fechaaltanrp").val(fecha);
}

//Confirma la nueva revision
function Confirmarnr(){
    $('#myModal2').modal('show'); 
    var logon = sessionStorage["logon"];

    var PLN_FECHA  =  $("#fechaaltanrp").val();
    var PLN_CODIGO =  $("#codigonr").val();
    var PLN_DESCRIPCION =  $("#descripcionnr").val();
    var PLN_NRO_REV =  parseInt($("#nuevarevp").val());
    var PLN_ESTADO = "A";
    var PLN_USUARIO_ALTA = logon;
    var PLN_USUARIO_APR =  "";
    var PLN_FECHA_APR =  "";
    var PLN_UBICACION = "";
    var PLN_COMENTARIO = $("#Textarearev").val();
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/confirmar_nuevarev_p",
        dataType : 'json',
        data:{ PLN_FECHA,PLN_CODIGO,PLN_DESCRIPCION,PLN_NRO_REV,PLN_ESTADO,PLN_USUARIO_ALTA,PLN_USUARIO_APR,PLN_FECHA_APR,PLN_UBICACION,PLN_COMENTARIO},

        success: function(res){ 
            if (res == "OK"){
                console.log("llega");
                
                Consulta(codigof,nrorevf,descripcionf)
            }   
        }
        
    })
  
    $('#myModal1').modal('hide');  

}

// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Modificar una ubicacion muestra el formulario para modificar y acepta la modificacion-------------------------
//Formulario de modificacion
function Mostrarmodif(item){
    $('#myModalU').modal();
    infoubi = $(item).attr("id");
    id_p = (infoubi.split('/')[0]);
    var ubiplano = (infoubi.split('/')[1]);
    window["ubiplano"] = ubiplano;
    console.log("primer id" + " " + ubiplano);
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/modif_ubi",
        dataType : 'json',
        data:{ubiplano},

        success: function(res){ 
            $('#ubicacionp').val(res);
           
        }
    });

}

//Aeptar ubicacion
function Aceptarmodif(){
    $('#myModalubiok').modal('show');
 
    aceptar_ubip = window["ubiplano"];
    ubi_modifp = $('#ubicacionp').val();
 
    $.ajax({
        method : "GET",
        async:true,
        url:"/aceptarmodif_ubi",
        dataType : 'json',
        data:{aceptar_ubip,ubi_modifp},

        success: function(res){
            var modal = $('#myModalubiok');

            if (res  == "OK"  ){
                console.log("llega");
                modal.find('.modal-bodyp strong').text('La modificación de la ubicación del plano se realizo correctamente');
            }
            else{
                modal.find('.modal-bodyp').text('Error al modificar la ubicación del plano');
            }
        }

    })

    $('#myModalU').modal('hide');  
   

}
// ---------------------------------------------------------------------------------------------------------------------------------  
// Activa el "enter"
$(document).ready(function(){
    $("#codigof").keydown(function(e){ 
        if(e.which === 13){
            Consulta(codigof,nrorevf,descripcionf);
        }
    });

    $("#nrorevf").keydown(function(e){
        if(e.which === 13){
            Consulta(codigof,nrorevf,descripcionf);
        }
    });
    
    $("#descripcionf").keydown(function(e){
        if(e.which === 13){
            Consulta(codigof,nrorevf,descripcionf);
        }
    });
});    



