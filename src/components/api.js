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
