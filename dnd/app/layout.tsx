import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Header from "@/components/header/Header";
import { config } from "@fortawesome/fontawesome-svg-core";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/lib/theme";
import { Toolbar } from "@mui/material";

config.autoAddCss = false; // for font awesome
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DnD AI Generator",
  description: "An AI Generator for Playing DnD Campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Header />
            {/* Render another toolbar below this so content isn't hidden by header */}
            {/* https://mui.com/material-ui/react-app-bar/#fixed-placement */}
            <Toolbar />
            <main>{children}</main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
