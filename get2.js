const Nightmare = require("nightmare");
const cheerio = require("cheerio");
const uuid = require("uuid");
const path = require("path");
var axios = require("axios");
var http = require("https");
var fs = require("fs");
console.log("start");

async function getResults(data) {
  let device = {};

  const nightmare = Nightmare({
    // switches: { 'proxy-server': 'https://188.170.233.103:3128' },
    width: 600,
    height: 700,
    show: true,
  });

  var pageUrls = [
    data.data2,
    // "https://rozetka.com.ua/tablets/c130309/producer=apple;sell_status=available/",
    // 'https://rozetka.com.ua/mobile-phones/c80003/gotovo-k-otpravke=1;producer=apple;seller=rozetka/', //status=available или gotovo-k-otpravke=1 наче цена не парсится и ошибка
  ];
  let pageUrl;
  for (let i = 0; pageUrls?.length > i; i++) {
    pageUrl = pageUrls[i];

    console.log("TCL: pageUrl", pageUrl, pageUrl.length);
    pageUrl?.length &&
      nightmare
        .goto(pageUrl)
        .wait("body")
        .wait(".goods-tile__heading.ng-star-inserted")
        .evaluate(() => document.querySelector("body").innerHTML)
        .then((response) => {
          console.log(getData0(response));
        })
        .catch((err) => {
          console.log(err);
        });
  }
  nightmare.end();

  function getData0(html) {
    data = [];
    const $ = cheerio.load(html);

    let link = $(".goods-tile__inner>a");
    let links = [];
    link.each(function (i, val) {
      var linkItem = $(val).attr("href");
      links.push(linkItem);
    });

    [...new Set(links)]; //убираем повторы в массиве

    console.log("TCL: links", links);

    //     let link =  $( ".goods-tile__inner>a" ).append( "!" ).attr( "href" )
    //     let links =[]
    //     links = link.split( "!" );//массив ссылок на товары

    getProducts(links);

    return links;
  }

  async function getProducts(links) {
    // for await ( const link of links )//цикл с асинхронными функциями ES2018
    // {
    (async () => {
      for (
        let i = 0;
        i < 3;
        //  links.length;
        i++
      ) {
        // wait for the promise to resolve before advancing the for loop
        let link = links[i];
        console.log("link: ", link);
        await getProduct(link);
        console.log(i);
      }
    })();
    async function getProduct(link) {
      const getOneResult = require("./getone2.js");
      const result = await getOneResult(link);
      // console.log("result: ", result);
      return result;
    }
  }
}

module.exports = getResults;

// ; перед функцией!

// // let { name, price, brandId, typeId, img, info } = req.body
// // info [{"title":"333","description":"44","number":1635838152823},{"title":"555","description":"77","number":1635838158623}]
// // number:Date.now()

// let device = {
//     name: '756871133444444',
//     price: '777',
//     brandId: '2',
//     typeId: '2',
//     img: 'b7e4ecf9-0ed8-4a00-8544-6f309e1ddb3a.jpg',
//     info: '[{"title":"test5","description":"test5","number":1635838152555}]',
// }

// //взять массив ссылок на картинки из result.imageUrls
// // обрезать конец в название и сохранить в папку
// // добавить адрес папки  и записать в result.imageUrls_2

// //массив картинок
// //   var i = 0;
// //   while (result.imageUrls2.length > i) {
// //     let url3 = result.imageUrls2[i];
// //     // let ur14 = url3.replace(/iamge.*/i, "");
// //     request(url3);
// //     i++;
// //   }
