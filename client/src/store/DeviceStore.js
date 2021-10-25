import { makeAutoObservable } from 'mobx'

export default class DeviceStore
{
    constructor ()
    {
        this._types = [
            // { id: 1, name: 'Холодильники' },
            // { id: 2, name: 'Смартфоны' },
            // { id: 3, name: 'Ноутбуки' },
            // { id: 4, name: 'Телевизоры' },

        ]
        this._brands = [
            // { id: 1, name: 'Samsung' },
            // { id: 2, name: 'Apple' },
            // { id: 3, name: 'Xiaomi' },
            // { id: 4, name: 'Meizu' },
            // { id: 5, name: 'Lenovo' },

        ]
        this._devices = [
            // { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 2, name: 'Iphone 12pro', price: 158566, rating: 2, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 3, name: 'Iphone 12pro', price: 158566, rating: 4, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 4, name: 'Iphone 12pro', price: 158566, rating: 1, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 5, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 6, name: 'Iphone 12pro', price: 158566, rating: 2, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 7, name: 'Iphone 12pro', price: 158566, rating: 4, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
            // { id: 8, name: 'Iphone 12pro', price: 158566, rating: 1, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
        ]
        this._selectedType = {}
        this._selectedBrand = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 3

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
    setSelectedType ( types )//type?
    {
        this.setPage(1)
        this._selectedType = types
    }
    setSelectedBrand ( brands )//brand?
    {
        this.setPage(1)
        this._selectedBrand = brands
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
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
    get selectedType ()
    {
        return this._selectedType
    }
    get selectedBrand ()
    {
        return this._selectedBrand
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}


