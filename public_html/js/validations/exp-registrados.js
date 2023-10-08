$(document).ready(function () {

    window.url = $('#URL_HOST').val();
    window.token = $('#TOKEN_HOST').val();
    let cacheSeriesData = [];
    let totalExpedientes = 0;
    let altaExpediente = [];

    // ---------------------------------------------------------------------------------------------------
    //                                      CARGA DE CATALAGOS   
    // ---------------------------------------------------------------------------------------------------

    async function get_data(){

        try{

            $("#preloader").css("display", "block");
            let statusCatalagos;
            $.ajax({
                type: "get",
                data:{type: "FULL", _token: window.token, id: null},
                url: window.url + "/get_data",
                dataType: "json",
                async: false,
                crossDomain: true,
                success: function (data) {
                    
                    if(data.CatSeccion){

                        $("#SECCION").html("");
						$("#SECCION").append('<option value="null">Seleccione una opción</option>');
						$.each(data.CatSeccion, function(i, item) {

							$("#SECCION").append('<option value="'+item.codigo_seccion+'" data-descripcion="'+item.descripcion+'">'+item.nombre+'</option>');
						});

                    }else{
                        statusCatalagos = 404;
                    }

                    if(data.CatUnidadAdministrativa){

                        $("#UNIDAD_ADMINISTRATIVA").html("");
						$("#UNIDAD_ADMINISTRATIVA").append('<option value="null">Seleccione una opción</option>');
						$.each(data.CatUnidadAdministrativa, function(i, item) {

							$("#UNIDAD_ADMINISTRATIVA").append('<option value="'+item.codigo_unidad+'">'+item.nombre+'</option>');
						});

                    }else{
                        statusCatalagos = 404;
                    }
    

                    if( data.ERROR || statusCatalagos == 404){
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sin conexión',
                            text:'Algo fallo en la descarga de recursos.',
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: 'Recargar',
                            denyButtonText: 'Salir',
                            allowOutsideClick: false,
                        }).then((result) => {
            
                            if (result.isConfirmed) {
            
                                location.reload(true);
            
                            } else if (result.isDenied) {
                            
                                window.location.href = window.url+"/home";
                            
                            }
                        })
                    }
                    
    
    
                },
                error: function (data) {
                    
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin conexión',
                        text:'Algo fallo en la descarga de recursos.',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Recargar',
                        denyButtonText: 'Salir',
                        allowOutsideClick: false,
                    }).then((result) => {
        
                        if (result.isConfirmed) {
        
                            location.reload(true);
        
                        } else if (result.isDenied) {
                        
                            window.location.href = window.url+"/home";
                        
                        }
                    })

                },
                complete: function () {
                    setTimeout(function () {
                        $("#preloader").fadeOut(500);
                    }, 200);
                    
                }
            });

        
        

        }catch{

            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión',
                text:'Algo fallo en la descarga de recursos.',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Recargar',
                denyButtonText: 'Salir',
                allowOutsideClick: false,
            }).then((result) => {

                if (result.isConfirmed) {

                    location.reload(true);

                } else if (result.isDenied) {
                
                    window.location.href = window.url+"/home";
                
                }
            })
        }

        
        
    }




    
    // ---------------------------------------------------------------------------------------------------
    //                                              LOGICA    
    // ---------------------------------------------------------------------------------------------------

    // Complementar catálago de areas generadoras
    $("#UNIDAD_ADMINISTRATIVA").on("change", function(){  
        let option = $(this).val();
        $(".cat_area_generadora").empty();

        $("#AREA_GENERADORA").val("mull").change();
        $("#AREA_CONTROL_INTERNO").val("null").change();
        $("#preloader").css("display", "block");
        let statusCatalagos;
        $.ajax({
            type: "get",
            data:{type: "AREA_GENERADORA", _token: window.token, id: option},
            url: window.url + "/get_data",
            dataType: "json",
            async: false,
            crossDomain: true,
            success: function (data) {
                
                if(data.CatAreaGeneradora){

                    $("#AREA_GENERADORA").html("");
                    $("#AREA_GENERADORA").append('<option value="null">Seleccione una opción</option>');
                    $.each(data.CatAreaGeneradora, function(i, item) {
                        $("#AREA_GENERADORA").append('<option value="'+item.codigo_area+'">'+item.nombre+'</option>');
                    });

                }else{
                    statusCatalagos = 404;
                }

                if( data.ERROR || statusCatalagos == 404){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin conexión',
                        text:'Algo fallo en la descarga de recursos.',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Recargar',
                        denyButtonText: 'Salir',
                        allowOutsideClick: false,
                    }).then((result) => {
        
                        if (result.isConfirmed) {
        
                            location.reload(true);
        
                        } else if (result.isDenied) {
                        
                            window.location.href = window.url+"/home";
                        
                        }
                    })
                }

            },
            error: function (data) {
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin conexión',
                    text:'Algo fallo en la descarga de recursos.',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Recargar',
                    denyButtonText: 'Salir',
                    allowOutsideClick: false,
                }).then((result) => {
    
                    if (result.isConfirmed) {
    
                        location.reload(true);
    
                    } else if (result.isDenied) {
                    
                        window.location.href = window.url+"/home";
                    
                    }
                })

            },
            complete: function () {
                setTimeout(function () {
                    $("#preloader").fadeOut(500);
                }, 200);
                
            }
        });
    

    });

    // Completar catálago de areas de control interno
    $("#AREA_GENERADORA").on("change", function () {
        let option = $(this).val();
        $(".cat_area_control_interno").empty();
        $("#AREA_CONTROL_INTERNO").val("null").change();
        $("#preloader").css("display", "block");
        let statusCatalagos;
        $.ajax({
            type: "get",
            data:{type: "AREA_INTERNA", _token: window.token, id: option},
            url: window.url + "/get_data",
            dataType: "json",
            async: false,
            crossDomain: true,
            success: function (data) {
                
                if(data.CatAreaInterna){

                    $("#AREA_CONTROL_INTERNO").html("");
                    $("#AREA_CONTROL_INTERNO").append('<option value="null">Seleccione una opción</option>');
                    $.each(data.CatAreaInterna, function(i, item) {
                        $("#AREA_CONTROL_INTERNO").append('<option value="'+item.codigo_area_interna+'">'+item.nombre+'</option>');
                    });


                   

                }else if(data.EMPTY){
                    $("#AREA_CONTROL_INTERNO").html("");
                    $("#AREA_CONTROL_INTERNO").append('<option value="null">Seleccione una opción</option>');
                    $("#AREA_CONTROL_INTERNO").append('<option value="N/A" selected>N/A</option>');

                 }else{
                     statusCatalagos = 404;
                 }

                if( data.ERROR){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sin conexión',
                        text:'Algo fallo en la descarga de recursos.',
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: 'Recargar',
                        denyButtonText: 'Salir',
                        allowOutsideClick: false,
                    }).then((result) => {
        
                        if (result.isConfirmed) {
        
                            location.reload(true);
        
                        } else if (result.isDenied) {
                        
                            window.location.href = window.url+"/home";
                        
                        }
                    })
                }

            },
            error: function (data) {
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin conexión',
                    text:'Algo fallo en la descarga de recursos.',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Recargar',
                    denyButtonText: 'Salir',
                    allowOutsideClick: false,
                }).then((result) => {
    
                    if (result.isConfirmed) {
    
                        location.reload(true);
    
                    } else if (result.isDenied) {
                    
                        window.location.href = window.url+"/home";
                    
                    }
                })

            },
            complete: function () {
                setTimeout(function () {
                    $("#preloader").fadeOut(500);
                }, 200);
                
            }
        });
    

    });




    
});

