import { backend } from "../../../shared/ServerEndpoint";

export const fetchRandomVideos = async (
  setRandomVideos: (data: { youtubeLink: string }[]) => void
) => {
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