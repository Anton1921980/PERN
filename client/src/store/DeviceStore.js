import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._types = [
      // { id: 1, name: 'Холодильники' },
      // { id: 2, name: 'Смартфоны' },
    ];
    this._brands = [
      // { id: 1, name: 'Samsung' },
      // { id: 2, name: 'Apple' },
    ];
    this._alltypes = [
      // { id: 1, name: 'Samsung' },
      // { id: 2, name: 'Apple' },
    ];
    this._allbrands = [
      // { id: 1, name: 'Samsung' },
      // { id: 2, name: 'Apple' },
    ];
    this._devices = [
      // { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
      // { id: 2, name: 'Iphone 12pro', price: 158566, rating: 2, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
    ];
    this._alldevices = [
      // { id: 1, name: 'Iphone 12pro', price: 158566, rating: 5, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
      // { id: 2, name: 'Iphone 12pro', price: 158566, rating: 2, img: 'https://content1.rozetka.com.ua/goods/images/big/173869349.jpg' },
    ];
    this._localBasket = [];
    this._baskets = [];
    this._selectedType = ""; //{}
    this._selectedBrands = []; //{}
    this._selectedInfos = {};
    this._selectedBasket = {};
    this._page = 1;
    this._sort = "";
    this._totalCount = 0;
    this._limit = 3;

    //mobx следит за ппеременными и перерендерит при изменении
    makeAutoObservable(this);
  }

  //экшены
  setLimit(limit) {
    this._limit = limit;
  }

  setTypes(types) {
    this._types = types;
  }
  setBrands(brands) {
    this._brands = brands;
  }
  setAlltypes(alltypes) {
    this._alltypes = alltypes;
  }
  setAllbrands(allbrands) {
    this._allbrands = allbrands;
  }
  setDevices(devices) {
    this._devices = devices;
  }
  setAlldevices(alldevices) {
    this._alldevices = alldevices;
  }
  setBaskets(basket) {
    this._baskets = basket;
  }
  setLocalBasket(basketLocal) {
    this._localBasket = basketLocal;
  }
  setSelectedType(
    types
  ) {
    this.setPage(1);
    this._selectedType = types;
  }
  setSelectedBrands(
    brands
  ) {
    this.setPage(1);
    this._selectedBrands = brands;
  }
  setSelectedInfos(
    infos
  ) {
    this.setPage(1);
    this._selectedInfos = infos;
  }
  setSelectedBasket(basket) {
    this._selectedBasket = basket;
  }
  setPage(page) {
    this._page = page;
  }
  setSort(sort) {
    // this.setPage( 1 )
    this._sort = sort;
  }
  setTotalCount(count) {
    this._totalCount = count;
  }
  //геттеры (computed functions) чтобы получать переменные из состояния
  // вызываются только если переменная была изменена
  //состояние прокидываем Context
  get types() {
    return this._types;
  }
  get brands() {
    return this._brands;
  }
  get allbrands() {
    return this._allbrands;
  }
  get alltypes() {
    return this._alltypes;
  }
  get devices() {
    return this._devices;
  }
  get alldevices() {
    return this._alldevices;
  }
  get basket() {
    return this._baskets;
  }
  get localBasket() {
    return this._localBasket;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedBrands() {
    return this._selectedBrands;
  }
  get selectedInfos() {
    return this._selectedInfos;
  }
  get selectedBasket() {
    return this._selectedBasket;
  }
  get totalCount() {
    return this._totalCount;
  }
  get page() {
    return this._page;
  }
  get sort() {
    return this._sort;
  }
  get limit() {
    return this._limit;
  }
}
