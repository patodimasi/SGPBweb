
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
                            "<input  style='text-transform: uppercase' type='text' class='form-control' id='nombref' placeholder='' value='' required></input>"+
                        "</div>"+
                        
                       /* "<div class='col-md-4'>"+
                            "<button style='margin-top:35px'>Buscar</button>"+
                         "</div>"+
                         */   
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-12'>"+
                            "<label for='descripcion'><strong> Apellido</strong></label>"+
                            "<input type='text' class='form-control' id='apellidof' placeholder='' value='' required>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                "<div class='col-md-4'>"+
                    "<img style='margin-top:-170px' src='./images/logocolores3.png'>"+
                    /*"<div class='card' style='width: 18rem;margin-top: -10px'>"+
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
                    */
                "</div>"+
            "</div>"+
        "</form>" +
       /* "<div>"+
             "<button type='button' id=mybtnAlta onclick='Btnalta()' class='btn btn-info btn-circle btn-xl' data-toggle='tooltip'  title='Alta Plano'><i class='fa fa-plus'></i>"+
        "</div>"+
        */
        "<div style='margin-top:20px'>"+
            "<button id=bpb type='button' class='btn btn-primary btn-sm'>Buscar</button>"+
            "<button id=bptusuario type='button' style='margin-left:5px' class='btn btn-secondary btn-sm'>Todos</button>"+    
        "</div>"+
         
        "<div style='margin-left: -15px;margin-top: 40px' class='container'>"+
            "<table id='tusuarios' class='display'>" +
                "<tr>"+
                   // "<th style='width: 150px'></th>"+
                    "<th style='width: 250px'></th>"+
                    "<th style='width: 250px'></th>"+
                    "<th style='width: 250px'></th>"+
                    "<th style='width: 250px'></th>"+  
                "</tr>"+
            "</table>"+
        "</div>"   
        
    
    );
        
});

$(document).ready(function(){
    $("#bptusuario").click(function(){
        console.log("llega con el click");
        var table = $('#tusuarios').DataTable({

            language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
            "ajax":{
                "url": "/buscarTodosu",
                "dataSrc":""
            },

            "columns": [
              /*  {
                
                    "class":          "details-control",
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ""
              
               
                } ,
                */
                { title: "Usuario","className": "text-center","data": "USR_LOGON" },
              
                { title: "Nombre","className": "text-center","data": "USR_NOMBRE"},
                { title: "Apellido","className": "text-center","data": "USR_APELLIDO" },
                { title: "Estado","className": "text-center","data": "USR_ESTADO" },   
               
              
                        
            ],

            "order": [[1, 'asc']],

            
        })

       /* $('#tusuarios tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
     
            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        } );
        */
    });
});

