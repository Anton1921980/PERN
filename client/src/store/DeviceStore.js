import { makeAutoObservable } from 'mobx'

export default class DeviceStore
{
    constructor ()
    {
        this._types = [
            { id: 1, name: 'Холодильники' },
            { id: 2, name: 'Смартфоны' }
        ]
        this._brands = [
            { id: 1, name: 'Samsung' },
            { id: 2, name: 'Apple' },
        ]
        this._devices = [
            { id: 1, name: 'Iphone 12pro', price: 158566, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            { id: 2, name: 'Iphone 12pro', price: 158566, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            { id: 3, name: 'Iphone 12pro', price: 158566, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            { id: 4, name: 'Iphone 12pro', price: 158566, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' }

        ]
        //mobx следит за ппеременными и перерендерит при изменении
        makeAutoObservable( this )
    }

    setTypes ( types )
    {
        this._types = types
    }
    setBrands ( brands )
    {
        this._brands = brands
    }
    setDevices ( devices )
    {
        this._devices = devices
    }
    //геттеры (computed functions) чтобы получать переменные из состояния
    // вызываются только если переменная была изменена
    //состояние прокидываем Context
    get types ()
    {
        return this._types
    }
    get brands ()
    {
        return this._brands
    }
    get devices ()
    {
        return this._devices
    }
}
