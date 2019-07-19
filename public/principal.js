function colorestado(superado,estado){
    resultado  = '';
    if(superado == 'NS'){
        if((estado == "PR") || (estado == "PA")){
            //return '<img src="./images/details_yellow.png">';
            resultado = '<img src="./images/details_yellow.png">';
        }      
        else{
           // return '<img src="./images/details_green.png">';
           resultado = '<img src="./images/details_green.png">';
        }
    }
    if(superado == 'S'){
        //return '<img src="./images/details_red.png">';
        resultado = '<img src="./images/details_red.png">';
    }

   return resultado;
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
                tbody  += '<th>'+'Estado' +'</th>';
                tbody  += '<th>'+'F.Alta'+'</th>';
                tbody  += '<th>'+'N°Rev'+'</th>';
                tbody  += '<th>'+'F.Aprobación'+'</th>';
                tbody  += '<th>'+'U.Aprobación'+'</th>';
                tbody  += '<th>'+'F.Recepción'+'</th>';
                tbody  += '<th>'+'U.Recepción'+'</th>';
                tbody  += '<th>'+'Descripción'+'</th>';
                tbody  += '<th>'+'Ubicación'+'</th>';
                tbody  += '</tr>';
                tbody += '<thead>';
                
               
               for (var i = 0; i < jsondetalle.length; i++) {
                tbody += '<tr>';
                tbody += '<td>'+ colorestado(jsondetalle[i].PLN_SUPERADO,jsondetalle[i].PLN_ESTADO) + '</td>';
                tbody += '<td>'+jsondetalle[i].PLN_FECHA+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_NRO_REV+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_FECHA_APR+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_USUARIO_APR+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_FECHA_REC+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_USUARIO_REC+'</td>';
                tbody += '<td>'+jsondetalle[i].PLN_DESCRIPCION+'</td>';
                tbody += '<td>'+"<label class='btn btn-light'><input type= 'image' src='./images/carpeta1.png'></label>"+'</td>';
                tbody += '</tr>';
              
            }
            
            tbody += '</table>';
           
            
            div
            .html(tbody)
            .removeClass( 'loading' );
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
                
                table =  $('#examplep').DataTable({ 
                    
                    data: data,
                    
                    language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},

                    createdRow: function( row, data, dataIndex ) 
                    {  
                
                        if (data.PLN_ESTADO != "AC")
                        {
                            console.log("distinto");
                            $( row ).find('td:eq(0)').removeClass('details-control');
                            $( row ).find('td:eq(0)').addClass('detailsA-control');
                        }

                        // Set the data-status attribute, and add a class
                        
                        //    .attr('data-status', data.status ? 'locked' : 'unlocked')
                        //    .addClass('asset-context box');
                    },
                    
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
                            "defaultContent": "<label class='btn btn-light' id='myBtn' data-toggle='tooltip' data-placement='top' title='Ubicación' ><input type= 'image' src='./images/carpeta1.png'></label>"
                        
                        },
                        
                        {
                            title: "Tareas", 
                            "data": null,
                            "className": "button",
                            "defaultContent": "<div class='btn-group' "+ 
                            "role='group' aria-label='Basic example'> "+
                            "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' id='myBap' title='Aprobar'><input type= 'image' src='./images/recibir.png'></label>"+
                            "<label class='btn btn-light' data-toggle='tooltip' data-placement='top' title='Recibir'><input type= 'image' src='./images/icons8-recibir-24.png'></label>"+
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

                    var codigo = data[0].PLN_CODIGO
                    var descripcion = data[0].PLN_DESCRIPCION
                    console.log(codigo);
                    console.log(descripcion);
                    $.ajax({
                        method : "GET",
                        async: true,
                        url:"/ModifP",
                        data : {codigo,descripcion},

                        success: function(respuesta){


                        }

                    })      
                }

                function destroyTable() {
                    if ($.fn.DataTable.isDataTable('#myAdvancedTable')) {
                        table.destroy();
                        table.MakeCellsEditable("destroy");
                    }

                }

                function clear_modifp() {
                    $("#ubicacion").val("");
                    $("#Resubi").text("");
                    $("#divlapiz").hide();
                }
                
                $('#examplep tbody').on("click", "#myBtn", function(){
                    clear_modifp()  
                    $('#myModal').modal();          
                    
                 });   

             
                $(document).ready(function(){
                    $('#examplep tbody').on("click", "#myBap", function(){
                   
                    $('#modalp_a').modal();

                    var codigo = $(this).parents("tr").find("td").eq(1).html();
                    var descripcion = $(this).parents("tr").find("td").eq(3).html();
                 
                     
                    $("#codigo_ap").val(codigo).prop('disabled', true);
                    $("#descripcion_ap").val(descripcion).prop('disabled', true); 

                    console.log(codigo);
                        $.ajax({
                            method : "GET",
                            async: true,
                            url:"/aprobar_p",
                            data : {codigo},

                            success: function(respuesta){
                                if(respuesta == "NO_OK"){
                                   
                                   $("#body_ap").text(" " + " " + "El plano" + " " + codigo +" "+ "no esta en condiciones de ser aprobado.").prepend('<img src="images/icons8-spam-16.png" />').addClass("alert alert-danger");     
                                }
                                if(respuesta == "OK"){
                                    $("#body_ap").text(" " + " "+ "El plano" + " " + codigo +" "+ "se aprobó satisfactoriamente.").prepend('<img src="images/icons8-comprobado-16.png" />').addClass("alert alert-success");     
                                }
                                if(respuesta == "ERROR"){
                                    $("#body_ap").text(" " + " " + "Error al aprobar el plano" + " " + codigo).prepend('<img src="images/icons8-cancelar-16.png" />').addClass("alert alert-danger");     
                                }

                            }
                        });
                   
             
                    });    
                   

                 });   

                
                $(document).ready(function(){
                    $("#imglapiz").unbind('click');
                    $("#imglapiz").click(function(){
                        if ($("#divlapiz").css('display') == 'none'){
                            $("#divlapiz").show();
                               // $("#aupa").attr("href", data[0].PLN_UBICACION);
                                $("#ubicacion").val(data[0].PLN_UBICACION);
                        }
                        else{
                            $("#divlapiz").hide();
                        }
                   
                    });
                });

               
                $(document).ready(function(){
                    $("#Aup").click(function(){
                      
                        var ubicacion = $("#ubicacion").val();
                        var plano = data[0].PLN_CODIGO;
                       
                       
                        $.ajax({
                            method : "GET",
                            async: true,
                            url:"/botonUP",
                            data : {plano,ubicacion},
                           
                            success: function(respuesta){
                                console.log(respuesta);
                                if(respuesta == "OK"){
                                    data[0].PLN_UBICACION = ubicacion;
                                    data[0].PLN_CODIGO = plano;
                                   $("#Resubi").text("La ubicación del plano" + " " + plano + " " + "se modifico satisfactoriamente")
                                }
                            }

                        });    
                        
                    });   
                });    

                $('#examplep tbody').off('click', 'td.details-control, td.detailsA-control');
                $('#examplep tbody').on('click', 'td.details-control, td.detailsA-control', function () {
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