class Generate {

    constructor (){
        this.idArtist = 1;
        this.idAlbum = 1;
        this.idTrack = 1;
        this.idPlaylist = 1;
        //Consulta
        this.idUser = 1;
    }

    generateIdAlbum(){
        return  this.idAlbum++;
    }

    generateIdArtist(){
        return  this.idArtist++;
    }

    generateIdTrack(){
        return  this.idTrack++;
    }

    generateIdPlaylist(){
        return  this.idPlaylist++;
    }

    generateIdUser(){
        return  this.idUser++;
    }

}

module.exports = Generate;