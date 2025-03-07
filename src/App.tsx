import styled from "styled-components";
import MainPage from './pages/main/mainPage.js'

const App = () => {
  return (
    <Wrapper>
      <MainPage/>
      {/* <HandLandmarker/> */}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: gray;
`;

export default App;