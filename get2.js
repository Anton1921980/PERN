const Nightmare = require("nightmare");
const cheerio = require("cheerio");

console.log("start");

async function getResults(data) {
  console.log("data2: ", data);

  let results = [];
  const nightmare = Nightmare({
    // switches: { 'proxy-server': 'https://188.170.233.103:3128' },
    width: 600,
    height: 700,
    show: true,
  });

  var pageUrls = [
    data.data,
    // "https://rozetka.com.ua/tablets/c130309/producer=apple;sell_status=available/",
    // 'https://rozetka.com.ua/mobile-phones/c80003/gotovo-k-otpravke=1;producer=apple;seller=rozetka/', //status=available или gotovo-k-otpravke=1 наче цена не парсится и ошибка
  ];
  let pageUrl;
  let counter = 0;
  for (let i = 0; pageUrls?.length > i; i++) {
    pageUrl = pageUrls[i];

    if (pageUrl?.length) {
      // only execute if pageUrl is not empty
      counter++;
      return (
        pageUrl?.length &&
        nightmare // add return
          .goto(pageUrl)
          .wait("body")
          .wait(".goods-tile__heading.ng-star-inserted")
          .evaluate(() => document.querySelector("body").innerHTML)
          .end()
          .then(async (response) => {
        
          
       
            return await getData0(response);
          })
          .catch((err) => {
            console.log(err);
          })
      );
    }
  }
  async function getData0(html) {
    // make this an async function
    data = [];
    const $ = cheerio.load(html);

    let link = $(".goods-tile__inner>a");
    let links = [];
    link.each(function (i, val) {
      var linkItem = $(val).attr("href");
      links.push(linkItem);
    });

    links = [...new Set(links)]; //remove duplicates

    console.log("TCL: links", links);

    //     let link =  $( ".goods-tile__inner>a" ).append( "!" ).attr( "href" )
    //     let links =[]
    //     links = link.split( "!" );//массив ссылок на товары

    return await getProducts(links); // add await and return
  }

  async function getProducts(links) {
  
    for (
      let i = 0;
      i < 3;
      //  links.length;
      i++
    ) {
      let link = links[i];

      await getProduct(link); // add await here
    }

    async function getProduct(link) {
      // make this an async function
      const getOneResult = require("./getone2.js");
      const resultItem = await getOneResult(link); // add await here

      results.push(resultItem); // no need to await here
    }
    return results; // no need to await here
  }

  return results;
}

module.exports = getResults;
