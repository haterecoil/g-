Object.defineProperties(Object, {
       'extend': {
        'configurable': true,
        'enumerable': false,
        'value': function extend(what, wit) {
         var extObj, witKeys = Object.keys(wit);
      
         extObj = Object.keys(what).length ? Object.clone(what) : {};
      
         witKeys.forEach(function(key) {
          Object.defineProperty(extObj, key, Object.getOwnPropertyDescriptor(wit, key));
         });
      
         return extObj;
        },
        'writable': true
       },
       'clone': {
        'configurable': true,
        'enumerable': false,
        'value': function clone(obj) {
         return Object.extend({}, obj);
        },
        'writable': true
       }
      });

var Go_Clone = dejavu.Class.declare({

	_whiteStones: 0,
	_blackStones: 0,
	_goban: null,

	getStonesQuantity: function() {
		return this._whiteStones + this._blackStones;
	},

	addWhiteStone: function() {
		this._whiteStones++;
		return this;
	},
	removeWhiteStone: function() {
		this._whiteStones--;
		return this;
	},
	addBlackStone: function() {
		this._blackStones++;
		return this;
	},
	removeBlackStone: function() {
		this._blackStones--;
		return this;
	},

	setGoban: function(goban) {
		this._goban = Object.clone(goban);

		return this;
	}

});

