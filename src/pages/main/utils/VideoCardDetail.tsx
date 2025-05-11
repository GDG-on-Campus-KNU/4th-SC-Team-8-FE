import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const VideoCardDetail = ({ videoUrl }: { videoUrl: string }) => {
  const [videoData, setVideoData] = useState<{
    title: string;
    thumbnails: { high: { url: string } };
    description: string;
  } | null>(null);
  const API_KEY = import.meta.env.VITE_YOUTUBE_DATA_API_V3_KEY; // Replace with your actual API key

  const navigate = useNavigate();

  const getVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };
  useEffect(() => {
    const fetchVideoData = async () => {
      const videoId = getVideoId(videoUrl);
      if (!videoId) return;

      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.items.length > 0) {
          setVideoData(data.items[0].snippet);
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoData();
  }, [videoUrl]);

  return videoData ? (
    <YTBoxWrapper>
      <Thumbnail src={videoData.thumbnails.high.url} alt="YouTube Thumbnail" />
      <CaptionWrapper>
        <h5>{videoData.title}</h5>
        <p>{videoData.description}</p>
      </CaptionWrapper>
      <Button onClick={() => navigate(`/game/${getVideoId(videoUrl)}`)}>
        연습하기
      </Button>
    </YTBoxWrapper>
  ) : (
    <p>Loading...</p>
  );
};

const Button = styled.button`
  margin: auto 0 0 0;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  // border: 1px solid black;
  border: none;
  padding: 5px;
  transition: 0.3s;

  &:hover {
    background: black;
    color: white;
    transition: 0.3s;
  }
`;

const YTBoxWrapper = styled.div`
  width: 500px;
  border: 0px solid black;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
`;

const Thumbnail = styled.img`
  width: 100%;
`;

const CaptionWrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  h5 {
    font-size: 20px;
    overflow: hidden;
  }
  p {
    font-size: 15px;
    overflow: hidden;
  }
  gap: 10px;
`;

export default VideoCardDetail;
