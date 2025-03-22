import styled from "styled-components";
import MainPage from "./pages/main/MainPage";
import TopBar from "./pages/topbar/TopBar";
import {
  AuthContext,
  GetUserInfo as GetUserInfo,
  LoadToken,
  RemoveToken,
  CheckTokenValid,
} from "./shared/auth";
import { useEffect, useState } from "react";
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
    <AuthContext.Provider
      value={{ isLoggedIn, profile, setIsLoggedIn, setProfile }}
    >
      <Wrapper>
        <TopBar />
        <MainPage />
      </Wrapper>
    </AuthContext.Provider>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white-gray;
`;

export default App;
