class Generate {

    constructor (){
        this.idArtist = 0;
        this.idAlbum = 0;
        this.idTrack = 0;
        this.idPlaylist = 0;
        this.idUser = 0;
    }

    generateIdAlbum(){
        return ++this.idAlbum;
    }

    generateIdArtist(){
        return ++this.idArtist;
    }

    generateIdTrack(){
        return ++this.idTrack;
    }

    generateIdPlaylist(){
        return ++this.idPlaylist;
    }

    generateIdUser(){
        return ++this.idUser;
    }

}

module.exports = Generate;