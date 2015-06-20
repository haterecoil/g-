// lisetners à l'éinteirur de l vue

var Go_View_HTML = dejavu.Class.declare({
	$extends: Go_View,

	init: function() {
		var goban = this.go.model.getGoban();
		$('.goban-container').empty();
		$div = $('<div class="goban" style="width:'+goban.length*52+'px;"></div>');
		for (var y = 0; y<goban.length; y++)
		{
			for (var x = 0; x<goban[0].length; x++)
			{
				$div.append('<div class="intersection player'+goban[x][y].getOwner()+'" data-x="'+x+'" data-y="'+y+'">'+goban[x][y].getType()+'<br/>' +goban[x][y].getHP()+'</div>');
			}
			/*$div.append('<div class="intersection" style="background: red">');*/
		}
		$('.goban-container').append($div);

		$pass = $('<button class="pass-my-turn">passer</button>');
		$('.goban-controls').append($pass);

		$pass.click(this.go.controller.playerPass.bind(this));

		this.setListeners();
	},
	
	render: function() {
		var goban = this.go.model.getGoban();
		$('.goban-container').empty();
		$div = $('<div class="goban" style="width:'+goban.length*52+'px;"></div>');
		for (var y = 0; y<goban.length; y++)
		{
			for (var x = 0; x<goban[0].length; x++)
			{
				$div.append('<div class="intersection player'+goban[x][y].getOwner()+'" data-x="'+x+'" data-y="'+y+'">'+goban[x][y].getType()+'<br/>' +goban[x][y].getHP()+'</div>');
			}
			/*$div.append('<div class="intersection" style="background: red">');*/
		}
		$('.goban-container').append($div);

		this.setListeners();
		console.log('rendered');
	},

	setListeners: function(){
		var divs = $('.intersection');
		var divsNumber = $('.intersection').length;
		var that = this;
		for ( var i = 0; i < divsNumber; i++){
			divs[i].addEventListener('click', function(el){
				that.go.controller.placeStone( parseInt(el.target.dataset.x), parseInt(el.target.dataset.y));						
			});
		}
		
				
	},
	
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