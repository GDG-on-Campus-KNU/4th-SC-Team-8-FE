import styled from "styled-components";
import { PanelWrapper } from "../../globalStyle";
import { Button } from "@mui/material";
import ComputerIcon from '@mui/icons-material/Computer';
import Duck from "../../assets/duck.jpg";
import CryDog from "../../assets/sullimvs-jinrinotes.gif"

//https://developers.kakao.com/docs/latest/ko/message/js-link

const MobileAlert = () => {
  let YoUaRsPeCiAl: boolean = Math.random() < 0.99;
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
    <PanelWrapper style={{width: "80%"}}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "5px"}}><ComputerIcon/><h1>PC에서 접속해주세요</h1></div>
      <img src={ YoUaRsPeCiAl ? CryDog : Duck} style={{width: "100%", borderRadius: "10px"}} alt="duck image"/>
      <p>현재 서비스는 모바일 환경을 지원하지 않습니다.</p>
      <p><strong>PC 환경에서 브라우저</strong>를 통해 이용해 주세요.</p>
      <p>저희 서비스를 이용해 주셔서 감사합니다.</p>
      <Button variant="outlined" style={{color: "black", borderColor: "black"}} onClick={() => {navigator.clipboard.writeText(window.location.href)}}>링크 복사하기</Button>
    </PanelWrapper>
    </div>
  );
};

export default MobileAlert;
