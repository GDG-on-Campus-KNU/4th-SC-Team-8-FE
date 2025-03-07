import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import styled from 'styled-components'
import './App.css'

import MainPage from './pages/main/mainPage.jsx'

const App = () => {
  return (
    <Wrapper>
      <MainPage/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: gray;
`;

export default App
