"use client";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";

const FeedbackPage = () => {
  const [loadingVisible, setLoadingVisible] = useState(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingVisible(false);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Stack alignItems="center" position="relative">
      <Title>Feedback</Title>
      <Loading
        sx={{
          position: "absolute",
          top: 250,
          zIndex: 0,
          display: loadingVisible ? "inherit" : "none",
        }}
      />
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSeP2uHMP-i4qjA5h43-7u9SSoBFKuGlWRmNBxB8RLtbV_VaXw/viewform?embedded=true"
        width="100%"
        height="2300"
        style={{
          zIndex: 1,
          margin: 0,
          marginTop: 10,
          border: "none",
        }}
      />
    </Stack>
  );
};

export default FeedbackPage;
