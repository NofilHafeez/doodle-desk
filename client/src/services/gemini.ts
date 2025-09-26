// frontend/services/gemini.ts
export async function askGemini(prompt: string) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/gemini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    credentials: "include",
  });
  const data = await res.json();
  return data.response;
}
 