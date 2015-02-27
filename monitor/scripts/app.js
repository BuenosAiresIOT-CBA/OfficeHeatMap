
//Version muy temprana
var intro = 'http://api.thingspeak.com/channels/'
var post = '/feed.json';
var channels = [28024, 28027, 28029, 28030];

//Inicializo datasets
var datasets = [];
for (var i = 0; i < channels.length; i++) {
	datasets[channels[i]] = [];
};


//Inicializo visualizacion.
//http://prcweb.co.uk/lab/circularheat/
var chart = circularHeatChart()
	.domain([0,44])
	.range(["rgb(118, 218, 233)","red"])
	.segmentHeight(10)
	.innerRadius(8);



//Busco a ThingsSpeak las temperaturas cada 15 segundos
setInterval(function(){

	//Para cada uno de los canales
	for (var i = 0; i < channels.length; i++) {;
		var current = channels[i];
		var TSGetAPI =intro + current + post;
		//Ejecutamos un request a ThingsSpeak

		//Como es async hago que se ejecute en si mismo.
		(function(TSGetAPI, current){
			$.get(TSGetAPI, function(data) {
				processData(data);
		   }).done(function(){

			}).fail(function(e){
		  	console.log(e);
		  });
		})(TSGetAPI,current);

	};
	

},1500);





//Cuantas medidas van por circulo?
var ringLength = 24;



function processData(data){
	//Obtengo la ultima
	if (data.feeds.length > 0){
		var lastIndex = data.feeds.length-1;
		var lastMeasure = data.feeds[lastIndex];
		//Get Dataset
		var temperatures = datasets[data.channel.id];
		//Cuantas mediciones hay?
		ringCount = temperatures.length / ringLength;

		//Lleno el circulo
		for(var j=0; j<ringLength; j++) {
			temperatures[j+ringCount*ringLength] = parseInt(lastMeasure.field1); 
		};
		//Aplico
		d3.select('.spot-' + data.channel.id + ' svg').remove()
		d3.select('.spot-' + data.channel.id)
		    .selectAll('svg')
		    .data([temperatures])
		    .enter()
		    .transition()
		    .append('svg')
		    .attr('viewBox','0 0 100 100')
		    .attr('preserveAspectRatio','xMinYMin')
		    .call(chart);

		//La aplico en el div.
		// $('.spot-' + current + ' h1').html(lastMeasure.field1);
	}
}

	


