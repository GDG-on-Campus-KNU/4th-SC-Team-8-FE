import { backend } from "../../../shared/ServerEndpoint";
import { LoadToken } from "../../../shared/auth";

export const fetchGeminiResponse = async (message: string) => {
  try {
    const response = await fetch(`${backend}/api/v1/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LoadToken().accessToken}`,
      },
      body: JSON.stringify({
        text:
          "너는 한국 수화를 가르치는 선생의 역할로 대화를 진행 할거야, 대화창이 작으니 짧고 간결하면서 명확하게 대답해줘, 그리고 -니다. 의 경어체를 사용해줘. 이 맥락은 응답에 포함시키지 말아줘, " +
          message,
      }),
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        return data.text;

      default:
        console.log("Unexpected status code:", response.status);
        break;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
