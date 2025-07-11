"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GameExperience() {
  const params = useParams();
  const experienceId = params.experienceId;
  const [username, setUsername] = useState("");

  // Function to send both experienceId and username to Unity
  const sendToUnity = () => {
    if (window.unityInstance) {
      if (experienceId) {
          window.unityInstance.SendMessage("WhopApi", "ReceiveExperienceId", experienceId);
      }
      if (username) {
          window.unityInstance.SendMessage("WhopApi", "ReceiveUserNameFromWeb", username);
      }
    } else {
      console.warn("⏳ Unity instance not ready yet.");
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("whop-dev-user-token");
    if (token) {
      fetch("https://api.whop.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          console.log("✅ Whop User:", user.username);
          setUsername(user.username);
        })
        .catch((err) => console.error("❌ Failed to fetch user:", err));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.unityInstance && experienceId && username) {
        sendToUnity();
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [experienceId, username]);

  return (
    <iframe
      src="/index.html"
      width="100%"
      height="100%"
      style={{ border: "none" }}
      allowFullScreen
    />
  );
}