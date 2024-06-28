"use client";
import CustomSnackbar from "@/components/snackbars/CustomSnackbar";
import AudioProvider from "@/components/music/AudioProvider";
import TabProvider from "@/components/tab-pages/TabProvider";
import { SnackbarProvider } from "notistack";
import React from "react";

declare module "notistack" {
  interface VariantOverrides {
    linkSnackbar: true;
    custom: true;
  }
}

type Props = {
  children: React.ReactNode;
};

const CampaignLayout = ({ children }: Props) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      Components={{
        custom: CustomSnackbar,
      }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <AudioProvider>
        <TabProvider>{children}</TabProvider>
      </AudioProvider>
    </SnackbarProvider>
  );
};

export default CampaignLayout;
