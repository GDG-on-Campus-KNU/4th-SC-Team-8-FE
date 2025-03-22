import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useContext, useEffect, useState } from "react";
import RegisterModal from "./components/RegisterModal";
import LoginModal from "./components/LoginModal";
import { AuthContext, LoadToken, RemoveToken } from "../../shared/auth";
import UserInfoModal from "./components/UserInfoModal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { backend } from "../../shared/ServerEndpoint";

const TopBar = () => {
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
          SC 8팀 수화 동화책 Experimental WEB
        </InlineDiv>
        {isLoggedIn ? <WelcomePanel /> : <LogInPanel />}
      </TopBarWrapper>
    </>
  );
};

const fetchLogout = async () => {
  try {
    const response = await fetch(`${backend}/api/v1/mypage/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LoadToken().accessToken}`, // Attach token
      },
    });

    switch (response.status) {
      case 200: // OK
      console.log("Logged out successfully");
        return true;

      case 401: // Conflict
        // Handle plain text response for conflict (e.g., email already exists)
        const conflictMessage = await response.json();
        console.log("Conflict: ", conflictMessage);
        break;

      default:
        console.log("Unexpected status code:", response.status);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return false;
};

const WelcomePanel = () => {
  const [enableUserInfoForm, setEnableUserInfoForm] = useState(false);
  const { profile, setIsLoggedIn } = useContext(AuthContext);

  const [userName, setUserName] = useState("null");

  useEffect(() => {
    const fetchProfile = async () => {
      const completeProfile = await profile;
      if (completeProfile != null) setUserName(completeProfile.username);
    };

    fetchProfile();
  }, [profile]);

  return (
    <>
      <UserInfoModal
        modalOpen={enableUserInfoForm}
        setModalOpen={setEnableUserInfoForm}
      />
      <div
        style={{
          display: "flex",
          gap: "10px",
          paddingRight: "5px",
          alignItems: "center",
        }}
      >
        <span>
          환영합니다, <strong>{userName}</strong>님
        </span>
        <Button
          onClick={() => {
            setEnableUserInfoForm(!enableUserInfoForm);
          }}
        >
          <AccountCircleIcon />
          회원 정보
        </Button>
        <Button
          onClick={() => {
            fetchLogout();
            RemoveToken();
            setIsLoggedIn(false);
          }}
        >
          <LogoutIcon />
          로그아웃
        </Button>
      </div>
    </>
  );
};

const LogInPanel = () => {
  const [enableLoginForm, setEnableLoginForm] = useState(false);
  const [enableRegisterForm, setEnableRegisterForm] = useState(false);

  return (
    <>
      <LoginModal
        modalOpen={enableLoginForm}
        setModalOpen={setEnableLoginForm}
      />
      <RegisterModal
        modalOpen={enableRegisterForm}
        setModalOpen={setEnableRegisterForm}
      />
      <div style={{ display: "flex", gap: "10px", paddingRight: "5px" }}>
        <Button
          onClick={() => {
            setEnableLoginForm(!enableLoginForm);
          }}
        >
          <LoginIcon />
          로그인
        </Button>
        <Button
          onClick={() => {
            setEnableRegisterForm(!enableRegisterForm);
          }}
        >
          <HowToRegIcon />
          회원가입
        </Button>
      </div>
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
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white-gray;
`;

export default TopBar;
