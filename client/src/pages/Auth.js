import React, { useContext, useState } from "react";
import { Container, Form, Card, Button } from "react-bootstrap";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { addtoBasket, getBasket } from "../http/deviceAPI";

const Auth = observer(() => {
  const location = useLocation();
  const { user, device } = useContext(Context);
  let isLogin = location.pathname === LOGIN_ROUTE;
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const add = async (id) => {
    const formData = new FormData();
    await formData.append("deviceId", id);
    await addtoBasket(formData);
    await getBasket().then((data) => device.setBaskets(data));
  };

  const click = async () => {
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password);
      }
      user.setUser(data);
      user.setIsAuth(true);
//add localbasket ifit exists to those witch was in base, or was just created with new user  
      let localBasket = JSON.parse(localStorage.getItem("ids"));
      localBasket &&
        localBasket.forEach((id) => {
          add(id);
        });
      localStorage.removeItem("ids");
      device.setLocalBasket("");

      history.push(SHOP_ROUTE);
    } catch (e) {
      console.log(e.response.data.message);
    }
  }; 

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: window.innerHeight - 54 }}
    >
      <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Login" : "Register"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-2"
            placeholder="Input e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="em"
          />
          <Form.Control
            className="mt-2"
            placeholder="Input password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                not Registered?
                <NavLink to={REGISTRATION_ROUTE}>Register</NavLink>
              </div>
            ) : (
              <div>
                have account?<NavLink to={LOGIN_ROUTE}>Login</NavLink>
              </div>
            )}
            <Button variant={"outline-success"} onClick={click}>
              {isLogin ? "Login" : "Registration"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
