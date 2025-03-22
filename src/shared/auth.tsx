import { Dispatch, SetStateAction, createContext } from "react";
import { backend } from "./ServerEndpoint";

interface AuthContextType {
  isLoggedIn: boolean;
  profile: any; // Replace 'any' with your actual profile type
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setProfile: Dispatch<SetStateAction<any>>;
}

// interface UserInfo {
//   username: string;
// }

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  profile: null, // Default profile state
  setIsLoggedIn: () => {}, // Placeholder function
  setProfile: () => {} // Placeholder function
});

export const GetUserInfo = async (token: string) => {
  try {
    const response = await fetch(`${backend}/api/v1/mypage/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    
    switch(response.status) {
      case 200: // OK
      const data = await response.json();
      console.log("Get userInfo successful: ", data);
      return data;
      
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
  return null;
}


//======================<Token>======================

export const SaveToken = (data: any) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
}

interface AuthData {
  accessToken: string | null;
  refreshToken: string | null;
}

export const LoadToken = () => {
  let data: AuthData = {
    accessToken: null,
    refreshToken: null
  };
  data.accessToken = localStorage.getItem("accessToken");
  data.refreshToken = localStorage.getItem("refreshToken");
  return data;
}

export const RemoveToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export const CheckTokenValid = async (token: string | null) => {
  try {
    //console.log("asking for ", token);
    const response = await fetch(`${backend}/api/v1/mypage/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach token
      },
    });

    switch (response.status) {
      case 200: // OK
        console.log("Token valid");
        return true;

      case 401: // Conflict
        console.log("Token not valid");
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

//======================<Token>======================