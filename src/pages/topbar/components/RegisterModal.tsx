import styled, { keyframes } from "styled-components";
import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { backend } from "../../../shared/ServerEndpoint";

const RegisterModal = ({ modalOpen, setModalOpen }: { modalOpen: boolean, setModalOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [pswd, setPswd] = useState("");
  const [pswdchk, setPswdChk] = useState("");
  
  useEffect(() => {
    setMessage({text: "비밀번호가 다릅니다", color: "red"});
    setShowMessage(pswd !== pswdchk && pswdchk.length > 0);
  }, [pswd, pswdchk]);

  const CloseAndClearModal = () => {
    setShowMessage(false);
    setModalOpen(false);
    setEmail("");
    setUser("");
    setPswd("");
    setPswdChk("");
  };

  const [message, setMessage] = useState({text: "", color: "red"});
  const [showMessage, setShowMessage] = useState(false);
  
  const registerUser = async () => {
    if(pswd !== pswdchk) return;
    const userData = {
      email: email,
      username: user,
      password: pswd
    };
    
    try {
      const response = await fetch(`${backend}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
      
      switch(response.status) {
        case 200: // OK
        // Try to parse the response as JSON
        const data = await response.text();
        console.log("Registration successful: ", data);
        setMessage({text: data, color: "green"});
        setShowMessage(true);
        setTimeout(() => {CloseAndClearModal();}, 1500);
        break;
        
        case 409: // Conflict
        // Handle plain text response for conflict (e.g., email already exists)
        const conflictMessage = await response.json();
        console.log("Conflict: ", conflictMessage);
        setMessage({text: conflictMessage.detail, color: "red"});
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
  
  return(
    <>
    <Modal open={modalOpen} onClose={() => {setModalOpen(false)}} style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
    <Form>
    <h1>회원가입</h1>
    <InputField type="text" placeholder="이메일" value={email} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
    <InputField type="text" placeholder="유저명" value={user} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}/>
    <InputField type="password" placeholder="비밀번호" value={pswd} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPswd(e.target.value)}/>
    <InputField type="password" placeholder="비밀번호 확인" value={pswdchk} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPswdChk(e.target.value)}/>
    {showMessage && <p style={{color: message.color, fontWeight: "bold"}}>{message.text}</p>}
    <div style={{display: "flex", gap: "5px", alignItems: "stretch", alignSelf:"stretch", height: "3em"}}>
    <Button onClick={() => {registerUser();}} style={{flex: "2"}}>회원가입</Button>
    <Button onClick={() => {CloseAndClearModal();}}>취소</Button>
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
box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
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