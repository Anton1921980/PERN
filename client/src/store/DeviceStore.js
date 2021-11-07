import { makeAutoObservable } from 'mobx'

export default class DeviceStore
{
    constructor ()
    {
        this._types = [
            // { id: 1, name: 'Холодильники' },
            // { id: 2, name: 'Смартфоны' },


        ]
        this._brands = [
            // { id: 1, name: 'Samsung' },
            // { id: 2, name: 'Apple' },


        ]
        this._devices = [
            // { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 2, name: 'Iphone 12pro', price: 158566, rating: 2, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },

        ]
        this._baskets = []
        this._selectedType = {}
        this._selectedBrand = {}
        this._selectedBasket = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 6

        //mobx следит за ппеременными и перерендерит при изменении
        makeAutoObservable( this )
    }

    //экшены
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
    setBaskets ( basket )
    {
        this._baskets = basket
    }
    setSelectedType ( types )//type?
    {
        this.setPage( 1 )
        this._selectedType = types
    }
    setSelectedBrand ( brands )//brand?
    {
        this.setPage( 1 )
        this._selectedBrand = brands
    }
    setSelectedBasket ( basket )
    {      
        this._selectedBasket = basket
    }
    setPage ( page )
    {
        this._page = page
    }
    setTotalCount ( count )
    {
        this._totalCount = count
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
    get basket ()
    {
        return this._baskets
    }
    get selectedType ()
    {
        return this._selectedType
    }
    get selectedBrand ()
    {
        return this._selectedBrand
    }
    get selectedBasket ()
    {
        return this._selectedBasket
    }
    get totalCount ()
    {
        return this._totalCount
    }
    get page ()
    {
        return this._page
    }
    get limit ()
    {
        return this._limit
    }
}


