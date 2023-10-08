$(document).ready(function () {
	new DataTable('#exp-registrados');

	$('#btn-search-exp').click(function (e) {
		e.preventDefault(); // Previene el comportamiento por defecto del botón

		var unidad = $('#UNIDAD_ADMINISTRATIVA').val();
		var areaGeneradora = $('#AREA_GENERADORA').val();
		var areaControl = $('#AREA_CONTROL_INTERNO').val();

		// Realiza la llamada AJAX para buscar
		$.ajax({
			type: 'GET',
			url: window.url + '/buscar-expediente',
			data: {
				_token: window.token,
				unidad: unidad,
				areaGeneradora: areaGeneradora,
				areaControl: areaControl,
			},
			success: function (data) {
				if (data) {
					$('#exp-registrados tbody').empty();

					// Iteramos sobre los datos y construimos las filas
					$.each(data, function (index, item) {
						var row = '<tr>';
						row += '<td>' + item.titulo + '</td>';
						row += '<td>' + item.codigo_expediente + '</td>';
						row += '<td>' + item.instalacion + '</td>';
						row +=
							'<td> <a class="btn-editar">Editar</a><a class="btn-eliminar">Eliminar</a></td>';
						row += '</tr>';

						// Añadimos la fila al tbody
						$('#exp-registrados tbody').append(row);
					});
				} else {
					alert('no se encontro información');
				}
			},
			error: function () {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Ocurrió un error al buscar los expedientes.',
				});
			},
		});
	});
});
