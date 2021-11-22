import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SampleNextArrow, SamplePrevArrow } from "./Arrows";
import { Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import
{
  CarouselWrapper,
  CarouselImage,
  SliderPromo,
  SliderPromoMobile,
  SliderPromoText,
  SliderPromoButton,
  H4
} from "./slider.styles";



export const SliderHomepage = props =>
{
  const settings = {
    slidesToShow: props.show,
    accessibility: true,
    dots: props.dots,
    arrows: true,
    infinite: true,
    draggable: true,
    autoplay: props.auto,
    speed: 1000,
    nextArrow: <SampleNextArrow homePage={ props.homePage } right={ 22 } />,
    prevArrow: (
      <SamplePrevArrow homePage={ props.homePage } left={ 70 } prev={ -3 } />
    ),
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          nextArrow: <SampleNextArrow homePage={ true } right={ 40 } />,
          prevArrow: <SamplePrevArrow homePage={ true } left={ 40 } />
        }
      },
      {
        breakpoint: 798,
        settings: {
          dots: false,
          slidesToShow: 1,
          nextArrow: <SampleNextArrow homePage={ true } right={ 40 } />,
          prevArrow: <SamplePrevArrow homePage={ true } left={ 40 } />
        }
      }
    ]
  };

  // const [ slides, setSlides ] = useState( [] );
  // useEffect( () =>
  // {
  //   axios
  //     .get( "/slides" )
  //     .then( result =>
  //     {
  //       setSlides( result.data );
  //     } )
  //     .catch( err =>
  //     {
  //       console.log( err );
  //     } );
  // }, [] );
  const slides = [
    <Image style={ { objectFit: 'contain', width: '100%', height: '100%' } }
      src={ 'ip12promax.jpg' } />,
    <Image style={ { objectFit: 'contain', width: '100%', height: '100%' } }
      src={ 'iphoneairpods.jpg' } />,
    <Image style={ { objectFit: 'contain', width: '100%', height: '100%' } }
      src={ 'iphone13.jpg' } />,

  ]

  const itemsHomePage = slides.slice( 0, 3 );
  // const items = slides.slice( 3 );

  if ( props.homePage === true )
  {
    return (
      <CarouselWrapper className="carousel_wrapper">
        <Slider { ...settings }>
          { itemsHomePage.map( (item,i )=>
          {
            return (
              <div key={ i }>
                <NavLink to={ '/shop' }>
                  <CarouselImage height={ props.height } >
                    { item }
                  </CarouselImage>
                </NavLink>
              </div>
            );
          } ) }
        </Slider>
      </CarouselWrapper>
    );

  }
};
