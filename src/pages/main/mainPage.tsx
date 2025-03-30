import styled from "styled-components";
import { backend } from "../../shared/ServerEndpoint";
import { useEffect, useState } from "react";
import YouTubeVideoDetails from "./utils/YoutubeVideoDetails";
//https://developers.google.com/identity/sign-in/web/sign-in?hl=ko

const fetchRandomVideos = async (setRandomVideos: (data: { youtubeLink: string }[]) => void) => {
  try {
    const response = await fetch(`${backend}/api/v1/game/random`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    switch (response.status) {
      case 200: // OK
        const data = await response.json();
        console.log("Got data", data);
        setRandomVideos(data);
        break;

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

const MainPage = () => {
  const [randomVideos, setRandomVideos] = useState<{ youtubeLink: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFromAPI = async () => {
    await fetchRandomVideos((data) => {
      setRandomVideos(data);
      localStorage.setItem("randomVideos", JSON.stringify(data)); //  Store the fetched data
      localStorage.setItem("lastFetchTime", Date.now().toString()); // Store the current timestamp
    });
  }

  const fetchFromCache = (cachedVideos: string | null) => {
    const parsedVideos: { youtubeLink: string }[] = cachedVideos ? JSON.parse(cachedVideos) : [];
    if(parsedVideos.length === 0) fetchFromAPI(); // Refresh the cache if it's empty
    setRandomVideos(parsedVideos);
  }

  const handleFetchRandomVideos = async () => {
    setLoading(true);
    setRandomVideos([]);
  
    const cachedVideos = localStorage.getItem("randomVideos");
    const lastFetchTime = localStorage.getItem("lastFetchTime");
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  
    if (cachedVideos && lastFetchTime && Date.now() - parseInt(lastFetchTime) < oneDay) {
      console.log("Using cached videos");
      console.log("Random Video Cache re-validation: ", ((oneDay - (Date.now() - parseInt(lastFetchTime))) / 60000 / 60).toFixed(4), "hours");
      fetchFromCache(cachedVideos);
      setLoading(false);
    } else {
      console.log("Fetching new videos");
      fetchFromAPI();
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchRandomVideos();
  }, []);

  return (
    <>
      <PanelDiv>
        <SubDiv1>
          <p>원하시는 동영상이 있나요?</p>
          <div>
            <input type="text" />
            <button>유튜브 검색</button>
          </div>
        </SubDiv1>
        <SubDiv2>
          <p>바로 플레이 하세요!</p>
          <button
            onClick={() => {
              handleFetchRandomVideos();
            }}
          >랜덤 리스트 불러오기</button>
          <VideoListWrapper>
          {loading ? <p>Loading...</p>: randomVideos.map((video, index) => (
            <div key={index}>
              <YouTubeVideoDetails videoUrl={video.youtubeLink}/>
            </div>
          ))}
          </VideoListWrapper>
        </SubDiv2>
      </PanelDiv>
    </>
  );
};

const PanelDiv = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
`;

const SubDiv1 = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 25px;
  color: #fff;
  background: #333;
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

const VideoListWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, and Opera */
  }
`;

export default MainPage;
