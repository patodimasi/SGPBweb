function format ( d ) {
    console.log(d);
    return '<table class="table">'+
        '<tr class="table-dark text-dark">'+
            '<td>Usuario Alta:</td>'+
            '<td>'+'hhhhhhh'+'</td>'+
        '</tr>'+
       
    '</table>';
}

function formathistorico(rowData){
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
                var oJSON = sortJSON(jsondetalle, 'PLN_NRO_REV', 'desc');
               
                var tbody = '';
                tbody += '<table class="table">';
                tbody += '<thead class="thead-dark">';
                tbody += '<tr>';
                tbody  += '<th>'+'Fecha Alta'+'</th>';
                tbody  += '<th>'+'N°Rev'+'</th>';
                tbody  += '<th>'+'Fecha Aprobación'+'</th>';
                tbody  += '<th>'+'Usuario Aprobación'+'</th>';
                tbody  += '<th>'+'Fecha Recepción'+'</th>';
                tbody  += '<th>'+'Usuario Recepción'+'</th>';
                tbody  += '</tr>';
                tbody += '<thead>';
                
               
               for (var i = 0; i < jsondetalle.length; i++) {
                tbody += '<tr>';
                tbody += '<td>'+jsondetalle[i].PLN_FECHA+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_NRO_REV+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_FECHA_APR+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_USUARIO_APR+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_FECHA_REC+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_USUARIO_REC+'</td>';
                tbody += '</tr>';
              

            }
            
            tbody += '</table>';
            
            
            div
            .html(tbody);   
              
            }
        } );   
    
     return   div;
 
}


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
                    { title: "Descripción","className": "text-left","data": "PLN_DESCRIPCION"},
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

$(document).ready(function(){
    $("#bpb").click(function(){
        var codigo = $("#codigof").val();
        var descripcion = $("#descripcionf").val();
        var nrorev = $("#nrorevf").val();
        
        $.ajax({
            method : "POST",
            async: true,
            url:"/buscarp",
            dataType : 'json',
            data: {codigo,descripcion,nrorev},
            success: function(data){
                $('#examplep').dataTable().fnDestroy();
               // $('#examplep').DataTable().clear();
                table =  $('#examplep').DataTable({ 
                   
                   
                    data: data,
                    language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
                    "columns": [
                        {
                            "className":      'details-control',
                            "defaultContent": '',
                            "data":           null,
                            "orderable":      false

                        } ,  
                        { title: "Código","className": "text-center","data": "PLN_CODIGO" },
                        { title: 'N°Rev',"className": "text-center","data": "PLN_NRO_REV"},
                        { title: "Descripción","className": "text-left","data": "PLN_DESCRIPCION"},
                        {    
                            title: "Ubicación", 
                            "data": null,
                            "className": "text-center",
                            "defaultContent": "<label class='btn btn-light'><input type= 'image' src='./images/carpeta1.png'></label>"
                            
                        },
                        {
                            title: "Tareas", 
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
                    var row = table.row(tr);
                   
                  
                   
                    if (row.child.isShown()) {
                        //fila que esta abierta y la cierro
                        console.log("fila que esta abierta y la cierro")
                      
                        row.child.hide();
                        tr.removeClass('shown');
                      
                    }
                    else {
                        //abrir fila
                        console.log("abrir fila");
                       
                        row.child( formathistorico(row.data())).show();
                       
                        tr.addClass('shown');
                      
                    } 
                    
                  
                });
              
                
            }    

        });    

    }); 
        
});   

