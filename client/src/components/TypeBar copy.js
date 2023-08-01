import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { Button } from "react-bootstrap";

const TypeBar = observer((props) => {
  console.log("props: ", props);
  const { device } = useContext(Context);

  //   const [chosen, setChosen] = useState(false);
  // прибрати ей стейт юзати замість нього device selectedType == type
  return (
<>
   
      {device.types.map((type, i) => (
        <div className="d-flex justify-content-between" key={type.id}>
       <Dropdown
            as={ButtonGroup}
            // key={type.id}
          >
            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />
            <Dropdown.Menu>
              {props?.brandCountPerType[type.id]?.map((brandId, i) => (
                <Dropdown.Item key={brandId}>
                  {
                    device.brands.filter((brand) => brand.id === brandId)[0]
                      ?.name
                  }
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            </Dropdown>
            {/* <ListGroup.Item */}
            <Button
              style={{ cursor: "pointer" }}
              active={type.id === device.selectedType.id}
              action
              variant="light"
              key={type.id}
            >
              {type.id === device.selectedType.id ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    device.setSelectedType("");
                    device.setSelectedBrand("");
                  }}
                >
                  {" "}
                  <span>{type.name}</span>
                  {props?.productCountPerType && (
                    <Badge bg="secondary" pill>
                      {props.productCountPerType[type.id] || ""}
                    </Badge>
                  )}
                  <span>&gt;</span>
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    device.setSelectedType(type);
                    device.setSelectedBrand("");
                  }}
                >
                  {" "}
                  <span>{type.name}</span>
                  {props?.productCountPerType && (
                    <Badge bg="secondary" pill>
                      {props.productCountPerType[type.id] || ""}
                    </Badge>
                  )}
                  <span>&gt;</span>
                </div>
              )}
              </Button>
            {/* </ListGroup.Item> */}
       
         </div>
      ))}
    {/* // </ListGroup> */}
    </>
  );
});

export default TypeBar;
