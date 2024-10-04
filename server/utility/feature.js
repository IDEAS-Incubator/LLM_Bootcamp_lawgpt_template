
export function formatHistory(history, useOpenAI) {
    if (useOpenAI) {
      return history.map(item => ({
        role: item.role === "user" ? "user" : "assistant",
        content: item.parts || item.content
      }));
    } else {
      return history.map(item => ({
        role: item.role === "user" ? "user" : "assistant",
        content: item.content || item.parts
      }));
    }
  }
  