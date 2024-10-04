export const createSendingErrorMessage = (err) => {
    return "Error in post: " + err.toString();
  }
  
export function extractErrorDetails(err) {
    const errorMessage = err.toString();
    const match = errorMessage.match(/\b\d+\b/);
    const number = match ? parseInt(match[0]) : null;
    const errorText = errorMessage.replace(/\b\d+\b/, "").trim();
    return { number, errorText };
  }
  