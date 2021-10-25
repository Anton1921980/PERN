import { makeAutoObservable } from 'mobx'

export default class UserStore
{
    constructor ()
    {
        this._isAuth = false
        this._user = {}
         //mobx следит за ппеременными и перерендерит при изменении
        makeAutoObservable( this )       
    }

    setIsAuth ( bool )
    {
        this._isAuth = bool
    }
    setUser ( user )
    {
        this._user = user
    }
    //геттеры (computed functions) чтобы получать переменные из состояния
    // вызываются только если переменная была изменена
    //состояние прокидываем Context
    get isAuth(){
        return this._isAuth
    }
    get user(){
        return this._user
    }
}
