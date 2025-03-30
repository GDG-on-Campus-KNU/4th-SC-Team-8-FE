import styled from "styled-components";
import GamePage from "./pages/game/gamePage";
import TopBar from "./pages/topbar/TopBar";
import {
  AuthContext,
  GetUserInfo as GetUserInfo,
  LoadToken,
  RemoveToken,
  CheckTokenValid,
} from "./shared/auth";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import MobileAlert from "./pages/mobile/mobileAlert";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/error/errorPage";
import MainPage from "./pages/main/mainPage";
import Footer from "./pages/footer/Footer";
//https://cocoder16.tistory.com/81
//https://velog.io/@hidaehyunlee/React-Component%EB%A1%9C-%EC%9B%B9%ED%8E%98%EC%9D%B4%EC%A7%80-%EB%94%94%EC%9E%90%EC%9D%B8%ED%95%98%EA%B8%B0

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = LoadToken().accessToken;

      if (!token) {
        setIsLoggedIn(false);
        console.log("Token not found");
        return;
      }

      const tokenValid = await CheckTokenValid(token);
      if (tokenValid) {
        setIsLoggedIn(true);
        const userInfo = await GetUserInfo(token);
        setProfile(userInfo !== null ? userInfo : { username: "NULL" });
      } else {
        RemoveToken();
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <>
      <BrowserView>
        <AuthContext.Provider
          value={{ isLoggedIn, profile, setIsLoggedIn, setProfile }}
        >
          <Wrapper>
            <BrowserRouter>
              <TopBar />
              <Content>
                <Routes>
                  <Route path="/" element={<MainPage />}></Route>
                  <Route path="/game/:gameUrl" element={<GamePage />}></Route>
                  <Route path="*" element={<ErrorPage />}></Route>
                </Routes>
              </Content>
              <Footer></Footer>
            </BrowserRouter>
          </Wrapper>
        </AuthContext.Provider>
      </BrowserView>

      <MobileView>
        <MobileAlert />
      </MobileView>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white-gray;
`;

const Content = styled.div`
  flex: 1;
`;

export default App;
