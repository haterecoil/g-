// lisetners à l'éinteirur de l vue

// version Ronan

var Go_View_HTML = dejavu.Class.declare({
	$extends: Go_View,

	/* Go_View_HTML.init()
	 *   set up DOM view and event listeners on DOM
	 */
	init: function() {
		var goban = this.go.model.getGoban();
//		$('.goban-container').empty();
//		$div = $('<div class="goban" style="width:'+goban.length*52+'px;"></div>');
//		for (var y = 0; y<goban.length; y++)
//		{
//			for (var x = 0; x<goban[0].length; x++)
//			{
//				$div.append('<div class="intersection player'+goban[x][y].getOwner()+'" data-x="'+x+'" data-y="'+y+'">'+goban[x][y].getType()+'<br/>' +goban[x][y].getHP()+'</div>');
//			}
//			$div.append('<div class="intersection" style="background: red">');
//		}
//		$('.goban-container').append($div);
		
		this.render();

		$pass = $('<a class="pass">Yes</a>');
		$('.pass-warning .option').append($pass);

		$pass.click(this.go.controller.playerPass.bind(this));

		this.setListeners();
	},
	
	/**
	 * Go_View_HTML.render()
	 *   refresh goban's DOM
	 */
	render: function() {
		var goban = this.go.model.getGoban();
		$('.goban-container').empty();
		$div = $('<div class="goban--intersections"></div>');
		$divbg = $('<div class="goban--borders"></div>');
		for (var y = 0; y<goban.length+1; y++)
		{
			
				for (var x = 0; x<goban[0].length; x++)
				{
					if (y < goban.length)
					{
						$div.append('<div class="intersections__intersection player'+goban[x][y].getOwner()+' type'+goban[x][y].getType()+'" data-x="'+x+'" data-y="'+y+'" style="width:'+(100/goban.length)+'%;">'+this.printSvg(goban[x][y].getType(),goban[x][y].getHP(),goban[x][y].getOwner())+'</div>');
						console.log(goban[x][y].getType()+ ' - ' +goban[x][y].getHP());
					}
					$divbg.append('<div class="borders__border"></div>');
				}
			
			$divbg.append('<div class="borders__border"></div>');
			if (y < goban.length)
				$div.append('<br>');
			$divbg.append('<br>');
			/*$div.append('<div class="intersection" style="background: red">');*/
		}
		$('.goban-container').append($div);
		$('.goban-container').append($divbg);
		$('.intersections__intersection, .borders__border').css('height', $('.intersections__intersection').eq(0).width());
		$('.borders__border').css('width', $('.intersections__intersection').width());
		$('.borders__border').css({ top: -$('.borders__border').eq(0).height()/2,
								    left: -$('.borders__border').eq(0).width()/2 });
		
		
		$('.uni').text(this.go.turretsLeft[this.go.currentPlayer-1].UNI);
		$('.duo').text(this.go.turretsLeft[this.go.currentPlayer-1].DUO);
		$('.quadrature').text(this.go.turretsLeft[this.go.currentPlayer-1].QUADRATURE);

		this.setListeners();
		console.log('rendered');
	},

	/**
	 * Go_View_HTML.setListeners()
	 *   set placeStone() events on divs
	 */
	setListeners: function(){		
		var that = this;
		$('.intersections__intersection').click(function () {
			that.go.controller.placeStone( parseInt($(this).data('x')), parseInt($(this).data('y')), Go_Intersection.STONE_NORMAL);
			return false;
		});
		
				
	},
	
	/**
	 * Go_View_HTML.placeStone()
	 * .render() when a stone was set
	 */
	placeStone: function() {
		this.render();
	},
	
	printSvg: function(type,health,player) {

		var fills = ['', '#27ae60', '#ae2727'];
		console.log(type);
		switch(type)
		{
			case Go_Intersection.STONE_NORMAL:
				return '<svg class="hp'+health+'" version="1.1" x="0px" y="0px" width="100%" height="100%"  enable-background="new 0 0 100 100" xml:space="preserve" class="hp100" viewBox="0 0 100 100" preserveAspectRatio="none">    <defs>  <clipPath id="myClip">    <circle cx="50" cy="50" r="50"/>   </clipPath>  </defs>     <rect class="hp100" fill="'+fills[player]+'"  width="100%" height="100%" clip-path="url(#myClip)"/>   <rect class="hp75" fill="'+fills[player]+'"  width="100%" height="75%" clip-path="url(#myClip)"/> <rect class="hp50" fill="'+fills[player]+'"  width="100%" height="50%" clip-path="url(#myClip)"/>    <rect class="hp25" fill="'+fills[player]+'"  width="100%" height="25%" clip-path="url(#myClip)"/> <path  vector-effect="non-scaling-stroke" fill="'+fills[player]+'" d="M50,5c24.813,0,45,20.187,45,45c0,24.813-20.187,45-45,45C25.187,95,5,74.813,5,50C5,25.187,25.187,5,50,5                 M50,0C22.386,0,0,22.386,0,50c0,27.614,22.386,50,50,50c27.614,0,50-22.386,50-50C100,22.386,77.614,0,50,0L50,0z"/>	</svg>';
				break;
			case Go_Intersection.STONE_TURRET4:
				alert('Obsolete TURRET4 in setOwner');
				break;
			case Go_Intersection.TURRET_UNI_UP:
			case Go_Intersection.TURRET_UNI_RIGHT:
			case Go_Intersection.TURRET_UNI_DOWN:
			case Go_Intersection.TURRET_UNI_LEFT:
				return '<svg version="1.1" x="0px" y="0px" width="100%" height="100%"  enable-background="new 0 0 100 100" xml:space="preserve" class="hp75" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><clipPath id="myClip"><path d="M100,50c0,27.614-50,50-50,50S0,77.614,0,50S50,0,50,0S100,22.386,100,50z"/></clipPath></defs><rect class="hp75" fill="'+fills[player]+'" width="100%" height="75%" clip-path="url(#myClip)"/><rect class="hp50" fill="'+fills[player]+'" width="100%" height="50%" clip-path="url(#myClip)"/><rect class="hp25" fill="'+fills[player]+'" width="100%" height="25%" clip-path="url(#myClip)"/><path vector-effect="non-scaling-stroke" fill="'+fills[player]+'" d="M50.002,5.511C64.257,12.323,95,30.975,95,50c0,24.813-20.187,45-45,45C25.187,95,5,74.813,5,50 C5,31.01,35.749,12.335,50.002,5.511 M50,0C50,0,0,22.386,0,50c0,27.614,22.386,50,50,50c27.614,0,50-22.386,50-50 C100,22.386,50,0,50,0L50,0z"/></svg>';
				break;
			case Go_Intersection.TURRET_DUO_HORIZONTAL:
			case Go_Intersection.TURRET_DUO_VERTICAL:
				return '<svg version="1.1" x="0px" y="0px" width="100%" height="100%"  enable-background="new 0 0 100 100" xml:space="preserve" class="hp50" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><clipPath id="myClip"><path d="M100,50c0,27.614-50,50-50,50S0,77.614,0,50S50,0,50,0S100,22.386,100,50z"/></clipPath></defs><rect class="hp50" fill="'+fills[player]+'" width="100%" height="50%" clip-path="url(#myClip)"/><rect class="hp25" fill="'+fills[player]+'" width="100%" height="25%" clip-path="url(#myClip)"/><path vector-effect="non-scaling-stroke" fill="'+fills[player]+'" d="M50.002,5.511C64.257,12.323,95,30.975,95,50c0,18.992-30.751,37.667-45.002,44.488C35.744,87.677,5,69.025,5,50C5,31.009,35.749,12.335,50.002,5.511 M50,0C50,0,0,22.386,0,50s50,50,50,50s50-22.386,50-50S50,0,50,0L50,0z"/></svg>'
				break;
			case Go_Intersection.TURRET_QUADRATURE:
				return '<svg version="1.1" x="0px" y="0px" width="100%" height="100%"  enable-background="new 0 0 100 100" xml:space="preserve" class="hp25" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><clipPath id="myClip"><rect x="14.645" y="14.645" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -20.7107 50)" width="70.711" height="70.711"/></clipPath></defs><rect class="hp25" fill="'+fills[player]+'" width="100%" height="25%" clip-path="url(#myClip)"/><path vector-effect="non-scaling-stroke" fill="'+fills[player]+'" d="M50,7.071L92.929,50L50,92.929L7.071,50L50,7.071 M50,0L0,50l50,50l50-50L50,0L50,0z"/></svg>';
				break;
			default:
				return '-'; // no svg (pas occupé)
		}
		
		return '??'
	}

	/*initialize: function(go) {
		console.log('[Go View HTML] PRE SUPER');
		this.$super(go);
		console.log('[Go View HTML] POST SUPER!');	
		console.log('[Go View HTML] THIS.GO : ' + this.go);	
	},
	*/
	/*getGo: function() { return this.go; }*/
	
});