var map;

function initMap() {

	center = {
		lat: 10.521276,
		lng: 122.998539
	}
	var red = '#F00';
	var orange = '#FF8C00';
	var yellow = '#ffff00';
	var blue = '#00F';
	var green = '#00ff00';


	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 15
	});

	var pin = {
		path: 'M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11zm-8 0c0-1.1.9-2 2-2s2 .9 2 2-.89 2-2 2c-1.1 0-2-.9-2-2zM5 20v2h14v-2H5z',
		fillColor: 'yellow',
		fillOpacity: 0.8,
		scale: 4,
		strokeColor: 'gold'
	  };

	var cityCircle = new google.maps.Circle({
		strokeColor: green,
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: green,
		fillOpacity: 0,
		map: map,
		center: center,
		radius: 500
	});

	var marker = new google.maps.Marker({
		map: map,
		position: center,
		icon: {
			url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
			scaledSize: new google.maps.Size(80, 80),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(32,65),
			labelOrigin: new google.maps.Point(40,33)
		}
	});


	var socket = io.connect('http://localhost:4000');
	socket.on('lvl', (data) => {
		console.log(data.lvl);
		switch (data.lvl) {
			case '1':
				cityCircle.setOptions({
					strokeColor: green,
					fillColor: green
				});

				marker.setOptions({
					icon : {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 10,
						strokeColor: green
					}
				});
				break;
			case '2':
				cityCircle.setOptions({
					strokeColor: blue,
					fillColor: blue
				});
				marker.setOptions({
					icon : {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 10,
						strokeColor: blue
					}
				});
				break;
			case '3':
				console.log("ehre");
				cityCircle.setOptions({
					strokeColor: yellow,
					fillColor: yellow
				});
				marker.setOptions({
					icon : {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 10,
						strokeColor: yellow
					}
				});
				break;
			case '4':
				cityCircle.setOptions({
					strokeColor: orange,
					fillColor: orange
				});
				marker.setOptions({
					icon : {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 10,
						strokeColor: orange
					}
				});
				break;
			case '5':
				cityCircle.setOptions({
					strokeColor: red,
					fillColor: red
				});
				marker.setOptions({
					icon : {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 10,
						strokeColor: red
					}
				});
				break;

			default:
				cityCircle.setOptions({
					strokeColor: green,
					fillColor: green
				});

				marker.setOptions({
					icon : {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						scale: 10,
						strokeColor: green
					}
				});
		}

	})

	socket.on('data', (logs) => {
		$("ul#log").prepend(logs);
		console.log(logs)
	})

}