"use client";

import { useUser } from "@/lib/hook";
import { Button, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import Loading from "../Loading";
import CampaignViewer from "./CampaignViewer";
import { signInWithGoogle } from "@/lib/firebase/auth";

const CampaignSection = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  return user ? (
    <CampaignViewer user={user} />
  ) : (
    <Stack spacing={4} alignItems="center">
      <Typography variant="h2" fontSize={40}>
        Get Started
      </Typography>
      <Divider sx={{ width: "100%" }} />
      <Button
        variant="contained"
        onClick={signInWithGoogle}
        sx={{ px: 3, py: 2 }}
      >
        <Stack direction="row" spacing={2}>
          <SvgIcon>
            {/* Google SVG Icon */}
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="18px"
              height="18px"
              viewBox="0 0 48 48"
            >
              <g>
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
          </SvgIcon>
          <Typography>Sign in with Google</Typography>
        </Stack>
      </Button>
    </Stack>
  );
};

export default CampaignSection;
