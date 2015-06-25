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
						$div.append('<div class="intersections__intersection player'+goban[x][y].getOwner()+' type'+goban[x][y].getType()+'" data-x="'+x+'" data-y="'+y+'" style="width:'+(100/goban.length)+'%;">'+goban[x][y].getType()+'<br/>' +goban[x][y].getHP()+'</div>');
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