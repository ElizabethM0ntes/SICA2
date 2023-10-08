//MUESTRA CERRADO EL MENU LATERAL Y LO ABRE
document.addEventListener("DOMContentLoaded", function(event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId),
          bodypd = document.getElementById(bodyId),
          headerpd = document.getElementById(headerId)

    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      // Agrega las clases al cargar la página para que el menú aparezca abierto
      nav.classList.add('sidebar-show');
      toggle.classList.add('bx-x');
      bodypd.classList.add('body-pd');
      headerpd.classList.add('body-pd');

      toggle.addEventListener('click', () => {
        // show navbar
        nav.classList.toggle('sidebar-show');
        // change icon
        toggle.classList.toggle('bx-x');
        // add padding to body
        bodypd.classList.toggle('body-pd');
        // add padding to header
        headerpd.classList.toggle('body-pd');
      });
    }
  };

  showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
  
  const linkColor = document.querySelectorAll('.nav_link');

  function colorLink() {
    if (linkColor) {
      linkColor.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  }
  linkColor.forEach(l => l.addEventListener('click', colorLink));
});


// TRANSICION DEL ABRIR CERRAR SUAVE 1er sub menu
var toggleButton = document.getElementById("toggleMenu");
var menu = document.getElementById("menu");

menu.classList.remove("cerrado");
menu.classList.add("abierto");

toggleButton.addEventListener("click", function() {
  if (menu.classList.contains("cerrado")) {
    menu.classList.remove("cerrado");
    menu.classList.add("abierto");
  } else {
    menu.classList.remove("abierto");
    menu.classList.add("cerrado");
  }
});


// Codigo para que los sub menus se desplacen 2do 
var toggleButton = document.getElementById("toggleMenu");
var menu2 = document.getElementById("menu2");

menu2.classList.remove("cerrado");
menu2.classList.add("abierto");

toggleButton.addEventListener("click", function() {
  if (menu2.classList.contains("cerrado")) {
    menu2.classList.remove("cerrado");
    menu2.classList.add("abierto");
  } else {
    menu2.classList.remove("abierto");
    menu2.classList.add("cerrado");
  }
});


// IDN
// var toggleButton = document.getElementById("toggleMenu");
// var menu0 = document.getElementById("menu0");

// toggleButton.addEventListener("click", function() {
//   if (menu0.classList.contains("abierto")) {
//     menu0.classList.remove("abierto");
//     menu0.classList.add("cerrado");
//   } else {
//     menu0.classList.remove("cerrado");
//     menu0.classList.add("abierto");
//   }
// });

// IDN
// var myLink = document.querySelector('a[href="#"]');
//     myLink.addEventListener('click', function(e) {
//     e.preventDefault();
// });


// Codigo que genera el padding y ayuda a la animacion del menú
// document.getElementById("toggleMenu").addEventListener("click", function() {
//   var navLinks = document.querySelectorAll(".nav_link");
//   navLinks.forEach(function(navLink) {
//     navLink.style.padding = "11px 1px 18px 15px";
//   });
// });

// Cambia la imagen del menu al abrirlo
const toggleMenuButton = document.getElementById('toggleMenu');
const logoImage = document.getElementById('logoImage');

let isAlternateImage = false;

toggleMenuButton.addEventListener('click', function() {
  if (isAlternateImage) {
    logoImage.src = 'img/logos/SICA.svg';
    logoImage.classList.remove('img-sica2');
    isAlternateImage = false;
  } else {
    logoImage.src = 'img/logos/SICA_2.svg';
    logoImage.classList.add('img-sica2');
    isAlternateImage = true;
  }
  
  logoImage.style.opacity = 0;
  
  setTimeout(function() {
    logoImage.style.opacity = 1;
  }, 10);
  
  setTimeout(function() {
    logoImage.classList.remove('oculto');
  }, 500);
});

// Genera el scroll dentro del menú lateral
const toggleMenuBtn = document.getElementById('toggleMenu');
const navBar = document.getElementById('nav-bar');

navBar.classList.add('scroll');

toggleMenuBtn.addEventListener('click', function() {
  if (navBar.classList.contains('scroll')) {
    navBar.classList.remove('scroll');
  } else {
    navBar.classList.add('scroll');
  }
});


// filtro
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

//P referencia a la tabla
const tabla = document.getElementById('exp-siniestrados');

//todas las etiquetas "a" dentro de la tabla
const enlaces = tabla.querySelectorAll('a');

//evento de clic a cada enlace para abrir el modal
enlaces.forEach((enlace) => {
  enlace.addEventListener('click', abrirModal);
});

// función para abrir el modal
function abrirModal(evento) {
  evento.preventDefault(); // Evitar la acción predeterminada del enlace

  // Obtener referencia al modal por su ID
  const modal = document.getElementById('registrar-xp-siniestro');

  // Mostrar el modal
  const modalBootstrap = new bootstrap.Modal(modal);
  modalBootstrap.show();

  // Obtener referencia a los botones "Close" y "Save changes" dentro del modal
  const closeButton = modal.querySelector('.btn-close');
  const saveChangesButton = modal.querySelector('.btn-primary');
  const secondaryButton = modal.querySelector('.btn-secondary');

  //evento de clic al botón "Close" para cerrar el modal
  closeButton.addEventListener('click', () => {
    modalBootstrap.hide();
  });

  // evento de clic al botón "Save changes" para cerrar el modal
  saveChangesButton.addEventListener('click', () => {
    modalBootstrap.hide();
  });

  //evento de clic al botón "btn-secondary" para cerrar el modal
  secondaryButton.addEventListener('click', () => {
    modalBootstrap.hide();
  });
}

