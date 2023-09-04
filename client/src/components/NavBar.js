import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  MAIN_ROUTE,
  SHOP_ROUTE,
} from "../utils/consts";

import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useHistory } from "react-router-dom";
import { getBasket } from "../http/deviceAPI";
import {
  PersonLock,
  PersonGear,
  Cart,
  BoxArrowRight,
  Basket,
} from "react-bootstrap-icons";
import { BaseError } from "sequelize";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const { device } = useContext(Context);
  const history = useHistory();
  const [font, setFont] = useState([10, "normal"]);
  const [basketLocal, setBasketLocal] = useState("");
const [basketQuantity, setBasketQuantity] = useState("")
  useEffect(() => {
    setFont([15, "bold"]);
    setTimeout(() => {
      setFont([10, "normal"]);
    }, 1500);
    device.localBasket
      ? setBasketLocal(device.localBasket)
      : setBasketLocal("");
    console.log("TCL: basketLocal 2", basketLocal);
  }, [device.localBasket]);

  useEffect(() => {
    let length2 =
      JSON.parse(localStorage.getItem("ids")) &&
      JSON.parse(localStorage.getItem("ids")).length;
    length2 ? setBasketLocal(length2) : setBasketLocal("");
    console.log("TCL: basketLocal", length2);
    setTimeout(() => {
      setFont([15, "bold"]);
    }, 1500);
  }, []);

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
  };

  useEffect(() => {
    setFont([14, "bold"]);
    getBasket().then((data) => {

      setBasketQuantity([data?.length?.toString()]);

      setTimeout(() => {
        setFont([10, "normal"]);
      }, 1500);
    });
  }, [device.baskets]);

  return (
    <Navbar
      expand="lg"
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#9ab1af",
      }}
    >
      <Container style={{ height: "fit-content" }}>
        <NavLink
          style={{ color: "white", textDecoration: "none", fontSize: "40px" }}
          onClick={() => device.setSelectedType("")}
          to={MAIN_ROUTE}
        >
          Idevice
        </NavLink>
        <div className="d-flex flex-row flex-no-wrap justify-content-between">
          <div className="mr-3">
            {user.isAuth ? (
              <Nav
                className="flex-row"
                style={{ maxHeight: "100px", color: "white" }}
              >
                <PersonGear
                  style={{
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    width: 37,
                    height: 34,
                    backgroundSize: "cover",
                    color: "white",
                    cursor: "pointer",
                    marginRight: "20px",
                  }}
                  variant={"outline-light"}
                  onClick={() => history.push(ADMIN_ROUTE)}
                />
                <BoxArrowRight
                  style={{
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    width: 35,
                    height: 35,
                    backgroundSize: "cover",
                    color: "white",
                    cursor: "pointer",
                    marginRight: "20px",
                  }}
                  variant={"outline-light"}
                  onClick={() => logOut()}
                  className="ml-2"
                />
              </Nav>
            ) : (
              <Nav style={{ maxHeight: "100px", color: "white" }}>
                <PersonLock
                  style={{
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    width: 37,
                    height: 34,
                    backgroundSize: "cover",
                    color: "white",
                    cursor: "pointer",
                    marginRight: "20px",
                    position: "relative",
                    bottom: "1px",
                  }}
                  variant={"outline-light"}
                  onClick={() => history.push(LOGIN_ROUTE)}
                />
              </Nav>
            )}
          </div>
          <div>
            <Nav>
              <div
                style={{ position: "relative", cursor: "pointer" }}
                className="mr-2 d-flex justify-content-center align-items-end"
                onClick={() =>
                  user.isAuth
                    ? history.push(BASKET_ROUTE)
                    : alert("Please login or register to see basket")
                }
              >
                <Cart
                  style={{
                    width: 35,
                    height: 35,
                    backgroundSize: "cover",
                    color: "white",
                    position: "relative",
                    bottom: "1px",
                  }}
                ></Cart>
                <span
                  style={{
                    fontSize: font[0],
                    fontWeight: font[1],
                    position: "absolute",
                    bottom: "0.8rem",
                    color: "white",
                  }}
                >
                  {user.isAuth
                    ? basketQuantity
                    : basketLocal}
                </span>
              </div>
            </Nav>
          </div>
        </div>
      </Container>
    </Navbar>
  );
});

export default NavBar;
