
//Version muy temprana
var intro = 'http://api.thingspeak.com/channels/'
var post = '/feed.json';
var channels = [28024, 28027, 28029, 28030];


//http://prcweb.co.uk/lab/circularheat/

/* Create random data */
var data = [];


var chart = circularHeatChart()
	.domain([0,44])
	.range(["rgb(118, 218, 233)","red"])
	.segmentHeight(10)
	.innerRadius(8);

var data = [];
var ringLength = 24;
var measures = 20;
var t = 0;
for (var i= 0; i < measures; i++) {
	for(var j=0; j<ringLength; j++) {
		data[j+i*ringLength] = t + i; 
	}

};

d3.select('#chart2')
    .selectAll('svg')
    .data([data])
    .enter()
    .append('svg')
    .call(chart);

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
function randomRange(min, max)
{
   var range = (max - min) + 1;     
   return (Math.random() * range) + min;
}