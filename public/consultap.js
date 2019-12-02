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
             "<button type='button' id=mybtnAlta onclick='Btnalta()' class='btn btn-info btn-circle btn-xl' data-toggle='tooltip'  title='Alta Plano'><i class='fa fa-plus'></i>"+
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



