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
			url: '/images/green.svg',
			scaledSize: new google.maps.Size(80, 80),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(32,65),
			labelOrigin: new google.maps.Point(40,33)
		}
	});


	var socket = io.connect('http://localhost:4000');
	socket.on('lvl', (data) => {
		switch (data.lvl) {
			case '1':
				cityCircle.setOptions({
					strokeColor: green,
					fillColor: green
				});

				marker.setOptions({
					icon : {
						url: '/images/green.svg',
						scaledSize: new google.maps.Size(80, 80),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(32,65),
						labelOrigin: new google.maps.Point(40,33)
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
						url: '/images/blue.svg',
						scaledSize: new google.maps.Size(80, 80),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(32,65),
						labelOrigin: new google.maps.Point(40,33)
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
						url: '/images/yellow.svg',
						scaledSize: new google.maps.Size(80, 80),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(32,65),
						labelOrigin: new google.maps.Point(40,33)
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
						url: '/images/orange.svg',
						scaledSize: new google.maps.Size(80, 80),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(32,65),
						labelOrigin: new google.maps.Point(40,33)
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
						url: '/images/red.svg',
						scaledSize: new google.maps.Size(80, 80),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(32,65),
						labelOrigin: new google.maps.Point(40,33)
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
						url: '/images/green.svg',
						scaledSize: new google.maps.Size(80, 80),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(32,65),
						labelOrigin: new google.maps.Point(40,33)
					}
				});
		}

	})

	socket.on('data', (logs) => {
		$("ul#log").prepend(logs);
		console.log(logs)
	})

}