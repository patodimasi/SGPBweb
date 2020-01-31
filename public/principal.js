class Permiso_usu {
    constructor(alta, rechazar, nuevarev, aprobar,modifdes,usuario) {
        this.alta = alta;
        this.rechazar = rechazar;
        this.nuevarev = nuevarev;
        this.aprobar = aprobar;
        this.modifdes = modifdes;
    }
}


//login usuario
$(document).ready(function(){
    if (sessionStorage["nombre"]){
      var nombre = sessionStorage["nombre"];
      var foto = sessionStorage["foto"];
      //console.log(foto);
       $('<p>'+ nombre +'</p>').appendTo('#usrnombre');
       if(foto == ""){
        $("#imagenf").attr('src',"./images/user.jpg");
       }
       else{
          
          $("#imagenf").attr('src',foto);
        }
    }
    else
    {
     $('<p>NN</p>').appendTo('#usrnombre');
     
     $("#pantallap").addClass("disabledbutton");
       
    }
});

// manejo de la sidebar
$(document).ready(function() {
    $('div#dconsultas').show();
    $('body').on('click','a.personal-menu-item', function(e) {
        e.preventDefault();
    
    var selectedItem = $(this).attr('data-menu-item'); 
    var $selected = $('#' + selectedItem).show();
    $('.contents > div').not($selected).hide();
  
   });
   
})

function obtener_logon(){
    var codigo = sessionStorage["codigo"];
    //console.log("Esto es el codigo" + " " + codigo);
    //una vez que obtengo el logon pido los permisos del usuario al servidor
   //
   var usuario;
    $.ajax({
        method : "GET",
        async: false,
        url:"/mostrar_usu",
        dataType : 'json',
        data: {codigo},
       
        success: function(respuesta){
          //  console.log("estos son los datos del usuario" + " " + respuesta[0].PER_CODIGO);
            //console.log(respuesta[0].PER_INGJ);

                if(respuesta[0].PER_INGJ == "S"){
                    usuario = new Permiso_usu(' ','disabled','disabled','disabled',' ','none'); 
                }
                if (respuesta[0].PER_INGS == "S"){
                    usuario = new Permiso_usu(' ',' ',' ',' ',' ','none'); 
                }
                if (respuesta[0].PER_CC == "S"){
                    usuario = new Permiso_usu('disabled','disabled ','disabled','disabled','disabled','none'); 
                }
                if (respuesta[0].PER_P == "S"){
                    usuario = new Permiso_usu('disabled','disabled ','disabled','disabled','disabled','none'); 
                }
                if (respuesta[0].PER_ADMIN == "S"){
                    usuario = new Permiso_usu('disabled','disabled ','disabled','disabled','disabled','none'); 
                }
                if (respuesta[0].PER_ROOT == "S"){
                    console.log("llega aca");
                    usuario = new Permiso_usu(' ',' ',' ',' ',' ',' '); 
                    $('#liusuarios').css('display', '');
                }
        }
       
    })
    return  usuario;
}


$(document).ready(function(){
   
    $("#but_upload").click(function(){
      console.log("llega al but_uploadad");
       var fd = new FormData();
       var files = $('#file')[0].files[0];
       var nombre = sessionStorage["logon"];
       console.log(nombre);
       fd.append('file',files);
       
       $.ajax({
            //url: '/upload',
            //url:"/upload?nombre="+nombre,
            url:"/upload?"+nombre,
            method: 'post',
            data: fd,      
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
            console.log("upload sucess" + " " + data.data);
            $("#imagenf").attr('src',data.data);
            console.log($("#imagenf"));
            
            },
            error: function(data){
                console.error(data);
            }
        });
     
    });
    
})

