// components/api.js

export async function sendTextToServer(text) {
  try {
    const res = await fetch("http://localhost:5000/api/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.response; // "yes" or "no"
  } catch (err) {
    console.error("Failed to reach server:", err);
    return "error";
  }
}


/**
 * Send the given text to the server and return the associated rotation vector.
 *
 * @param {string} text - The text to send to the server
 * @return {Promise<string[]|string>} - A promise that resolves to the rotation vector
 *                                       associated with the text, or "error" if the
 *                                       server was unreachable.
 */
export async function sendTextAndGetRotationVector(text) {
  try {
    const res = await fetch("http://localhost:5000/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.response; // Should be a rotation vector
  } catch (err) {
    console.error("Failed to reach server:", err);
    return "error";
  }
}