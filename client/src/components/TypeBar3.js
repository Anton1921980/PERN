import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import Button from 'react-bootstrap/Button';

const TypeBar = observer((props) => {
  console.log("props: ", props);
  const { device } = useContext(Context);

  //   const [chosen, setChosen] = useState(false);
  // прибрати ей стейт юзати замість нього device selectedType == type
  return (
    <ListGroup variant="flush">
    
      {device.types.map((type, i) => (
        <Dropdown as={ButtonGroup} key={type.id}>
       
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
            {type.id === device.selectedType.id ? (
              <Button
                className="d-flex justify-content-between"
                style={{width:"80%"}}
                onClick={() => {
                  device.setSelectedType("");
                  device.setSelectedBrands("");
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
              </Button>
            ) : (
              <Button
                className="d-flex justify-content-between"
                onClick={() => {
                  device.setSelectedType(type);
                  device.setSelectedBrands("");
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
              </Button>
            )}
        
        </Dropdown>
      ))}
    </ListGroup>
  );
});

export default TypeBar;
