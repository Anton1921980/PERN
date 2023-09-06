import React, { useEffect } from "react";
import { useContext } from "react";
import { Context } from "..";
import { addtoBasket, deleteFromBasket, getBasket } from "../http/deviceAPI";

import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";

const Basket = observer(() => {
  const { device } = useContext(Context);

  const currentBasket = async () => {
    try {
      const data = await getBasket();

      const modifiedData = data?.reduce((acc, currentItem) => {
        const foundItem = acc.find(
          (item) => item?.deviceId === currentItem?.deviceId
        );
        if (foundItem) {
          foundItem.quantity += 1;
        } else {
          currentItem.quantity = 1;
          acc.push(currentItem);
        }
        return acc;
      }, []);

      if (
        JSON.stringify(device.baskets) !== JSON.stringify(modifiedData) &&
        JSON.stringify(data) !== JSON.stringify(device.baskets)
      ) {
        device.setBaskets([...modifiedData]);
      }
    } catch (error) {
      console.error("Err while getting basket:", error);
    }
  };
  const addDeviceQuantity = async (id) => {
    const formData = new FormData();
    formData.append("deviceId", id);
    await addtoBasket(formData);
    await currentBasket();
  };

  useEffect(() => {
    const deleteAndFetch = async () => {
      if (device.selectedBasket > 0) {
        try {
          await deleteFromBasket(device.selectedBasket);
          device.setSelectedBasket(null);
        } catch (error) {
          console.error("Err while removing from basket:", error);
        }
      }
      await currentBasket();
    };
    deleteAndFetch();
  }, [device.selectedBasket, device.baskets]);

  //Считаем общую сумму, которую юзер набрал в корзину

  let prices = 0;
  device.baskets?.length &&
    typeof device.baskets[0] !== "string" &&
    device.baskets?.map(
      (product) => (prices += Number(product.device?.price * product?.quantity))
    );

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center mt-3">
      <h1 className="p-4">Basket</h1>

      {device.baskets?.length &&
        typeof device.baskets[0] !== "string" &&
        device.baskets?.map((product, i) => (
          <Card
            className="d-flex w-100 p-2 justify-content-center mb-2"
            key={product.id}
            style={{ borderBottom: "1px solid grey" }}
          >
            <Row className="d-flex ">
              <Col md={2}>
                <img src={product.device?.img} alt={"device"} height={60} />
              </Col>
              <Col md={5}>
                <div className="d-flex h-100 flex-row justify-content-start align-items-center">
                  <NavLink to={`/device/${product.device?.id}`}>
                    <div className="pl-3">{product.device?.name}</div>
                  </NavLink>
                </div>
              </Col>
              <Col md={5}>
                <div className="d-flex h-100 flex-row justify-content-evenly align-items-center">
                  <h2>
                    <Button
                      variant="outline-dark"
                      style={{ cursor: "none", marginRight: "0.1rem" }}
                      disabled
                    >
                      {product?.quantity}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => addDeviceQuantity(product.device?.id)}
                      style={{ cursor: "pointer", marginRight: "0.1rem" }}
                    >
                      +
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        device.setSelectedBasket(Number(product.id))
                      }
                      style={{ cursor: "pointer" }}
                    >
                      &mdash;
                    </Button>
                  </h2>
                  <h4 className="font-weight-light">
                    {(product?.quantity * product.device?.price)
                      .toLocaleString("en-GB")
                      .replace(/,/g, " ")}{" "}
                    &#x20B4;
                  </h4>
                </div>
              </Col>
            </Row>
          </Card>
        ))}

      <Card className="d-flex flex-row  p-2 justify-content-between align-items-center m-5 align-self-end">
        <h3 className="pr-2">Total:&nbsp; </h3>
        <h4 className="pl-2">
          {" "}
          &nbsp;{prices?.toLocaleString("en-GB").replace(/,/g, " ")}{" "}
          <span className="font-weight-normal pl-2"> &#x20B4; </span>
        </h4>
      </Card>
    </Container>
  );
});
export default Basket;
