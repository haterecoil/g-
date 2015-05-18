var Go_Intersection = dejavu.Class.declare({
	_owner: 0,

	isEmpty: function(){
		return this._owner === 0;
	},
	getOwner: function(){
		return this._owner;
	},
	setOwner: function(owner){
		this._owner = owner;
	},
	removeStone: function(){
		this._owner = 0;
	}

});