import styled from "styled-components";
import { PanelWrapper } from "../../globalStyle";
import { Button } from "@mui/material";
import Duck from "../../assets/duck.jpg";
import CryDog from "../../assets/sullimvs-jinrinotes.gif"

const ErrorPage = () => {
  let YoUaRsPeCiAl: boolean = Math.random() < 0.99;
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    <PanelWrapper>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "5px"}}><h1>페이지를 찾을 수 없습니다</h1></div>
      <img src={ YoUaRsPeCiAl ? CryDog : Duck} style={{borderRadius: "10px"}} alt="duck image"/>
      <p>보시려는 페이지에 접근할 수 없거나 페이지가 존재하지 않습니다.</p>
    </PanelWrapper>
    </div>
  );
};

export default ErrorPage;
