"use-client";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  SwipeableDrawer,
} from "@mui/material";

import { ReactNode } from "react";
import Link from "next/link";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import HelpIcon from "@mui/icons-material/Help";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FeedbackIcon from "@mui/icons-material/Feedback";
import theme from "@/lib/theme";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useUser } from "@/lib/hook";
import { UserCampaignData } from "@/lib/types";

type Props = {
  isOpen: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
};

type NavItem = {
  href: string;
  text: string;
  icon?: ReactNode;
};
const iconColor = {
  color: theme.palette.primary.contrastText,
};

const HeaderDrawer = ({ isOpen, closeDrawer, openDrawer }: Props) => {
  const { user } = useUser();
  const { data } = useSWR(
    user ? `/api/user_campaigns/${user.uid}` : null,
    fetcher
  );
  const campaigns = data as UserCampaignData[] | undefined;
  const lastCampaign =
    campaigns && campaigns.length > 0
      ? campaigns[campaigns.length - 1]
      : undefined;

  const navItems: NavItem[] = [
    {
      text: lastCampaign ? lastCampaign.name : "Create a Campaign",
      href: lastCampaign ? `/campaigns/${lastCampaign.id}` : "/",
      icon: <FollowTheSignsIcon sx={iconColor} />, // fort icon also looked good
    },
    {
      text: "Learn More",
      href: "/learn-more",
      icon: <HelpIcon sx={iconColor} />,
    },
    {
      text: "Feedback Form",
      href: "/feedback",
      icon: <FeedbackIcon sx={iconColor} />,
    },
  ];

  return (
    <SwipeableDrawer
      anchor="left"
      open={isOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
    >
      <Box sx={{ bgcolor: theme.palette.primary.main, height: "100%" }}>
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <IconButton onClick={closeDrawer} size="large" sx={{ m: 1 }}>
            <ChevronLeftIcon />
          </IconButton>
        </Stack>
        <Divider />
        <List>
          {navItems.map((navItem) => (
            <Link key={navItem.href} href={navItem.href}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText sx={{ px: 2, py: 1 }} primary={navItem.text} />
                  {navItem.icon}
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </SwipeableDrawer>
  );
};

export default HeaderDrawer;
