!function($) {
    "use strict";
	
	$('#world_map').vectorMap({
		map: 'world_mill',
		scaleColors : ['#03a9f4', '#03a9f4'],
		normalizeFunction : 'polynomial',
		hoverOpacity : 0.7,
		hoverColor : false,
		regionStyle : {
			initial : {
				fill : '#ff0080'
			}
		},
		backgroundColor : 'transparent'
	});
	
	$('#usa').vectorMap({
		map: 'us_aea',
		backgroundColor: 'transparent',
		regionStyle: {
			initial: {
				fill: '#ff0080'
			}
		}
	});
	$('#india').vectorMap({
		map : 'in_mill',
		backgroundColor : 'transparent',
		regionStyle : {
			initial : {
				fill : '#ff0080'
			}
		}
	});
	$('#uk').vectorMap({map: 'uk_countries_mill',backgroundColor: 'transparent',
			  regionStyle: {
				initial: {
				  fill: '#ff0080'
				}
			  }});
	$('#russia').vectorMap({
		map: 'ru_mill',
		backgroundColor: 'transparent',
			  regionStyle: {
				initial: {
				  fill: '#ff0080'
				}
			  }});

}(window.jQuery)
