import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import geminiLogo from "../../../assets/geminiLogo.png";
import { fetchGeminiResponse } from "../apis/gaminiAPI";
import { BeatLoader } from "react-spinners";

export const GeminiCoverPanel = () => {
  return (
    <ShowUpWrapper>
      <img src={geminiLogo} height={75}></img>
      <p>AI 도우미</p>
    </ShowUpWrapper>
  );
};

const GeminiPromptPanel = ({
  setOpenGemini,
  scoreHistory,
  captionHistory,
}: any) => {
  const [text, setText] = useState("");
  const [answerWait, setAnserWait] = useState(false);
  const [conversation, setConversation] = useState<
    { id: number; msg: string; own: string }[]
  >([]);

  const appendConversation = (msg: string, from: string) => {
    setConversation((conv: any) => [
      ...conv,
      {
        id: new Date().getTime(),
        msg,
        from,
      },
    ]);
  };

  const getGeminiAnswer = async () => {
    setAnserWait(true);
    let tokens = text;
    setText("");
    let answer = await fetchGeminiResponse(tokens);
    appendConversation(answer, "gemini");
    setAnserWait(false);
  };

  useEffect(() => {
    const analyzeGraph = async () => {
      setAnserWait(true);
      let sh = JSON.stringify(scoreHistory);
      let ch = JSON.stringify(captionHistory);
      let tokens = `
      아래는 사용자가 수화 영상을 보고 따라한 결과입니다.

- 유사도 점수 배열: ${sh}

- 각 점수에 대응되는 문장 배열: ${ch}

위 데이터를 바탕으로 다음을 수행해 주세요:

1. 가장 낮은 점수에 대해 그 점수에 해당하는 수화 문장을 어떤 방식으로 수행해야 하는지 상세하게 설명해 주세요.

2. 전체 점수에 대해 한 문장으로 간략한 분석을 제공하고 어떻게 개선할 수 있는지 알려 주세요.

참고: 문장 배열이 비어 있는 경우에는 이전 정보는 무시하고 "아직 학습이 이루어지지 않아 분석할 수 없으며, 학습이 수행되면 분석이 가능하다"는 안내만 해 주세요. 그리고 마크업 문법은 사용하지 말아주세요. 소숫점 2자리가 넘어가는 수는 사용하지 말아주세요.

예시 프롬프트는 다음과 같습니다.

1. 가장 낮은 점수 (0.00)에 해당하는 수화 문장은 "꼭 안아주세요 포근한 마음으로"입니다. 해당 수화는 다음과 같이 수행해야 합니다:

- "꼭": 두 손을 모아 가슴 앞으로 당기는 동작을 합니다.
- "안아주세요": 양팔을 벌려 상대를 감싸는 듯한 동작을 합니다.
- "포근한": 양손을 둥글게 모아 가슴 앞에서 부드럽게 흔드는 동작을 합니다.
- "마음으로": 손바닥을 가슴에 대고 원을 그리듯이 움직입니다.

실제로 사용할 때에는 각 단어에 맞는 정확한 수어 동작과 함께, 따뜻하고 포근한 감정을 담아 표현하는 것이 중요합니다.

      `;
      console.log(tokens);
      let answer = await fetchGeminiResponse(tokens);
      appendConversation(answer, "gemini");
      setAnserWait(false);
    };
    analyzeGraph();
  }, []);

  return (
    <ShowUpWrapper>
      <PromptPannelWrapper>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => setConversation([])}>채팅 기록 지우기</Button>
          <Button onClick={() => setOpenGemini(false)}>창 닫기</Button>
        </div>
        <TextArea conversation={conversation} />
        <div style={{ display: "flex", gap: "5px" }}>
          <Input
            type="text"
            placeholder="Gemini에게 수화 동작 물어보기"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key == "Enter") {
                appendConversation(text, "user");
                getGeminiAnswer();
              }
            }}
          />
          <Button
            onClick={() => {
              getGeminiAnswer();
            }}
          >
            {answerWait ? <BeatLoader /> : <>◀</>}
          </Button>
        </div>
      </PromptPannelWrapper>
    </ShowUpWrapper>
  );
};

const TextArea = ({ conversation }: any) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <TextAreaWrapper>
      {conversation.map((c: any, i: number) => {
        if (c.from == "gemini") {
          return <GeminiAnswer key={i}>{c.msg}</GeminiAnswer>;
        } else {
          return <MyText key={i}>{c.msg}</MyText>;
        }
      })}
      <div ref={bottomRef} />
    </TextAreaWrapper>
  );
};

const MyText = styled.div`
  color: white;
  background-color: orange;
  align-self: flex-end;
  padding: 5px;
  border-radius: 10px;
`;

const GeminiAnswer = styled.div`
  white-space: pre-line;
  background-color: rgb(230, 230, 230);
  align-self: flex-start;
  padding: 5px;
  border-radius: 10px;
`;

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  height: 100%;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const Input = styled.input`
  padding-left: 5px;
  border: 1px gray solid;
  border-radius: 50px;
  flex: 10;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto 0 auto auto;
  border-radius: 50px;
  flex: 1;

  border: none;
  padding: 5px;
  transition: 0.3s;

  &:hover {
    background: black;
    color: white;
    transition: 0.3s;
  }
`;

const PromptPannelWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ShowUpWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease-in forwards;
`;

export default GeminiPromptPanel;
