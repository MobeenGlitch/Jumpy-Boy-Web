"use client";

export default function UnityIframe() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <iframe
  src="/unity/unity.html"
  style={{ width: "100%", height: "100%", border: "none" }}
  allowFullScreen
  title="JumpyBoy Game"
/>
    </div>
  );
}