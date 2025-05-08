import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { AuthContext, LoadToken, RemoveToken } from "../../shared/auth";
import { Link } from "react-router-dom";

const Footer = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <TopBarWrapper>
        <InlineDiv
          style={{
            fontFamily: "Sunflower, sans-serif",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          SC 8팀
        </InlineDiv>
        <div style={{display:"flex", gap: 20}}>
        <Link to="/">
          <p style={{ fontSize: 25, color: "white"}}>메인 패널</p>
        </Link>
        <Link to="/game/X7OtYqOl2L0">
          <p style={{ fontSize: 25, color: "white"}}>트래킹 패널</p>
        </Link>
        <Link to="error">
          <p style={{ fontSize: 25, color: "white" }}>오류 패널</p>
        </Link>
        </div>
      </TopBarWrapper>
    </>
  );
};

//======================================================================

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  transition: 0.3s;

  &:hover {
    background: black;
    color: white;
    transition: 0.3s;
  }
`;

const InlineDiv = styled.div`
  display: inline-block;
  font-size: 30px;
`;

const TopBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #333;
  color: white;
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white-gray;
`;

export default Footer;
