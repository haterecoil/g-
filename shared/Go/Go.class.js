var Go = dejavu.Class.declare({
	
	model: null,
	view: null,
	controller: null,
	taille: null,
	jouerAQuiCestLeTour: null,
	
	initialize: function(M,V,C,taille) {
		this.model = new M(this);
		this.view = new V(this);
		this.controller = new C(this);
		this.taille = taille;
		this.joueurAQuiCestLeTour = 0;
	}
});