import React, { useState, useContext, useEffect, useRef } from "react";
import { Col, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchTypes } from "../http/deviceAPI";
import { SliderHomepage } from "../components/Slider/Slider";
import TypeBar from "../components/TypeBar";
import { useHistory } from "react-router-dom";
import "../scss/styles.scss";
import ParserVideo from "../components/ParserVideo";


const Main = observer(() => {
  const { device } = useContext(Context);
  const history = useHistory();
  const [playing, setPlaying] = useState(false);
  //   const fade = playing ? 'fadeOut' : 'fadeIn';


  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
    fetchBrands().then((data) => device.setBrands(data));
  }, []);

  useEffect(() => {
    if (+device.selectedType.id > 0) {
      let query = `&types=${device.selectedType.id}&page=${device.page}&limit=${device.limit}`;
      history.push(`/shop/?${query}`);
    }
  }, [device.selectedType.id]);

  const handleClick = () => {
    !playing ? setPlaying(true) : setPlaying(false);
  };

  return (
    <>
      {!playing && (
        //   ${fade}
        <Container className={`d-flex flex-column flex-lg-row mt-3`}>
          <Col className="col-12 col-lg-6">
            <TypeBar main="main" />
          </Col>
          <Col className="col-12 col-lg-6">
            <SliderHomepage
              dots={true}
              center={false}
              auto={true}
              homePage={true}
              show={1}
              width={"100%"}
              arrows={false}
            />
          </Col>
        </Container>
      )}
      <ParserVideo playing={playing} handleClick={handleClick} setPlaying={setPlaying}/>   
    </>
  );
});

export default Main;
