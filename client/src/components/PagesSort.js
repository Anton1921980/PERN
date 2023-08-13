import { useContext } from "react";
import { Card } from "react-bootstrap";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const PagesSort = observer(() => {
  const { device } = useContext(Context);

  return (
    <>
      <div className="d-flex align-items-center ml-5">
        <Card
          className="p-1 flex-row"
          style={{ cursor: "pointer", height: "2.5rem" }}
          border={"DESC" === device.sort ? "dark" : "light"}
          key={"DESC"}
        >
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              if (device.sort !== "DESC") {                
                device.setPage("1");
                device.setSort("DESC");
              }
            }}
          >      
           {'+ '}
         <span>&#x20B4;</span>
          </div>
        </Card>
        <Card
          className="p-1 flex-row"
          style={{ cursor: "pointer", height: "2.5rem" }}
          border={"ASC" === device.sort ? "dark" : "light"}
          key={"ASC"}
        >
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              if (device.sort !== "ASC") {                
                device.setPage("1");
                device.setSort("ASC");
              }
            }}
          >
         {'- '}
         <span>&#x20B4;</span>
          </div>
        </Card>
      </div>
      <div className="d-flex m-3 align-items-center ">
        <Card
          className="p-1 flex-row"
          style={{ cursor: "pointer", height: "2.5rem" }}
          border={3 === device.limit ? "dark" : "light"}
          key={3}
        >
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              if (3 !== device.limit) {
                device.setPage(1);
                device.setLimit(3);
              }
            }}
          >
            <span>3</span>
          </div>
        </Card>
        <Card
          className="p-1 flex-row"
          style={{ cursor: "pointer", height: "2.5rem" }}
          border={6 === device.limit ? "dark" : "light"}
          key={6}
        >
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              if (6 !== device.limit) {
                device.setPage(1);
                device.setLimit(6);
              }
            }}
          >
            <span>6</span>
          </div>
        </Card>
        <Card
          className="p-1 flex-row"
          style={{ cursor: "pointer", height: "2.5rem" }}
          border={9 === device.limit ? "dark" : "light"}
          key={9}
        >
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={() => {
              if (9 !== device.limit) {
                device.setPage(1);
                device.setLimit(9);
              }
            }}
          >
            <span>9</span>
          </div>
        </Card>
      </div>
    </>
  );
});

export default PagesSort;
