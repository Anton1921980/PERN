import React, { useState, useContext, useEffect } from "react";
import { Col, Container } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchTypes } from "../http/deviceAPI";
import { SliderHomepage } from "../components/Slider/Slider";
import TypeBar from "../components/TypeBar";
import { useHistory } from "react-router-dom";
import "../scss/styles.scss";

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
    setTimeout(() => setPlaying(true), 1000);
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
      <Container
        className={`
  
       d-flex flex-column flex-lg-row mt-3`}
      >
        <Col className="col-12 ">
          <div style={{ cursor: "pointer" }} onClick={handleClick}>
            {playing ? (
              <video
                width="100%"
                height="100%"
                autoPlay
                onEnded={() => setPlaying(false)}
              >
                <source
                  src={process.env.REACT_APP_NODE_ENV==="development"?`${process.env.REACT_APP_API_URL}parser.mp4`:"https://youtu.be/9mbjmzAUAbw"}
                  type="video/mp4"
                />
             Sorry, your browser does not support video tags
              </video>
            ) : (
              <img
                src={`${process.env.REACT_APP_API_URL}parser-thumb.jpg`}
                alt="placeholder"
                width="100%"
                height="100%"
              />
            )}
          </div>
        </Col>
      </Container>
    </>
  );
});

export default Main;
