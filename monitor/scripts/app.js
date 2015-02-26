
//Version muy temprana
var intro = 'http://api.thingspeak.com/channels/'
var post = '/feed.json';
var channels = [28024, 28027, 28029, 28030];

//TODO: Reemplazar
setInterval(function(){

	//Para cada uno de los canales
	for (var i = 0; i < channels.length; i++) {;
		var current = channels[i];
		var TSGetAPI =intro + current + post;
		//Ejecutamos un request a ThingsSpeak

		//Como es async hago que se ejecute en si mismo.
		(function(TSGetAPI, current){
			$.get(TSGetAPI, function(data) {
				//Obtengo la ultima
				if (data.feeds.length > 0){
					var lastIndex = data.feeds.length-1;
					var lastMeasure = data.feeds[lastIndex];
					//La aplico en el div.
					$('.spot-' + current + ' h1').html(lastMeasure.field1);
				}
		   }).done(function(){

			}).fail(function(e){
		  	console.log(e);
		  });
		})(TSGetAPI,current);

	};
	

},4000);
