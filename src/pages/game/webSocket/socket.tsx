import React, { useState, useEffect, useRef } from "react";
import { useLandmarkContext } from "../gamePage";


function Socket() {
  // const websocket = useRef<WebSocket | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const { landmarks } = useLandmarkContext();

  // useEffect(() => {
  //   websocket.current = new WebSocket("ws://localhost:8765");

  //   websocket.current.onopen = () => {
  //     console.log("WebSocket connection established");
  //   };

  //   websocket.current.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   websocket.current.onmessage = (event) => {
  //     console.log("WebSocket: ", event.data);
  //   };

  //   websocket.current.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   // Clean up function to close the WebSocket connection when the component unmounts
  //   return () => {
  //     if (
  //       websocket.current &&
  //       websocket.current.readyState === WebSocket.OPEN
  //     ) {
  //       websocket.current.close();
  //     }
  //   };
  // }, []); // Empty dependency array ensures this effect runs only once after the initial render

  // const handleSendMessage = () => {
  //   if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
  //     websocket.current.send(landmarks);
  //   }
  // };

  const [rep, setRep] = useState("ws://localhost:8765");
  const [score, setScore] = useState("");

  useEffect(() => {
    if (websocket != null) {
      websocket.onmessage = (e) => {
        setScore(e.data);
        console.log(e.data);
      };
    }
  }, [websocket])

  return (
    <>
      <h1>웹소켓 테스트 패널</h1>
      <div style={{ display: "flex", flexDirection: "column", width: "400px", padding: "10px", border: "1px solid black" }}>
        <h2>테스트 이전 체크리스트</h2>
        <ul>
          <li>--- 웹 소켓이 열려있는지 확인해주세요.</li>
          <li>--- 소켓 연결 전에 웹캠을 활성화 해주세요.</li>
          <li>--- 공유기에 연결되어 있다면 인/아웃 바운드 포트 규칙을 설정해 주세요</li>
        </ul>
        <h2>Status 코드</h2>
        <p>--- 0: 연결하는중</p>
        <p>--- 1: 연결됨</p>
        <p>--- 2: 연결끊는중</p>
        <p>--- 3: 연결끊김</p>
        <input type="text" placeholder="ws://xxx.xxx.xxx.xxx:x" value={rep} onChange={(e) => setRep(e.target.value)} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={() => {
            setWebsocket(new WebSocket(rep));
          }}>Connect</button>
          <button onClick={() => {
            console.log(landmarks);
            let data = { multiHandLandmarks: landmarks.multiHandLandmarks, multiHandWorldLandmarks: landmarks.multiHandWorldLandmarks, multiHandedness: landmarks.multiHandedness };
            websocket?.send(JSON.stringify(data));
          }}>Send Landmarks</button>

          <span>Status: {websocket?.readyState}</span>
          <span>score: {score}</span>
        </div>
      </div>
      <code>
        
      </code>
    </>
  );
}

export default Socket;


//WebSocket python code
/*
import asyncio
import websockets
import json

clients = set()

async def send(socket, data):
    await socket.send(data)

async def recieve(socket):
    clients.add(socket)
    async for message in socket:
        landmarks = json.loads(message)
        print(landmarks["multiHandLandmarks"])
        print(landmarks["multiHandWorldLandmarks"])
        print(landmarks["multiHandedness"])

async def handle_input():
    while True:
        score = await asyncio.to_thread(input, "Enter score: ")
        if clients:
            await asyncio.gather(*[send(socket, score) for socket in clients])
        else:
            print("No clients connected.")

async def main():
    async with websockets.serve(recieve, "localhost", 8765) as server:
        print("WebSocket server started at ws://localhost:8765")
        await handle_input()

if __name__ == "__main__":
    asyncio.run(main())
*/