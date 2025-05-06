import styled, { keyframes } from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { backend } from "../../../shared/ServerEndpoint";
import { AuthContext, GetUserInfo, SaveToken } from "../../../shared/auth";
import { useGoogleLogin } from "@react-oauth/google";

const RegisterModal = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");

  const [message, setMessage] = useState({ text: "", color: "red" });
  const [showMessage, setShowMessage] = useState(false);

  const { setIsLoggedIn, setProfile } = useContext(AuthContext);

  const CloseAndClearModal = () => {
    setShowMessage(false);
    setModalOpen(false);
    setEmail("");
    setPswd("");
  };

  const loginUser = async () => {
    const userData = {
      email: email,
      password: pswd,
    };

    try {
      const response = await fetch(`${backend}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      switch (response.status) {
        case 200: // OK
          // Try to parse the response as JSON
          const data = await response.json();
          console.log("Login successful: ", data);
          setMessage({ text: "로그인 되었습니다.", color: "green" });
          setShowMessage(true);
          SaveToken(data);
          setIsLoggedIn(true);
          const userInfo = await GetUserInfo(data.accessToken);
          setProfile(
            userInfo !== null ? userInfo : { username: "NULL", email: "NULL" }
          );
          setTimeout(() => {
            CloseAndClearModal();
          }, 1500);
          break;

        case 409: // Conflict
        case 401: // Unauthrized
          // Handle plain text response for conflict (e.g., email already exists)
          const conflictMessage = await response.json();
          console.log("Conflict: ", conflictMessage);
          setMessage({
            text: /*conflictMessage.detail*/ "이메일 또는 비밀번호가 맞지 않습니다.",
            color: "red",
          });
          setShowMessage(true);
          break;

        default:
          console.log("Unexpected status code:", response.status);
          break;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form>
          <h1>로그인</h1>
          <InputField
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <InputField
            type="password"
            placeholder="비밀번호"
            value={pswd}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPswd(e.target.value)
            }
          />
          {showMessage && (
            <p style={{ color: message.color, fontWeight: "bold" }}>
              {message.text}
            </p>
          )}
            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "stretch",
                alignSelf: "stretch",
                height: "3em",
              }}
            >
              <Button
                onClick={() => {
                  loginUser();
                }}
                style={{ flex: "2" }}
              >
                로그인
              </Button>
              <Button
                onClick={() => {
                  setModalOpen(false);
                  setShowMessage(false);
                }}
              >
                취소
              </Button>
            </div>
        </Form>
      </Modal>
    </>
  );
};

const GoogleDesignButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #357ae8;
  }
`;

//======================================================================

const boxFade = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Form = styled.div`
  padding: 30px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;

  border-radius: 10px;
  background-color: white;

  animation: ${boxFade} 1s;
`;

const InputField = styled.input`
  width: 250px;
  height: 2em;
  border-radius: 10px;
  border: 0;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

//======================================================================

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex: 1;

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

export default RegisterModal;
