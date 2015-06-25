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
		$div = $('<div class="goban--intersections" style="xwidth:'+goban.length*52+'px;"></div>');
		$divbg = $('<div class="goban--borders" style="xwidth:'+goban.length*52+'px;"></div>');
		for (var y = 0; y<goban.length+1; y++)
		{
			
				for (var x = 0; x<goban[0].length; x++)
				{
					if (y < goban.length)
					{
						$div.append('<div class="intersections__intersection player'+goban[x][y].getOwner()+' type'+goban[x][y].getType()+'" data-x="'+x+'" data-y="'+y+'">'+goban[x][y].getType()+'<br/>' +goban[x][y].getHP()+'</div>');
						$divbg.append('<div class="borders__border"></div>');
					}
					else
					{
						$divbg.append('<div class="borders__border"></div>');	
					}
				}
			
			$divbg.append('<div class="borders__border"></div>');
			if (y < goban.length)
				$div.append('<br>');
			$divbg.append('<br>');
			/*$div.append('<div class="intersection" style="background: red">');*/
		}
		$('.goban-container').append($div);
		$('.goban-container').append($divbg);

		this.setListeners();
		console.log('rendered');
	},

	/**
	 * Go_View_HTML.setListeners()
	 *   set placeStone() events on divs
	 */
	setListeners: function(){
		var divs = $('.intersections__intersection');
		var divsNumber = $('.intersections__intersection').length;
		var that = this;
		for ( var i = 0; i < divsNumber; i++){
			divs[i].addEventListener('click', function(el){
				that.go.controller.placeStone( parseInt(el.target.dataset.x), parseInt(el.target.dataset.y), Go_Intersection.STONE_NORMAL);						
			});
		}
		
				
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