

//login usuario
$(document).ready(function(){
    if (sessionStorage["nombre"]){
      var nombre = sessionStorage["nombre"];
       $('<p>'+ nombre +'</p>').appendTo('#usrnombre');
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