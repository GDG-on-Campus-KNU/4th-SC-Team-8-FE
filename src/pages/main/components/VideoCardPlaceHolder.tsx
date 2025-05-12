import styled from "styled-components";
import VideoCard from "../utils/VideoCard";

const VideoCardPlaceHolder = (props: any) => {
  return (
    <VideoCardWrapper>
      {props.loading ? (
        <p>Loading...</p>
      ) : (
        props.randomVideos.map((video: any, index: number) => (
          <div key={index}>
            <VideoCard videoUrl={video.youtubeLink} />
          </div>
        ))
      )}
    </VideoCardWrapper>
  );
};

const VideoCardWrapper = styled.div`
  padding: 20px 0 20px 0;
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

export default VideoCardPlaceHolder;
