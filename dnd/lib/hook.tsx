import { onAuthStateChanged } from "@/lib/firebase/auth";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import { useEffect, useState } from "react";
import { AIPrompt } from "./types";

export const useUser = () => {
  // The initialUser comes from the server through a server component
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setLoading(false);
      setUser(authUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return;
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [router, user]);

  return { user, loading, unAuthenticated: !loading && !user };
};

export const useSmoothScroll = (valueToUseForHash?: string | null) => {
  useEffect(() => {
    if (valueToUseForHash || window?.location.hash) {
      const elementId =
        valueToUseForHash || decodeURIComponent(window.location.hash.slice(1));
      const element = document.getElementById(elementId);
      if (element) {
        const yOffset = -64; // this is the height of the header toolbar
        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;

        // scroll to `yOffset` pixels above the element
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [valueToUseForHash]);
};

export const useStreamedResponse = (
  promptObject: AIPrompt,
  extraArgs?: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming,
  endpoint: string = "/api/chat"
) => {
  const [data, setData] = useState("");
  const [done, setDone] = useState(false); // New state for done

  useEffect(() => {
    if (!endpoint || promptObject.prompt == null) return;

    setDone(false); // Ensure done is reset to false at the start

    const controller = new AbortController();
    const { signal } = controller;
    const systemMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      promptObject.systemPrompt
        ? [{ role: "system", content: promptObject.systemPrompt }]
        : [];

    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming = {
      messages: [
        ...systemMessage,
        { role: "user", content: promptObject.prompt },
      ],
      model: "gpt-3.5-turbo-0125",
      ...extraArgs,
      stream: true,
    };

    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal,
        });
        if (!response.body) {
          throw new Error("Failed to get readable stream.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const read = async ({
          done,
          value,
        }: {
          done: boolean;
          value?: Uint8Array;
        }) => {
          if (done) {
            setDone(true); // Indicate that streaming is complete
            return;
          }

          // Convert the Uint8Array to a string and update state
          const chunk = decoder.decode(value, { stream: true });
          setData((prevData) => prevData + chunk);

          // Read the next chunk
          reader.read().then(read);
        };

        reader.read().then(read);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Fetch error:", err);
          setDone(true); // Consider the operation complete on error
        }
      }
    };

    fetchData();

    // Cleanup function to abort fetch on component unmount
    return () => {
      controller.abort();
    };
  }, [endpoint, extraArgs, promptObject]);

  return { streamedData: data, setStreamedData: setData, done };
};
