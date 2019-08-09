
function colorestado(estado){
    reultado = '';
    if(estado == 'V'){
        resultado = '<img src="./images/details_green.png">';
    }
    if(estado == 'A'){
        resultado = '<img src="./images/details_yellow.png">';
    }
    if(estado == 'R'){
        resultado = '<img src="./images/details_red.png">';
    }
    return resultado;
}

function formatdetalle(rowData){
    console.log(rowData.PLN_CODIGO)
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
                tbody += '<table class="table">';
                tbody += '<thead class="thead-dark">';
                tbody += '<tr>';
                tbody  += '<th>'+'Estado' +'</th>';
                tbody  += '<th>'+'F.Alta'+'</th>';
                tbody  += '<th>'+'N°Rev'+'</th>';
                tbody  += '<th>'+'F.Aprobación'+'</th>';
                tbody  += '<th>'+'U.Aprobación'+'</th>';
                tbody  += '<th>'+'Ubicación'+'</th>';
                tbody  += '</tr>';
                tbody += '<thead>';

                for (var i = 0; i < jsondetalle.length; i++) {
                    tbody += '<tr>';
                    tbody += '<td>'+ colorestado(jsondetalle[i].PLN_ESTADO) + '</td>';
                    tbody += '<td>'+jsondetalle[i].PLN_FECHA+'</td>';
                    tbody += '<td>'+jsondetalle[i].PLN_NRO_REV+'</td>';
                    tbody += '<td>'+jsondetalle[i].PLN_FECHA_APR+'</td>';
                    tbody += '<td>'+jsondetalle[i].PLN_USUARIO_APR+'</td>';
                    tbody += '<td>'+"<label class='btn btn-light'><input type= 'image' src='./images/carpeta1.png'></label>"+'</td>';
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

$(document).ready(function(){
    $("#AbrirUP").click(function(){
        window.open("/archi");
    });
})



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
                "columns": [3],
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
                    tr.addClass('shown');
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

//maximo plano
$(document).ready(function(){
    $("#mybtnAlta").click(function(){
       
        $('#MymodalAlta').modal();
         var hola = "f";
        $.ajax({
            method : "GET",
            async:true,
            url:"/maxp",
            dataType : 'json',

            success: function(res){

              console.log(res);
             
              $("#maxcodigo").val(res).prop('disabled', true);;
           
            }

        });
          
    });
});    

//alta plano
$(document).ready(function(){
    $("#altaplano").click(function(){
        var codigo =  $("#maxcodigo").val();
        var ubicacion = $("#descplano").val();
        var descripcion = $("#ubiplano").val();
        var logon = sessionStorage["logon"];

        $.ajax({
            method : "GET",
            async:true,
            url:"/altap",
            dataType : 'json',
            data:{codigo, ubicacion,descripcion,logon},
            success: function(res){
             
            console.log(res);
            if(res == "OK"){
                $("#encabezado_alta").css({'background':'aqua'}); 
                $("#body_alta").text(" " + " "+ "El plano" + " " + codigo +" "+ "se dio de alta satisfactoriamente.");  
            }
            else{
                $("#encabezado_alta").css({'background':'tomato'});
                $("#body_ap").text(" " + " "+ "El plano" + " " + codigo +" "+ "no se pudo dar de alta.");
            }
           
            }

          });
          
    });
});    

//limpiar modal cerrar formulario alta
$(document).ready(function(){
    $("#CerrarAlta").on("click",function(event){ 
        $("#descplano").val('');
        $("#ubiplano").val('');
    });
});

//maximo revision json
function getMax(arr, prop) {
 
   /* if (arr.length != 0){
      
        for (var i=0 ; i<arr.length ; i++) {
            if (!max || arr[i][prop] > max[prop])
                max = arr[i];
        }
        return [max];
    }
    else{
      
     
        return max = [];
    }
   */
}

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
              
                //console.log(respuesta);
                $('#examplep').dataTable().fnDestroy();

                table =  $('#examplep').DataTable({     
                    data: respuesta,
                    language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},

                    createdRow: function( row, data, dataIndex ) 
                    {  
                
                        if (data.PLN_ESTADO == "A")
                        {
                            $( row ).find('td:eq(0)').addClass('detailsA-control');
                        }
                        if(data.PLN_ESTADO == "V"){
                            $( row ).find('td:eq(0)').addClass('details-control');
                        }
                        if(data.PLN_ESTADO == "R"){
                            $( row ).find('td:eq(0)').addClass('detailsR-control');
                        }
                        
                    },
                    "columns": [
                        {
                        
                        "orderable":      false,
                        "data":           null,    
                        "defaultContent": ''
                                            

                        } ,
                        
                        { title: "Código","className": "text-center","data": "PLN_CODIGO" },
                        { title: 'N°Rev',"className": "text-center","data": "PLN_NRO_REV"},
                        { title: "Descripción","className": "text-center","data": "PLN_DESCRIPCION"},
                        {    
                        title: "Ubicación", 
                        "data": null,
                        "className": "text-center",
                        "defaultContent": "<label class='btn btn-light' id='myBtn' data-toggle='tooltip' data-placement='top' title='Ubicación' ><input type= 'image' src='./images/carpeta1.png'></label>"
                        
                        },
                        {
                            title: "Tareas", 
                            "data": null,
                            "className": "text-center",
                            "defaultContent": "<div class='btn-group' "+ 
                            "role='group' aria-label='Basic example'> "+
                            "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' id='myBap' title='Aprobar'><input type= 'image' src='./images/recibir.png'></label>"+
                            "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' id= 'myBsp' title='Nueva Revisión'><input type= 'image' src='./images/icons8-agregar-archivo-24.png'></label>"
                        
                                        
                        }
                        
                    ],
                    
                
                    "order": [[1, 'asc']] 
                    
                });    
            
                //modificar la descripcion
                table.MakeCellsEditable({
                    "onUpdate": myCallbackFunction,
                    "inputCss":'my-input-class',
                    "columns": [3],
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

                //abrir y cerrar el icono de detalle
                $('#examplep tbody').off('click', 'td.details-control, td.detailsA-control,td.detailsR-control');
                $('#examplep tbody').on('click', 'td.details-control, td.detailsA-control,td.detailsR-control', function () {
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
                        // console.log("abrir fila");
                        
                        row.child( formatdetalle(row.data())).show();
                        
                        tr.addClass('shown');
                        
                    } 
                    
                    
                });
            
            }
        });    
    });   
});    

