// src/utils/keepAlive.ts
let pingCount = 0;
import fetch from "node-fetch";


export async function handler(): Promise<{ statusCode: number; body: string }> {
  const { default: fetch } = await import("node-fetch");
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    console.error("❌ BACKEND_URL not set in environment variables");
    return {
      statusCode: 500,
      body: "Backend URL missing",
    };
  }

  try {
    const res = await fetch(backendUrl);
    pingCount++;
    console.log(`✅ Ping #${pingCount} -> ${backendUrl} (Status: ${res.status})`);

    return {
      statusCode: 200,
      body: `Ping #${pingCount} successful`,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Ping failed:", err.message);
    } else {
      console.error("❌ Ping failed with unknown error");
    }
    return {
      statusCode: 500,
      body: "Ping failed",
    };
  }
}
