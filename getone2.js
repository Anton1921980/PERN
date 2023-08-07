
const Nightmare = require("nightmare");
const cheerio = require("cheerio");
const uuid = require("uuid");
const path = require("path");
var axios = require("axios");
var http = require("https");
var fs = require("fs");
const translate = require("google-translate-api");
const { remove } = require("cheerio/lib/api/manipulation");

console.log("start");

let type = "phone";
let brand = "iphone";

async function getResult(data) {
    const url = data;
    let device = {};

    const nightmare = Nightmare({ show: true });

    const response_1 = await nightmare
        .goto(`${url}characteristics`)
        .wait("body")
        .wait(".buy-button.ng-star-inserted")
        .evaluate(() => document.querySelector("body").innerHTML);

    await getData(response_1);

    const response_2 = await nightmare
        .goto(url)
        .wait(".picture-container__picture")
        .evaluate(() => document.querySelector("body").innerHTML)
        .end();

    await getData1(response_2);

    async function getData(html) {
        const $ = cheerio.load(html);
        const descriptionText = $(".ng-star-inserted>.characteristics-full__label>*").append(":").text();
        const descriptionItems = descriptionText.split(":");
        const valueText = $(".characteristics-full__value").append(":").text();
        const valueItems = valueText.split(":");
        const info1 = descriptionItems.map((item, index) => {
            return {
                title: item,
                description: valueItems[index],
                number: Date.now(),
            };
        });
        const info = JSON.stringify(info1);

        const devicePrice = $(".product-carriage__price")
            ? +$(".product-carriage__price").text().replace(/\D+/g, "")
            : +$(".product-prices__big").text().replace(/\D+/g, "");

        const deviceNameRaw = $("h1").text();

        await removeWordAndParentheses(deviceNameRaw, devicePrice, info);
    }

    async function removeWordAndParentheses(text, devicePrice, info) {
        const removeWord = text.replace(/Характеристики/g, "");
        const removeWordArr = removeWord.split(" ");
        const typeWordRaw = removeWordArr[1].split(" ").join("").toLowerCase();
        const brandWord = removeWordArr[2];

        if (typeWordRaw.length) {
            const encodedTypeWord = encodeURIComponent(typeWordRaw);
            const url = `https://libretranslate.de/translate?q=${encodedTypeWord}&source=uk&target=en`;
            const response = await axios.post(url);

            const translatedText = response.data.translatedText;

            device = {
                name: removeWord,
                price: devicePrice,
                brandId: brandWord,
                typeId: translatedText,
                info: info,
            };
        }
    }

    async function getData1(html) {
        const $ = cheerio.load(html);
        const imgMain = $(".picture-container__picture").attr("src");
        await imgNameFile(imgMain);
    }

    async function imgNameFile(imgMain) {
        await new Promise((resolve, reject) => {
            http.get(imgMain, function (res) {
                let imagedata = "";
                res.setEncoding("binary");

                res.on("data", function (chunk) {
                    imagedata += chunk;
                });

                res.on("end", function () {
                    const fileName = `${uuid.v4()}.jpg`;
                    device.img = fileName;
                    fs.writeFile(
                        path.resolve(__dirname, "..", "PERN/static", fileName),
                        imagedata,
                        "binary",
                        function (err) {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                console.log("File saved.");
                                resolve();
                            }
                        }
                    );
                });
            });
        });

        await addProduct(device);
    }

    async function addProduct(device) {
      try {
        const loginResponse = await axios.post("http://localhost:5000/api/user/login", {
          email: "customer@gmail.com",
          password: "1111111",
        });
    
        const token = await loginResponse.data.token;
    
        const deviceResponse = await axios.post("http://localhost:5000/api/device", device, {
          headers: { authorization: `Bearer ${token}` },
        });
        await deviceResponse.data
        // console.log("deviceResponse.data",await deviceResponse.data);
      } catch (err) {
        console.log("TCL: addProduct -> err", err);
      }
    }
    return device;
}

module.exports = getResult;
