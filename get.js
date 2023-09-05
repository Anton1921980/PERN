const Nightmare = require( 'nightmare' );
const cheerio = require( 'cheerio' );
const uuid = require( 'uuid' );
const path = require( 'path' );
var axios = require( "axios" );
var http = require( "https" );
var fs = require( "fs" );
console.log( "start" );

let type;
let brand;


type = 'phone';
// type = 'tv'
// type = 'notebook'
// type = 'tablet'


brand = 'apple'
// brand = 'samsung'
// brand = 'xiaomi'
// brand = 'HP'
// brand = 'lenovo'
// brand='motorola'

let typeId;
let brandId;

if ( type === 'phone' )
{
    typeId = 1
} else if ( type === 'tv' )
{
    typeId = 2
} else if ( type === 'notebook' )
{
    typeId = 3
}
else if ( type === 'tablet' )
{
    typeId = 4
}



if ( brand === 'apple' )
{
    brandId = 1
}
else if ( brand === 'samsung' )
{
    brandId = 2
}
else if ( brand === 'HP' )
{
    brandId = 3
}
else if ( brand === 'lenovo' )
{
    brandId = 4
}
else if ( brand === 'motorola' )
{
    brandId = 5
}
else if ( brand === 'xiaomi' )
{
    brandId = 6
}

let device = {}
const nightmare = Nightmare( {
    // switches: { 'proxy-server': 'https://188.170.233.103:3128' },
    width: 600,
    height: 700,
    show: true
} );



var pageUrls = [
    'https://rozetka.com.ua/tablets/c130309/producer=apple;sell_status=available/',
    // 'https://rozetka.com.ua/mobile-phones/c80003/gotovo-k-otpravke=1;producer=apple;seller=rozetka/', //status=available или gotovo-k-otpravke=1 наче цена не парсится и ошибка

];

for ( let i = 0; pageUrls.length > i; i++ )
{
    let pageUrl = pageUrls[ i ];  

    nightmare
        .goto( pageUrl )
        .wait( 'body' )
        .wait( '.goods-tile__heading.ng-star-inserted' )
        .evaluate( () => document.querySelector( 'body' ).innerHTML )
        .then( response =>
        {
            console.log( getData0( response ) );
        } ).catch( err =>
        {
            console.log( err );
        }
        )
}

function getData0 ( html )
{
    data = [];
    const $ = cheerio.load( html );

    let link = $( ".goods-tile__inner>a" );
    let links = [];
    link.each( function ( i, val )
    {
        var linkItem = $( val ).attr( "href" );
        links.push( linkItem );
    } );  

    [ ...new Set( links ) ] 

    getProducts( links )

    return links
}


async function getProducts ( links )
{
    // for await ( const link of links )//async loop with functions ES2018
    // {
    ( async () =>
    {
        // const j = 10;
        for ( let i = 0; i < links.length; i++ )
        {
            // wait for the promise to resolve before advancing the for loop
            let link = links[ i ]
            await getProduct( link );
            console.log( i );
        }
    } )()


    async function getProduct ( link )
    {
        // const url = 'https://rozetka.com.ua/samsung_sm_a022gzkbsek/p272333776/';
        const url_2 = link + 'characteristics';
        const url_3 = link + 'photo';

        let device = {}

        await nightmare
            .goto( url_2 )
            .wait( 'body' )
            //  .wait( 'tabs__list' )
            // .click( 'tabs__list:nth-child(2)' )
            .wait( '.buy-button.ng-star-inserted' )
            .evaluate( () => document.querySelector( 'body' ).innerHTML )
            // .end()
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
            .evaluate( () => window.scrollTo( 0, 300 ) )
            .wait( '.product-photos__picture.ng-lazyloaded' )
            .evaluate( () => document.querySelector( 'body' ).innerHTML )
            // .end()
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

            let devicePrice 
            $( ".product-carriage__price" ) ?
                devicePrice = +( $( ".product-carriage__price" ).text() ).replace( /\D+/g, "" )
                : devicePrice = +( $( ".product-prices__big" ).text() ).replace( /\D+/g, "" );      

            let deviceName = $( 'h1' ).text();       
            device = {
                name: deviceName,
                price: devicePrice,
                brandId: brandId,
                typeId: typeId,
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
            
            let imgMain = $( ".product-photos__picture.ng-lazyloaded" ).attr( 'src' )
            console.log( "TCL: imgMain", imgMain )

            imgNameFile( imgMain )

        }




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
                    let fileName = uuid.v4() + ".jpg" 
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
                    device.img = fileName;

                    addProduct( device )

                } );
            } )

        }


        function addProduct ( device )
        {
            axios
                .post( "http://localhost:5000/api/user/login", {
                    email: "customer@gmail.com",
                    password: "1111111"
                } )
                .then( response =>
                {
                    let token = response.data.token;

                    axios
                        .post( "http://localhost:5000/api/device", device, {
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

    }
    // )( link )

    // }
}

