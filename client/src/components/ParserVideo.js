import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container } from "react-bootstrap";
import YouTube from "react-youtube";

const ParserVideo = observer(({playing, handleClick, setPlaying}) => {
  
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, [playing]);

  return (
    <Container
      className={`

   d-flex flex-column flex-lg-row mt-3`}
    >
      <Col className="col-12 ">
        <div
          style={{ cursor: "pointer", height: playing ? "100vh" : "100%" }}
          onClick={handleClick}
        >
          {playing ? (
            process.env.REACT_APP_NODE_ENV === "development" ? (
              <video
                ref={videoRef}
                width="100%"
                height="100%"
                autoPlay
                onEnded={() => setPlaying(false)}
              >
                <source
                  src={
                    process.env.REACT_APP_NODE_ENV === "development"
                      ? `${process.env.REACT_APP_API_URL}parser.mp4`
                      : "https://youtu.be/embed/9mbjmzAUAbw"
                  }
                  type="video/mp4"
                />
                Sorry, your browser does not support video tags
              </video>
            ) : (
              // use the YouTube component instead of iframe
              <YouTube
                videoId="9mbjmzAUAbw"
                opts={{
                  height: "500rem",
                  width: "100%",
                  si: "sfszc0umNfyarO8t", // additional parameters
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                  allowFullScreen: true,

                  playerVars: {
                    playbackRate: 2,
                    setPlaybackRate: 2,
                    showinfo: 0,
                    modestbranding: 1,
                  },
                }}
                onEnd={() => setPlaying(false)}
              ></YouTube>
            )
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
  );
});

export default ParserVideo;
