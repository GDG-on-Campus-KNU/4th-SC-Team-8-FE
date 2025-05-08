import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import YouTubeVideoDetails from "./utils/YoutubeVideoDetails";
import VideoCard from "./utils/VideoCard";
//https://developers.google.com/identity/sign-in/web/sign-in?hl=ko
import { fetchRandomVideos } from "./apis/YoutubeVideoFetchAPI";
import { AuthContext, GetUserInfo, SaveToken } from "../../shared/auth";
import { backend } from "../../shared/ServerEndpoint";
import VideoSearch from "./components/VideoSearch";
import VideoCardPlaceHolder from "./components/VideoCardPlaceHolder";

const MainPage = () => {
  const [randomVideos, setRandomVideos] = useState<{ youtubeLink: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const fetchFromAPI = async () => {
    await fetchRandomVideos((data) => {
      setRandomVideos(data);
      localStorage.setItem("randomVideos", JSON.stringify(data)); //  Store the fetched data
      localStorage.setItem("lastFetchTime", Date.now().toString()); // Store the current timestamp
    });
  };

  const fetchFromCache = (cachedVideos: string | null) => {
    const parsedVideos: { youtubeLink: string }[] = cachedVideos
      ? JSON.parse(cachedVideos)
      : [];
    if (parsedVideos.length === 0) fetchFromAPI(); // Refresh the cache if it's empty
    setRandomVideos(parsedVideos);
  };

  const handleFetchRandomVideos = async () => {
    setLoading(true);
    setRandomVideos([]);

    const cachedVideos = localStorage.getItem("randomVideos");
    const lastFetchTime = localStorage.getItem("lastFetchTime");
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

    if (
      cachedVideos &&
      lastFetchTime &&
      Date.now() - parseInt(lastFetchTime) < oneDay
    ) {
      console.log("Using cached videos");
      console.log(
        "Random Video Cache re-validation: ",
        (
          (oneDay - (Date.now() - parseInt(lastFetchTime))) /
          60000 /
          60
        ).toFixed(4),
        "hours"
      );
      fetchFromCache(cachedVideos);
      setLoading(false);
    } else {
      console.log("Fetching new videos");
      fetchFromAPI();
      setLoading(false);
    }
  };

  const { setProfile } = useContext(AuthContext);

  const GoogleLogin = async (code: string | null) => {
    try {
      const response = await fetch(`${backend}/api/v1/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });

      switch (response.status) {
        case 200: // OK
          // Try to parse the response as JSON
          const data = await response.json();
          console.log("Login successful: ", data);
          SaveToken(data);
          const userInfo = await GetUserInfo(data.accessToken);
          setProfile(
            userInfo !== null ? userInfo : { username: "NULL", email: "NULL" }
          );
          break;

        case 409: // Conflict
        case 401: // Unauthrized
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
  };


  const handlGoogleLogin = async () => {
    const url = window.location.href;
    const match = url.match(/\?.*/);
    let code = null;
    if (match) {
      const params = new URLSearchParams(match[0]);
      code = params.get("code");
    }
    if (code) GoogleLogin(code);
  };

  useEffect(() => {
    handleFetchRandomVideos();
    handlGoogleLogin();
  }, []);

  return (
    <>
      <PanelDiv>
        <VideoSearch />
        {/* <SubDiv2>
          <p>바로 플레이 하세요!</p>
          <button
            onClick={() => {
              handleFetchRandomVideos();
            }}
          >
            랜덤 리스트 불러오기
          </button>
          <VideoListWrapper>
            {loading ? (
              <p>Loading...</p>
            ) : (
              randomVideos.map((video, index) => (
                <div key={index}>
                  <YouTubeVideoDetails videoUrl={video.youtubeLink} />
                </div>
              ))
            )}
          </VideoListWrapper>
        </SubDiv2> */}
        <VideoCardPlaceHolder loading={loading} randomVideos={randomVideos} />
      </PanelDiv>
    </>
  );
};

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;

const SubDiv2 = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 25px;
  color: #fff;
  background: #333;
`;

export default MainPage;
