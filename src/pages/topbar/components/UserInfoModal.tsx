import styled, { keyframes } from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { backend } from "../../../shared/ServerEndpoint";
import { AuthContext, LoadToken, RemoveToken } from "../../../shared/auth";

const UserInfoModal = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const CloseAndClearModal = () => {
    setShowMessage(false);
    setModalOpen(false);
  };

  const [message, setMessage] = useState({ text: "", color: "red" });
  const [showMessage, setShowMessage] = useState(false);
  const { profile, setIsLoggedIn } = useContext(AuthContext);
  
  const withdrawUser = async () => {
    try {
      const response = await fetch(`${backend}/api/v1/mypage/withdrawal`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LoadToken().accessToken}`,
        },
      });

      switch (response.status) {
        case 200: // OK
          console.log("Withdrawed user successfully");
          setMessage({ text: "성공적으로 탈퇴하였습니다.", color: "green" });
          setShowMessage(true);
          setTimeout(() => {
            CloseAndClearModal();
            RemoveToken();
            setIsLoggedIn(false);
          }, 1500);
          return true;

        case 401: // Conflict
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
          <h1>회원정보</h1>
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "20px"}}>
          <p>이메일: test@test.com</p>
          <p>유저명: {userName}</p>
          </div>
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
            <WithDrawalButton
              onClick={() => {
                withdrawUser();
              }}
            >
              회원탈퇴
            </WithDrawalButton>
            <Button
              onClick={() => {
                CloseAndClearModal();
              }}
            >
              닫기
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

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

const WithDrawalButton = styled.button`
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
    background: red;
    color: white;
    transition: 0.3s;
  }
`;

export default UserInfoModal;
