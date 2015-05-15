var Go = function(M,V,C,taille) {
    this.model = new M(this);
    this.view = new V(this);
    this.controller = new C(taille);
    this.taille = taille;
    this.joueurAQuiCestLeTour = 0;
}