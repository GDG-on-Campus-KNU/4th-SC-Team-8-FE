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
import logo from "../../assets/logo.webp";
import googleLogo from "../../assets/googleLogo.png";

const TopBar = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <TopBarWrapper>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <InlineDiv
            style={{
              fontFamily: "Sunflower, sans-serif",
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            Signory
          </InlineDiv>
          <img src={logo} style={{ height: "50px" }} />
        </div>

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
      <GoogleSignInButton />
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

const GoogleSignInButton: React.FC = () => {
  const redirectLogin = async () => {
    let redirect_uri = "http://localhost:5173";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=899302067028-u8tte8dk694o56a3tt2kuie99ub3vomn.apps.googleusercontent.com&redirect_uri=${redirect_uri}/login/oauth2/code/google&response_type=code&scope=email%20profile`;
    // try {
    //   const response = await fetch(`${backend}/api/v1/auth/google-code`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     }
    //   });
    //   const data = await response.json();
    //   console.log("Google sign-in successful: ", data);
    // } catch (error) {
    //   console.error("Google sign-in failed:", error);
    //   setMessage({
    //     text: "구글 로그인에 실패했습니다.",
    //     color: "red",
    //   });
    //   setShowMessage(true);
    // }
  };

  return (
    <GoogleDesignButton onClick={() => redirectLogin()}>
      <img src={googleLogo} style={{height: "20px", background: "white", borderRadius: "20px"}}/>
      구글 계정으로 로그인
    </GoogleDesignButton>
  );
};

//======================================================================

const GoogleDesignButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #357ae8;
  }
`;

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
