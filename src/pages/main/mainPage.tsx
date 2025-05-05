import styled from "styled-components";
import { useEffect, useState } from "react";
import YouTubeVideoDetails from "./utils/YoutubeVideoDetails";
import VideoCard from "./utils/VideoCard";
import { GoogleLogin } from "../../shared/auth";
//https://developers.google.com/identity/sign-in/web/sign-in?hl=ko
import { fetchRandomVideos } from "./apis/YoutubeVideoFetchAPI";

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

  const handlGoogleLogin = async () => {
    const url = window.location.href;
    const match = url.match(/\?.*/);
    let code = null;
    if (match) {
      const params = new URLSearchParams(match[0]);
      code = params.get("code");
    }
    GoogleLogin(code);
  };

  useEffect(() => {
    handleFetchRandomVideos();
    handlGoogleLogin();
  }, []);

  return (
    <>
      <PanelDiv>
        <SubDiv1>
          <p>원하시는 동영상이 있나요?</p>
          <div style={{display: "flex"}}>
            <input type="text" />
            <Button>검색</Button>
          </div>
        </SubDiv1>
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
        <VideoCardWrapper>
            {loading ? (
              <p>Loading...</p>
            ) : (
              randomVideos.map((video, index) => (
                <div key={index}>
                  <VideoCard videoUrl={video.youtubeLink} />
                </div>
              ))
            )}
          </VideoCardWrapper>
      </PanelDiv>
    </>
  );
};

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

const PanelDiv = styled.div`
  display: flex;
  flex-direction: column;
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
  color: black;
  background: white;
  border: 1px solid #333;
  border-radius: 10px;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
  padding: 20px;
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

const VideoCardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  max-height: 73.5vh;
  overflow-y: auto;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

export default MainPage;
