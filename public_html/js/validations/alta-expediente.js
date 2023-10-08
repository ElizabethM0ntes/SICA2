$(document).ready(function () {
	window.url = $('#URL_HOST').val();
	window.token = $('#TOKEN_HOST').val();
	let cacheSeriesData = [];
	let totalExpedientes = 0;
	let altaExpediente = [];

	// ---------------------------------------------------------------------------------------------------
	//                                      CARGA DE CATALAGOS
	// ---------------------------------------------------------------------------------------------------

	async function get_data() {
		try {
			$('#preloader').css('display', 'block');
			let statusCatalagos;
			$.ajax({
				type: 'get',
				data: { type: 'FULL', _token: window.token, id: null },
				url: window.url + '/get_data',
				dataType: 'json',
				async: false,
				crossDomain: true,
				success: function (data) {
					if (data.CatSeccion) {
						$('#SECCION').html('');
						$('#SECCION').append(
							'<option value="null">Seleccione una opción</option>',
						);
						$.each(data.CatSeccion, function (i, item) {
							$('#SECCION').append(
								'<option value="' +
									item.codigo_seccion +
									'" data-descripcion="' +
									item.descripcion +
									'">' +
									item.nombre +
									'</option>',
							);
						});
					} else {
						statusCatalagos = 404;
					}

					if (data.CatUnidadAdministrativa) {
						$('#UNIDAD_ADMINISTRATIVA').html('');
						$('#UNIDAD_ADMINISTRATIVA').append(
							'<option value="null">Seleccione una opción</option>',
						);
						$.each(data.CatUnidadAdministrativa, function (i, item) {
							$('#UNIDAD_ADMINISTRATIVA').append(
								'<option value="' +
									item.codigo_unidad +
									'">' +
									item.nombre +
									'</option>',
							);
						});
					} else {
						statusCatalagos = 404;
					}

					if (data.ERROR || statusCatalagos == 404) {
						Swal.fire({
							icon: 'warning',
							title: 'Sin conexión',
							text: 'Algo fallo en la descarga de recursos.',
							showDenyButton: true,
							showCancelButton: false,
							confirmButtonText: 'Recargar',
							denyButtonText: 'Salir',
							allowOutsideClick: false,
						}).then((result) => {
							if (result.isConfirmed) {
								location.reload(true);
							} else if (result.isDenied) {
								window.location.href = window.url + '/home';
							}
						});
					}
				},
				error: function (data) {
					Swal.fire({
						icon: 'warning',
						title: 'Sin conexión',
						text: 'Algo fallo en la descarga de recursos.',
						showDenyButton: true,
						showCancelButton: false,
						confirmButtonText: 'Recargar',
						denyButtonText: 'Salir',
						allowOutsideClick: false,
					}).then((result) => {
						if (result.isConfirmed) {
							location.reload(true);
						} else if (result.isDenied) {
							window.location.href = window.url + '/home';
						}
					});
				},
				complete: function () {
					setTimeout(function () {
						$('#preloader').fadeOut(500);
					}, 200);
				},
			});
		} catch {
			Swal.fire({
				icon: 'warning',
				title: 'Sin conexión',
				text: 'Algo fallo en la descarga de recursos.',
				showDenyButton: true,
				showCancelButton: false,
				confirmButtonText: 'Recargar',
				denyButtonText: 'Salir',
				allowOutsideClick: false,
			}).then((result) => {
				if (result.isConfirmed) {
					location.reload(true);
				} else if (result.isDenied) {
					window.location.href = window.url + '/home';
				}
			});
		}
	}

	// ---------------------------------------------------------------------------------------------------
	//            Bloquea los select de Área Generadora y Área de Control Interno al inicio   STEP 1
	// ---------------------------------------------------------------------------------------------------

	$(document).ready(function () {
		// Bloquea los select de Área Generadora y Área de Control Interno al inicio
		$('#AREA_GENERADORA, #AREA_CONTROL_INTERNO').prop('disabled', true);

		// Desbloquea el select de Área Generadora cuando se selecciona una Unidad Administrativa
		$('#UNIDAD_ADMINISTRATIVA').on('change', function () {
			$('#AREA_GENERADORA').prop('disabled', false);
			$('#AREA_CONTROL_INTERNO').prop('disabled', true); // Se asegura de que Área de Control Interno esté bloqueado si se cambia la Unidad Administrativa
		});

		// Desbloquea el select de Área de Control Interno cuando se selecciona una Área Generadora
		$('#AREA_GENERADORA').on('change', function () {
			$('#AREA_CONTROL_INTERNO').prop('disabled', false);
		});
	});

	// ---------------------------------------------------------------------------------------------------
	//            Bloquea los select de serie y Subserie   STEP 2
	// ---------------------------------------------------------------------------------------------------
	// Inicialmente deshabilitar todos los campos
	$(
		'#DESCRIPCION_SECCION, #SERIE, #DESCRIPCION_SERIE, #SUBSERIE, #DESCRIPCION_SUBSERIE',
	).prop('disabled', true);

	// Habilitar campos en base a la selección de la sección
	$('#SECCION').change(function () {
		if ($(this).val() != 'null') {
			$('#DESCRIPCION_SECCION, #SERIE').prop('disabled', false);
		} else {
			$(
				'#DESCRIPCION_SECCION, #SERIE, #DESCRIPCION_SERIE, #SUBSERIE, #DESCRIPCION_SUBSERIE',
			).prop('disabled', true);
		}
	});

	// Habilitar campos en base a la selección de la serie
	$('#SERIE').change(function () {
		if ($(this).val() != 'null') {
			$('#DESCRIPCION_SERIE, #SUBSERIE').prop('disabled', false);
		} else {
			$('#DESCRIPCION_SERIE, #SUBSERIE, #DESCRIPCION_SUBSERIE').prop(
				'disabled',
				true,
			);
		}
	});

	// Habilitar campos en base a la selección de la subserie
	$('#SUBSERIE').change(function () {
		if ($(this).val() != 'null') {
			$('#DESCRIPCION_SUBSERIE').prop('disabled', false);
		} else {
			$('#DESCRIPCION_SUBSERIE').prop('disabled', true);
		}
	});

	// ---------------------------------------------------------------------------------------------------
	//                            VALIDACIONES PARA EL ALTA DEL EXPEDIENTE
	// ---------------------------------------------------------------------------------------------------

	$('#step1').validate({
		rules: {
			UNIDAD_ADMINISTRATIVA: {
				valueNotEquals: 'null',
			},
			AREA_GENERADORA: {
				valueNotEquals: 'null',
			},
			AREA_CONTROL_INTERNO: {
				valueNotEquals: 'null',
			},
			SECCION: {
				valueNotEquals: 'null',
			},
			CADIDO: {
				required: true,
				maxlength: 4,
			},
			DEPENDENCIA: {
				required: true,
				minlength: 4,
			},
			FONDO: {
				required: true,
				minlength: 4,
			},
		},
		messages: {
			UNIDAD_ADMINISTRATIVA: {
				valueNotEquals: 'Por favor, selecciona una opción válida.',
			},
			AREA_GENERADORA: {
				valueNotEquals: 'Por favor, selecciona una opción válida.',
			},
			AREA_CONTROL_INTERNO: {
				valueNotEquals: 'Por favor, selecciona una opción válida.',
			},
			SECCION: {
				valueNotEquals: 'Por favor, selecciona una opción válida.',
			},
			CADIDO: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 4 caracteres.',
			},
			DEPENDENCIA: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener minimo 4 caracteres.',
			},
			FONDO: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener minimo 4 caracteres.',
			},
		},
		submitHandler: function (form) {
			$('span.second').click();
		},
	});

	$('#step2').validate({
		rules: {
			SECCION: {
				valueNotEquals: 'null',
			},
			SERIE: {
				valueNotEquals: 'null',
			},
			DESCRIPCION_EXPEDIENTE: {
				required: true,
			},
			VALOR_DOCUMENTAL: {
				required: true,
			},
			AT: {
				required: true,
				maxlength: 3,
			},
			AC: {
				required: true,
				maxlength: 3,
			},
			TOTAL_ANIOS: {
				required: true,
				maxlength: 3,
			},
		},
		messages: {
			SECCION: {
				valueNotEquals: 'Por favor, selecciona una opción válida.',
			},
			SERIE: {
				valueNotEquals: 'Por favor, selecciona una opción válida.',
			},
			DESCRIPCION: {
				required: 'El campo es obligatorio.',
				minlength: 'El campo debe tener al menos 3 caracteres.',
			},

			DESCRIPCION_SECCION: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 100 carácteres.',
			},
			DESCRIPCION_SERIE: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 100 carácteres.',
			},
			DESCRIPCION_SUBSERIE: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 100 carácteres.',
			},
			AT: {
				required: 'El campo es obligatorio.',
			},
			AC: {
				required: 'El campo es obligatorio.',
			},
			// TOTAL_ANIOS:{
			//     required: "El campo es obligatorio.",
			// }
		},

		submitHandler: function (form) {
			const totalExpedientes = countExpedientes();
			totalExpediente =
				totalExpedientes != null || totalExpedientes != undefined
					? totalExpedientes
					: 1;
			$('#NUM_EXPEDIENTE').val(totalExpediente);
			$('span.third').click();
		},
	});

	$('#step3').validate({
		rules: {
			TITULO: {
				required: true,
				minlength: 3,
				maxlength: 150,
			},
			NUM_EXPEDIENTE: {
				required: true,
				minlength: 1,
				maxlength: 10,
			},
			DESCRIPCION_EXPEDINTE: {
				required: true,
				maxlength: 600,
			},
			TOTAL_FOJAS: {
				required: true,
				maxlength: 4,
			},
			TOTAL_CARPETAS: {
				required: true,
				maxlength: 4,
			},
			FECHA_INICIO: {
				required: true,
				date: true,
			},
			ANIO_INICIO: {
				required: true,
			},
			SOPORTE_DOCUMENTAL: {
				required: true,
			},
			TRADICION_DOCUMENTAL: {
				required: true,
			},
		},
		messages: {
			TITULO: {
				equired: 'El campo es obligatorio.',
				minlength: 'El campo debe tener al menos 3 caracteres.',
			},
			NUM_EXPEDIENTE: {
				equired: 'El campo es obligatorio.',
				minlength: 'El campo debe tener al menos 5 caracteres.',
			},
			DESCRIPCION_EXPEDINTE: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 100 carácteres.',
			},
			TOTAL_FOJAS: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 4 carácteres.',
			},
			TOTAL_CARPETAS: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 4 carácteres.',
			},
			FECHA_INICIO: {
				required: 'Por favor, ingresa la fecha de inicio.',
				date: 'Por favor, ingresa una fecha válida.',
			},
			FECHA_CIERRE: {
				required: 'Por favor, ingresa la fecha de cierre.',
				date: 'Por favor, ingresa una fecha válida.',
			},
			ANIO_INICIO: {
				required: 'Seleccione un año de inicio.',
			},
			ANIO_CIERRE: {
				required: 'Seleccione un año de cierre.',
			},
			SOPORTE_DOCUMENTAL: {
				required: 'Seleccione al menos una opción.',
			},
			TRADICION_DOCUMENTAL: {
				required: 'Seleccione al menos una opción.',
			},
		},
		submitHandler: function (form) {
			// form.submit();

			$('span.fourth').click();
		},
	});

	$('#step4').validate({
		rules: {
			NUMERO_MOBILIARIO: {
				required: true,
				maxlength: 60,
			},
			INSTALACION: {
				required: true,
				maxlength: 100,
			},
			LOCAL: {
				maxlength: 60,
			},
			PISO: {
				required: true,
				maxlength: 60,
			},
			REFERENCIA_DE_UBICACION: {
				maxlength: 60,
			},
			PASILLO: {
				required: true,
				maxlength: 60,
			},
			ANAQUEL: {
				maxlength: 60,
			},
			MOBILIARIO: {
				required: true,
				maxlength: 60,
			},
			NIVEL: {
				maxlength: 60,
			},
			CHAROLA: {
				maxlength: 60,
			},
			OBSERVACIONES: {
				required: true,
				maxlength: 600,
			},
		},
		messages: {
			NUMERO_MOBILIARIO: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			INSTALACION: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 100 caracteres.',
			},
			LOCAL: {
				maxlength: 'El campo debe tener máximo 60 caracteres.',
			},
			PISO: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			REFERENCIA_DE_UBICACION: {
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			PASILLO: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			ANAQUEL: {
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			MOBILIARIO: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			NIVEL: {
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			CHAROLA: {
				maxlength: 'El campo debe tener máximo 60 caracteres.',
				alphanumeric: 'El campo debe ser alfanumérico.',
			},
			OBSERVACIONES: {
				required: 'El campo es obligatorio.',
				maxlength: 'El campo debe tener máximo 600 caracteres.',
			},
		},

		submitHandler: function (form) {
			EnviarAlataExp();
		},
	});

	$.validator.addMethod(
		'valueNotEquals',
		function (value, element, arg) {
			return arg !== value;
		},
		'Por favor, selecciona una opción válida.',
	);

	// ---------------------------------------------------------------------------------------------------
	//                                              LOGICA
	// ---------------------------------------------------------------------------------------------------

	// Complementar catálago de areas generadoras
	$('#UNIDAD_ADMINISTRATIVA').on('change', function () {
		let option = $(this).val();
		$('.cat_area_generadora').empty();

		$('#AREA_GENERADORA').val('mull').change();
		$('#AREA_CONTROL_INTERNO').val('null').change();
		$('#preloader').css('display', 'block');
		let statusCatalagos;
		$.ajax({
			type: 'get',
			data: { type: 'AREA_GENERADORA', _token: window.token, id: option },
			url: window.url + '/get_data',
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (data) {
				if (data.CatAreaGeneradora) {
					$('#AREA_GENERADORA').html('');
					$('#AREA_GENERADORA').append(
						'<option value="null">Seleccione una opción</option>',
					);
					$.each(data.CatAreaGeneradora, function (i, item) {
						$('#AREA_GENERADORA').append(
							'<option value="' +
								item.codigo_area +
								'">' +
								item.nombre +
								'</option>',
						);
					});
				} else {
					statusCatalagos = 404;
				}

				if (data.ERROR || statusCatalagos == 404) {
					Swal.fire({
						icon: 'warning',
						title: 'Sin conexión',
						text: 'Algo fallo en la descarga de recursos.',
						showDenyButton: true,
						showCancelButton: false,
						confirmButtonText: 'Recargar',
						denyButtonText: 'Salir',
						allowOutsideClick: false,
					}).then((result) => {
						if (result.isConfirmed) {
							location.reload(true);
						} else if (result.isDenied) {
							window.location.href = window.url + '/home';
						}
					});
				}
			},
			error: function (data) {
				Swal.fire({
					icon: 'warning',
					title: 'Sin conexión',
					text: 'Algo fallo en la descarga de recursos.',
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: 'Recargar',
					denyButtonText: 'Salir',
					allowOutsideClick: false,
				}).then((result) => {
					if (result.isConfirmed) {
						location.reload(true);
					} else if (result.isDenied) {
						window.location.href = window.url + '/home';
					}
				});
			},
			complete: function () {
				setTimeout(function () {
					$('#preloader').fadeOut(500);
				}, 200);
			},
		});
	});

	// Completar catálago de areas de control interno
	$('#AREA_GENERADORA').on('change', function () {
		let option = $(this).val();
		$('.cat_area_control_interno').empty();
		$('#AREA_CONTROL_INTERNO').val('null').change();
		$('#preloader').css('display', 'block');
		let statusCatalagos;
		$.ajax({
			type: 'get',
			data: { type: 'AREA_INTERNA', _token: window.token, id: option },
			url: window.url + '/get_data',
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (data) {
				if (data.CatAreaInterna) {
					$('#AREA_CONTROL_INTERNO').html('');
					$('#AREA_CONTROL_INTERNO').append(
						'<option value="null">Seleccione una opción</option>',
					);
					$.each(data.CatAreaInterna, function (i, item) {
						$('#AREA_CONTROL_INTERNO').append(
							'<option value="' +
								item.codigo_area_interna +
								'">' +
								item.nombre +
								'</option>',
						);
					});
				} else if (data.EMPTY) {
					$('#AREA_CONTROL_INTERNO').html('');
					$('#AREA_CONTROL_INTERNO').append(
						'<option value="null">Seleccione una opción</option>',
					);
					$('#AREA_CONTROL_INTERNO').append(
						'<option value="N/A" selected>N/A</option>',
					);
				} else {
					statusCatalagos = 404;
				}

				if (data.ERROR) {
					Swal.fire({
						icon: 'warning',
						title: 'Sin conexión',
						text: 'Algo fallo en la descarga de recursos.',
						showDenyButton: true,
						showCancelButton: false,
						confirmButtonText: 'Recargar',
						denyButtonText: 'Salir',
						allowOutsideClick: false,
					}).then((result) => {
						if (result.isConfirmed) {
							location.reload(true);
						} else if (result.isDenied) {
							window.location.href = window.url + '/home';
						}
					});
				}
			},
			error: function (data) {
				Swal.fire({
					icon: 'warning',
					title: 'Sin conexión',
					text: 'Algo fallo en la descarga de recursos.',
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: 'Recargar',
					denyButtonText: 'Salir',
					allowOutsideClick: false,
				}).then((result) => {
					if (result.isConfirmed) {
						location.reload(true);
					} else if (result.isDenied) {
						window.location.href = window.url + '/home';
					}
				});
			},
			complete: function () {
				setTimeout(function () {
					$('#preloader').fadeOut(500);
				}, 200);
			},
		});
	});

	// Agregar descripción a sección
	$('#SECCION').on('change', function () {
		var opcion = this.options[this.selectedIndex];
		var data = opcion.dataset;
		$('#DESCRIPCION_SECCION').val(data.descripcion).change();
		let option = $(this).val();

		// Guardo la opcion elejida para las subseries
		window.seccion = option;

		$('.cat_series').empty();

		// $("#AREA_GENERADORA").val("mull").change();
		// $("#AREA_CONTROL_INTERNO").val("null").change();

		$('#preloader').css('display', 'block');
		let statusCatalagos;
		$.ajax({
			type: 'get',
			data: { type: 'SERIES', _token: window.token, id: option },
			url: window.url + '/get_data',
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (data) {
				var idsAgregados = [];
				if (data.CatSerie) {
					$('#SERIE').html('');
					$('#SERIE').append(
						'<option value="null">Seleccione una opción</option>',
					);
					$.each(data.CatSerie, function (i, item) {
						// No agregar series repetidas
						if (!idsAgregados[item.codigo_serie]) {
							var cleandescription = item.descripcion_serie.replace(
								/\r\n/g,
								' ',
							);
							$('#SERIE').append(
								'<option value="' +
									item.codigo_serie +
									'" data-descripcionserie="' +
									cleandescription +
									'">' +
									item.nombre_serie +
									'</option>',
							);
						}
						// Se guarda valor
						idsAgregados[item.codigo_serie] = true;
						cacheSeriesData = data.CatSerie;
					});
				} else {
					statusCatalagos = 404;
				}

				if (data.ERROR || statusCatalagos == 404) {
					Swal.fire({
						icon: 'warning',
						title: 'Sin conexión',
						text: 'Algo fallo en la descarga de recursos.',
						showDenyButton: true,
						showCancelButton: false,
						confirmButtonText: 'Recargar',
						denyButtonText: 'Salir',
						allowOutsideClick: false,
					}).then((result) => {
						if (result.isConfirmed) {
							location.reload(true);
						} else if (result.isDenied) {
							window.location.href = window.url + '/home';
						}
					});
				}
			},
			error: function (data) {
				Swal.fire({
					icon: 'warning',
					title: 'Sin conexión',
					text: 'Algo fallo en la descarga de recursos.',
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: 'Recargar',
					denyButtonText: 'Salir',
					allowOutsideClick: false,
				}).then((result) => {
					if (result.isConfirmed) {
						location.reload(true);
					} else if (result.isDenied) {
						window.location.href = window.url + '/home';
					}
				});
			},
			complete: function () {
				setTimeout(function () {
					$('#preloader').fadeOut(500);
				}, 200);
			},
		});
	});

	// Agregar descripción a serie
	$('#SERIE').on('change', function () {
		var opcion = this.options[this.selectedIndex];
		var data = opcion.dataset;
		let option = $(this).val();
		cacheSeriesData = Object.values(cacheSeriesData);
		let actualSeleccion = cacheSeriesData.find(
			(e) => e.codigo_serie === option,
		);

		$('#DESCRIPCION_SERIE').val(data.descripcionserie).change();
		$('#AT').val(actualSeleccion['anios_at']);
		$('#AC').val(actualSeleccion['anios_ac']);
		$('#TOTAL_ANIOS').val(actualSeleccion['total_anios']);
		$('#ADMINISTRATIVO').prop(
			'checked',
			actualSeleccion['administrativo'] != 0 ? true : false,
		);
		$('#LEGAL').prop('checked', actualSeleccion['legal'] != 0 ? true : false);
		$('#CONTABLE').prop(
			'checked',
			actualSeleccion['contable_fiscal'] != 0 ? true : false,
		);

		$('#preloader').css('display', 'block');
		let statusCatalagos;
		$.ajax({
			type: 'get',
			data: {
				type: 'SUBSERIES',
				_token: window.token,
				id: window.seccion,
				idserie: option,
			},
			url: window.url + '/get_data',
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (data) {
				var idsAgregados = [];
				if (data.CatSerie) {
					$('#SUBSERIE').html('');
					$('#SUBSERIE').append(
						'<option value="null">Seleccione una opción</option>',
					);
					$.each(data.CatSerie, function (i, item) {
						// No agregar series repetidas
						if (!idsAgregados[item.codigo_subserie]) {
							var cleandescription = item.descripcion_subserie.replace(
								/\r\n/g,
								' ',
							);
							$('#SUBSERIE').append(
								'<option value="' +
									item.codigo_subserie +
									'" data-descripcionserie="' +
									cleandescription +
									'">' +
									item.nombre_subserie +
									'</option>',
							);
						}
						// Se guarda valor
						idsAgregados[item.codigo_subserie] = true;
					});
				} else {
					statusCatalagos = 404;
				}

				if (data.ERROR || statusCatalagos == 404) {
					Swal.fire({
						icon: 'warning',
						title: 'Sin conexión',
						text: 'Algo fallo en la descarga de recursos.',
						showDenyButton: true,
						showCancelButton: false,
						confirmButtonText: 'Recargar',
						denyButtonText: 'Salir',
						allowOutsideClick: false,
					}).then((result) => {
						if (result.isConfirmed) {
							location.reload(true);
						} else if (result.isDenied) {
							window.location.href = window.url + '/home';
						}
					});
				}
			},
			error: function (data) {
				Swal.fire({
					icon: 'warning',
					title: 'Sin conexión',
					text: 'Algo fallo en la descarga de recursos.',
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: 'Recargar',
					denyButtonText: 'Salir',
					allowOutsideClick: false,
				}).then((result) => {
					if (result.isConfirmed) {
						location.reload(true);
					} else if (result.isDenied) {
						window.location.href = window.url + '/home';
					}
				});
			},
			complete: function () {
				setTimeout(function () {
					$('#preloader').fadeOut(500);
				}, 200);
			},
		});
	});

	$('#SUBSERIE').on('change', function () {
		var opcion = this.options[this.selectedIndex];
		var data = opcion.dataset;
		$('#DESCRIPCION_SUBSERIE').val(data.descripcionserie).change();
	});

	// ---------------------------------------------------------------------------------------------------
	//                                              VALIDACIONES2
	// ---------------------------------------------------------------------------------------------------

	//Campo Año inicio llenado por fehca inicio

	$('#FECHA_INICIO').datepicker({
		dateFormat: 'dd/mm/yy', // Esto cambia el formato de la fecha a día/mes/año
		changeYear: true,
		changeMonth: true,
		yearRange: '2018:2030',
	});

	$('#FECHA_CIERRE').on('change', function () {
		var fechaCierre = $(this).val();
		var anoCierre = fechaCierre.split('/')[2]; // Asume que la fecha está en formato dd/mm/aaaa
		$('#ANIO_CIERRE').val(anoCierre);
	});

	$('#FECHA_INICIO').on('change', function () {
		var fechaInicio = $(this).val();
		if (fechaInicio) {
			var anoInicio = fechaInicio.split('/')[2];
			$('#ANIO_INICIO').val(anoInicio);
		}
	});

	// Año cierre depende de fecha cierre
	$('#FECHA_CIERRE').datepicker({
		dateFormat: 'dd/mm/yy',
		changeYear: true,
		changeMonth: true,
		yearRange: '2018:2030',
	});

	$('#FECHA_CIERRE').on('change', function () {
		var fechaCierre = $(this).val();
		if (fechaCierre) {
			var anoCierre = fechaCierre.split('/')[2];
			$('#ANIO_CIERRE').val(anoCierre);
		}
	});

	// La fecha de cierre del expediente no puede ser menor a la fecha de inicio del
	// expediente y tampoco puede ser mayor a la fecha en la que se captura el expediente.
	$.validator.addMethod('fechaCierreValida', function (value, element) {
		var fechaInicio = $('#FECHA_INICIO').val();
		var fechaCierre = $('#FECHA_CIERRE').val();
		var fechaActual = new Date();

		// Convertimos las fechas en formato dd/mm/yyyy a objetos de Date para poder compararlas
		var arrFechaInicio = fechaInicio.split('/');
		var dateInicio = new Date(
			arrFechaInicio[2],
			arrFechaInicio[1] - 1,
			arrFechaInicio[0],
		);

		var arrFechaCierre = fechaCierre.split('/');
		var dateCierre = new Date(
			arrFechaCierre[2],
			arrFechaCierre[1] - 1,
			arrFechaCierre[0],
		);

		var dateActual = new Date(
			fechaActual.getFullYear(),
			fechaActual.getMonth(),
			fechaActual.getDate(),
		);

		return (
			this.optional(element) ||
			(dateCierre >= dateInicio && dateCierre <= dateActual)
		);
	});

	//    Enlazar numero de fojas con cajas
	$('#TOTAL_FOJAS').on('keyup', function () {
		var totalFojas = parseInt($('#TOTAL_FOJAS').val());

		if (isNaN(totalFojas)) {
			// Puedes mostrar un mensaje de error personalizado aquí
			return;
		}

		var carpetasEsperadas = Math.ceil(totalFojas / 300);
		if (
			totalFojas > (carpetasEsperadas - 1) * 300 &&
			totalFojas <= (carpetasEsperadas - 1) * 300 + 350
		) {
			carpetasEsperadas = carpetasEsperadas;
		} else if (totalFojas <= (carpetasEsperadas - 1) * 300) {
			carpetasEsperadas = carpetasEsperadas - 1;
		}

		$('#TOTAL_CARPETAS').val(carpetasEsperadas);
	});
	// ---------------------------------------------------------------------------------------------------
	//                                              Envio de datos
	// ---------------------------------------------------------------------------------------------------
	function EnviarAlataExp() {
		var formData =
			$('#step1').serialize() +
			'&' +
			$('#step2').serialize() +
			'&' +
			$('#step3').serialize() +
			'&' +
			$('#step4').serialize();

		$.ajax({
			url: window.url + '/send_alta_exp',
			type: 'post',
			data: formData,
			success: function (data) {
				// Manejar la respuesta exitosa aquí

				switch (data.status) {
					case '200':
						Swal.fire({
							icon: 'success',
							title: 'Guardado',
							html: 'Se registro con exito el expediente',
							denyButtonText: 'Salir',
							allowOutsideClick: false,
						}).then((result) => {
							if (result.isConfirmed) {
								location.reload(true);
							} else if (result.isDenied) {
								window.location.href = window.url + '/alta-expedientes';
							}
						});

						break;
					case '422':
						var error = data.msg;
						var mensaje = '';
						for (var i in error) {
							var error_msg = error[i];
							mensaje = mensaje + error_msg + '<br>';
						}
						Swal.fire({
							icon: 'warning',
							title: 'Advertencia',
							html: mensaje,
						});
						break;
					case '500':
						var error = data.msg;
						var mensaje = '';
						for (var i in error) {
							var error_msg = error[i];
							mensaje = mensaje + error_msg + '<br>';
						}
						Swal.fire({
							icon: 'error',
							title: 'Error',
							html: mensaje,
						});

						break;
					default:
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: 'Ocurrio un error al guardar la información.',
						});
				}
			},
			error: function (error) {
				// Manejar los errores aquí
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Ocurrio un error en el envio de datos.',
				});
			},
		});
	}

	function countExpedientes() {
		var TotalExp;

		$.ajax({
			type: 'get',
			data: { _token: window.token },
			url: window.url + '/get_count',
			dataType: 'json',
			async: false,
			crossDomain: true,
			success: function (data) {
				TotalExp = data.totalExpedientes;
			},
			error: function (data) {
				Swal.fire({
					icon: 'warning',
					title: 'Sin conexión',
					text: 'Algo fallo en la descarga de recursos.',
					showDenyButton: true,
					showCancelButton: false,
					confirmButtonText: 'Recargar',
					denyButtonText: 'Salir',
					allowOutsideClick: false,
				}).then((result) => {
					if (result.isConfirmed) {
						location.reload(true);
					} else if (result.isDenied) {
						window.location.href = window.url + '/home';
					}
				});
			},

			complete: function () {
				setTimeout(function () {
					$('#preloader').fadeOut(500);
				}, 200);
			},
		});

		return TotalExp;
	}

	get_data();
});
