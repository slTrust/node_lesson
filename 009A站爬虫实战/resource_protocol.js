class Resource {
    constructor(){
        this._id = '';
    }
    static getUUID(oriThirdPartyId){

    }

    static getIdByUUID(){

    }

    static getUUIDById(){

    }
}

class DouBanNoteResource extends Resource{
    constructor(){
        super()
    }

    static get['UUID_PREF'] (){
        return `https://www.douban.com/note/`;
    }

    static getUUID(oriThirdPartyId){
        return `${DouBanNoteResource.UUID_PREF}${oriThirdPartyId}`;
    }

    static getOriginalThirdPartyId(UUID){
        return UUID.split(DouBanNoteResource.UUID_PREF)[1];
    }

    static getIdByUUID(UUID){
        return UUID;
    }

    static getUUIDById(ID){
        return ID;
    }
}