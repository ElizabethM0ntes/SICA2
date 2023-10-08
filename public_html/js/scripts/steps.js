$('#first').show();
$('#second').hide();
$('#third').hide();
$('#fourth').hide();

$('span').click(function() {
  if ($(this).hasClass('first')) {
    $(this).nextAll().removeClass('border-change');
    $('#nprogress-bar').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#first').show();
    $('#second').hide();
    $('#third').hide();
    $('#fourth').hide();
  } else if ($(this).hasClass('second')) {
    $(this).nextAll().removeClass('border-change');
    $(this).prevAll().addClass('border-change');
    $(this).addClass('border-change');
    $('#nprogress-bar').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#second').show();
    $('#first').hide();
    $('#third').hide();
    $('#fourth').hide();
  } else if ($(this).hasClass('third')) {
    $(this).nextAll().removeClass('border-change');
    $(this).prevAll().addClass('border-change');
    $(this).addClass('border-change');
    $('#nprogress-bar').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#second').hide();
    $('#first').hide();
    $('#fourth').hide();
    $('#third').show();
  } else {
    $(this).addClass('border-change');
    $(this).prevAll().addClass('border-change');
    $('#nprogress-bar').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#third').hide();
    $('#first').hide();
    $('#fourth').show();
  }
});

// segundo steps

$('#primero').show();
$('#segundo').hide();
$('#tercero').hide();

$('span').click(function() {
  if ($(this).hasClass('primero')) {
    $(this).nextAll().removeClass('border-change');
    $('#barra-proceso').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#primero').show();
    $('#segundo').hide();
    $('#tercero').hide();
  } else if ($(this).hasClass('segundo')) {
    $(this).nextAll().removeClass('border-change');
    $(this).prevAll().addClass('border-change');
    $(this).addClass('border-change');
    $('#barra-proceso').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#segundo').show();
    $('#primero').hide();
    $('#tercero').hide();
  } else {
    $(this).addClass('border-change');
    $(this).prevAll().addClass('border-change');
    $('#barra-proceso').css('background-image', 'url(img/logos/check_etapas.svg)');
    
    $('#tercero').show();
    $('#primero').hide();
    $('#segundo').hide();
  }
});
