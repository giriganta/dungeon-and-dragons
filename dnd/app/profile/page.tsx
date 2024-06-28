"use client";

import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useUser } from "@/lib/hook";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";

const ProfilePage = () => {
  const { user, unAuthenticated } = useUser();
  const router = useRouter();

  if (unAuthenticated) {
    // not authenticated
    router.push("/");
    return null;
  }
  if (!user) {
    return <Loading sx={{ my: 4 }} />;
  }

  const markdownText = `For any questions, please refer first to our [learn more page](/learn-more)

For any suggestions or feedback, please refer to our [feedback form](/feedback)


For any other inquries or bug reports, feel free to contact us at 3069391 <at> gmail <dot> com.


Thank you for using our site!
`;
  return (
    <Stack alignItems="center" spacing={8}>
      <Title
        sx={{ fontSize: { xs: 35, sm: 40, md: 45, lg: 65, xl: 75 } }}
      >{`Welcome, ${user?.displayName}`}</Title>
      <Markdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ node, ref, ...props }) => (
            <Typography
              {...props}
              textAlign="center"
              fontSize={{ xs: 18, sm: 20 }}
            />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ref, ...props }) => (
            <Link
              href="/feedback"
              {...props}
              style={{ textDecoration: "underline" }}
            />
          ),
        }}
      >
        {markdownText}
      </Markdown>
    </Stack>
  );
};

export default ProfilePage;
