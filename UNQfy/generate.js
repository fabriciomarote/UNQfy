class Generate {

    constructor (){
        this.idAlbum = 1;
        this.idArtist = 1;
        this.idTrack = 1;
        this.idPlaylist = 1;
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

}

module.exports = Generate;