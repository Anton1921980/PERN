const Nightmare = require( 'nightmare' );
const cheerio = require( 'cheerio' );
const uuid = require( 'uuid' );
const path = require( 'path' );
var axios = require( "axios" );
var http = require( "https" );
var fs = require( "fs" );

console.log( "start" );

let type = 'смартфоны';
let brand = 'samsung';


// ; перед функцией!
( async () =>
{
    const url = 'https://rozetka.com.ua/planshet-apple-ipad-mini-2021-wi-fi-64gb/g41556667/';
    const url_2 = url + 'characteristics'
    const url_3 = url + 'photo'

    let device = {}

    const nightmare = Nightmare( { show: true } );

    await nightmare
        .goto( url_2 )
        .wait( 'body' )
        //  .wait( 'tabs__list' )
        // .click( 'tabs__list:nth-child(2)' )
        .wait( '.buy-button.ng-star-inserted' )
        .evaluate( () => document.querySelector( 'body' ).innerHTML )
        .then( response =>
        {
            console.log( getData( response ) );
        } ).catch( err =>
        {
            console.log( err );
        }
        )

    await nightmare
        .goto( url_3 )
        .wait( 'body' )
        .evaluate( () => window.scrollTo( 0, 700 ) )
        .wait( '.product-photos__picture.ng-lazyloaded' )
        .evaluate( () => document.querySelector( 'body' ).innerHTML )
        .end()
        .then( response =>
        {
            console.log( getData2( response ) );
        } )
        .catch( err =>
        {
            console.log( err );
        } )

    function getData ( html )
    {
        data = [];
        const $ = cheerio.load( html );
        //характеристики {} 
        let th1 = $( ".ng-star-inserted>.characteristics-full__label>*" ).append( ":" ).text();//этот меня устраивает
        let th = th1.split( ":" );

        let td1 = $( ".characteristics-full__value" ).append( ":" ).text()
        let td = td1.split( ":" );

        let info1 = [];
        for ( var i = 0; i < th.length; i++ )
        {
            info1[ i ] = {
                "title": th[ i ],
                "description": td[ i ],
                "number": Date.now(),
            }
        }
        let info = JSON.stringify( info1 )

        let devicePrice // убрать пробелы и грн " 10 999₴"
        $( ".product-carriage__price" ) ?
            devicePrice = +( $( ".product-carriage__price" ).text() ).replace( /\D+/g, "" )
            : devicePrice = +( $( ".product-prices__big" ).text() ).replace( /\D+/g, "" )

        console.log( "TCL: price", devicePrice )

        let deviceName = $( 'h1' ).text();
        console.log( "TCL: deviceName", deviceName )
        console.log( "TCL: info", info )
        device = {
            name: deviceName,
            price: devicePrice,
            brandId: '2',
            typeId: '2',
            // img: fileName,
            // info: '[{"title":"test8","description":"test9","number":1635838157222},{"title":"test9","description":"test8","number":1635838158222}]',
            info: info,
        }
        return device
    }

    function getData2 ( html )
    {
        data = [];
        const $ = cheerio.load( html );
        //фото

        let imgMain = $( ".product-photos__picture.ng-lazyloaded" ).attr( 'src' )
        console.log( "TCL: imgMain", imgMain )

        imgNameFile( imgMain )
    }

    addProduct( device )


    function imgNameFile ( imgMain )
    {
        http.get( imgMain, function ( res )
        {
            var imagedata = "";
            res.setEncoding( "binary" );

            res.on( "data", function ( chunk )
            {
                imagedata += chunk;
            } );

            res.on( "end", function ()
            {
                let fileName = uuid.v4() + ".jpg" //создаем уникальное имя
                console.log( "TCL: fileName", fileName )
                fs.writeFile(
                    path.resolve( __dirname, '..', 'static', fileName ),
                    imagedata,
                    "binary",
                    function ( err )
                    {
                        if ( err ) throw err;
                        console.log( "File saved." );
                    }
                );
                return device.img = fileName
            } );
        } )


    }


    function addProduct ( device )
    {
        axios
            .post( `${process.env.API_URL}/api/user/login`, {
                email: "customer@gmail.com",
                password: "1111111"
            } )
            .then( response =>
            {
                let token = response.data.token;

                axios
                    .post( `${process.env.API_URL}/api/device`, device, {
                        headers: { authorization: `Bearer ${ token }` }
                    } )
                    .then( device =>
                    {
                        console.log( device );
                    } )
                    .catch( err =>
                    {
                        console.log( "TCL: addProduct -> err", err );
                    } );
            } )
            .catch( err =>
            {
                console.log( "TCL: addProduct -> err", err );
            } );
    }

} )
    ()

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












