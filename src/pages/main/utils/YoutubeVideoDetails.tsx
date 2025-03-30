import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const YouTubeVideoDetails = ({ videoUrl }: { videoUrl: string }) => {
  const [videoData, setVideoData] = useState<{ title: string, thumbnails: { high: { url: string } }, description: string } | null>(null);
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
      <button style={{width: 20}} onClick={() => navigate(`/game/${getVideoId(videoUrl)}`)}>연습하기</button>
      <Thumbnail src={videoData.thumbnails.high.url} alt="YouTube Thumbnail"/>
      <CaptionWrapper>
      <h5>{videoData.title}</h5>
      <p>{videoData.description}</p>
      </CaptionWrapper>
    </YTBoxWrapper>
  ) : (
    <p>Loading...</p>
  );
};

const Thumbnail = styled.img`
width: 50px;
height: 50px;
  object-fit: cover;
  border-radius: 50px;
`;

const CaptionWrapper = styled.div`
display: flex;
flex-direction: column;
  h5 {
  font-size: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Number of lines to show */
    -webkit-box-orient: vertical
  }
  p {
  font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

const YTBoxWrapper = styled.div`
border: 1px solid white;
display: flex;
align-items: center;
margin: 10px;
gap: 10px;
`;

export default YouTubeVideoDetails;
