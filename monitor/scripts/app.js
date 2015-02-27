
//Version muy temprana
var intro = 'http://api.thingspeak.com/channels/'
var post = '/feed.json';
var timezone = '?timezone=America%2FArgentina%2FBuenos_Aires';
var channels = [28024, 28027, 28029];

//Inicializo datasets
var datasets = [];
for (var i = 0; i < channels.length; i++) {
	datasets[channels[i]] = [];
};


//Inicializo visualizacion.
//http://prcweb.co.uk/lab/circularheat/
var chart = circularHeatChart()
	.domain([15,39])
	.range(["rgb(118, 218, 233)","red"])
	.segmentHeight(4)
	.innerRadius(5);
chart.accessor(function(d) {return d.value;})


//Busco a ThingsSpeak las temperaturas cada 15 segundos
setInterval(function(){

	//Para cada uno de los canales
	for (var i = 0; i < channels.length; i++) {;
		var current = channels[i];
		var TSGetAPI =intro + current + post + timezone;
		console.log(TSGetAPI);
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
	

},5000);





//Cuantas medidas van por circulo?
var ringLength = 24;
var ringMax = 7;


function processData(data){
	//Obtengo la ultima
	if (data.feeds.length > 0){
		
		//De la mas nueva a la mas vieja
		var reverseMeasures = data.feeds.reverse();
		
		//Get Dataset
		var temperatures = datasets[data.channel.id];
		//Cuantas mediciones hay?
		ringCount = temperatures.length / ringLength;

		//Siempre tengo que empujar desde abajo hacia las nuevas
		if (data.feeds.length > 7){
			positions = 7;
		}
		else{
			positions = data.feeds.length;
		}
		for (var i = 0; i < positions; i++) {
			var lastMeasure  =reverseMeasures[i];
			//Lleno el circulo
			for(var j=0; j<ringLength; j++) {
				temperatures[j+i*ringLength] = 
				 {title: moment(lastMeasure.created_at, "YYYYMMDD").fromNow(), value: parseInt(lastMeasure.field1)};
			};	
		};

		
		//Aplico
		d3.select('.spot-' + data.channel.id + ' svg').remove()
		d3.select('.spot-' + data.channel.id)
		    .selectAll('svg')
		    .data([temperatures])
		    .enter()
		    .append('svg')
		    .attr('viewBox','0 0 100 100')
		    .attr('preserveAspectRatio','xMinYMin')
		    .call(chart);
		   /* Add a mouseover event */
		d3.selectAll('.spot-' + data.channel.id + ' svg path').on('mouseover', function() {
		    var d = d3.select(this).data()[0];
		    $('.spot-' +  data.channel.id + ' h1 span').html(d.value + '&#176;');
		    $('.spot-' +  data.channel.id + ' small').html(" "  + d.title);
		});
		d3.selectAll('.spot-' + data.channel.id + ' svg path').on('mouseout', function() {
		    $('.spot-' +  data.channel.id + ' h1 span').html('');
		    $('.spot-' +  data.channel.id + ' small').html('');  
		});

		
	}
}

	



require.config({
    paths: {
        'moment': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/moment.min',
        'moment_es': '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.0.0/lang/es.min'
    }
});

require(['moment', 'moment_es'], function(m){
		window.moment = m ;
	    window.moment.lang('es');
	});