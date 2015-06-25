var Go_Intersection = dejavu.Class.declare({
    
    $constants: {
        STONE_NORMAL: 0,
        STONE_TURRET4: 1,
		TURRET_UNI_UP: 20,
		TURRET_UNI_RIGHT: 21,
		TURRET_UNI_DOWN: 22,
		TURRET_UNI_LEFT: 23,
		TURRET_DUO_HORIZONTAL: 30,
		TURRET_DUO_VERTICAL: 31,
		TURRET_QUADRATURE: 40,		
    },
	
			
		// normale : 4
		// 1 direction que tu choisis  3
		// 2 directions horizontale / verticale 2 
		// 4 directions 1
		// les tours ont des pdv différents
		// 
    
	_owner: 0,
    HP: null,
    type: null,
    
    initialize: function() {
    },

	isEmpty: function(){
		return this._owner === 0;
	},
    
	getOwner: function(){
		return this._owner;
	},
    
	setOwner: function(owner) {
		this._owner = owner;
        this.type = this.$self.STONE_NORMAL;
        return this;
	},
    
    getType: function() {
        return this.type;   
    },
	
	isATurret: function() {
        return this.type !== null && this.type !== this.$self.STONE_NORMAL && this.type !== this.$self.STONE_TURRET4;
    },
    
    setType: function(type) {
		if (this.type == this.$self.STONE_TURRET4) alert('Obsolete setType');
        this.type = type;
		
		switch(this.type)
		{
			case this.$self.STONE_NORMAL:
				this.HP = 4;
				break;
        	case this.$self.STONE_TURRET4:
				alert('Obsolete TURRET4 in setOwner');
				break;
			case this.$self.TURRET_UNI_UP:
			case this.$self.TURRET_UNI_RIGHT:
			case this.$self.TURRET_UNI_DOWN:
			case this.$self.TURRET_UNI_LEFT:
				this.HP = 3;
				break;
			case this.$self.TURRET_DUO_HORIZONTAL:
			case this.$self.TURRET_DUO_VERTICAL:
				this.HP = 2;
				break;
			case this.$self.TURRET_QUADRATURE:
				this.HP = 1;
				break;
			default:
				alert('Type inconnu in setOwner');
		}
		
        return this;
    },
                                           
	removeStone: function(){
		this._owner = 0;
		this.type = null;
	},
    
    getHP: function(){
        return this.HP;   
    },

    setHP: function(HP){
        this.HP = HP;
    },
    
    getHit: function(){
        this.HP = this.HP-1;   
        if (this.HP <= 0)
        {
            this._owner = 0;
            this.type = null;
        }
    },
	
	wouldDieIfItGotHit: function(){
        return this.HP <= 1;
    }


});