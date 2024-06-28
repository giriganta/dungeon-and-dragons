"use client";
import { Roboto } from "next/font/google";
import { alpha, createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    allVariants: {
      color: "#e1e1e1",
    },
  },
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#e1e1e1", // Color of the checkbox when it's not checked
          "&.Mui-checked": {
            // Styles applied to the checkbox itself when checked
            color: "#e1e1e1", // Example: Change checkbox color when checked
            backgroundColor: "transparent", // Ensure the background is transparent
            // You can also apply a border or change the icon color
          },
          "&.Mui-checked + .MuiFormControlLabel-label": {
            // Styles applied to the label next to the checkbox when checked
            color: "#e1e1e1", // Change label color when the checkbox is checked
            // Additional styling for the label can be added here
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#e1e1e1", // Color of the checkbox when it's not checked
          "&.Mui-checked": {
            // Styles applied to the checkbox itself when checked
            color: "#e1e1e1", // Example: Change checkbox color when checked
            backgroundColor: "transparent", // Ensure the background is transparent
            // You can also apply a border or change the icon color
          },
          "&.Mui-checked + .MuiFormControlLabel-label": {
            // Styles applied to the label next to the checkbox when checked
            color: "#e1e1e1", // Change label color when the checkbox is checked
            // Additional styling for the label can be added here
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root": {
            // Increase specificity by targeting MuiTypography within toolbar
            color: "#e1e1e1",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root": {
            // Increase specificity by targeting MuiTypography within toolbar
            color: "#e1e1e1",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#e1e1e1", 0.2),
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha("#e1e1e1", 0.2),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#e1e1e1",
          "&:hover": {
            backgroundColor: alpha("#e1e1e1", 0.2),
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: "#34515e",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          background: "#e1e1e1",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root": {
            color: "white",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "#1E053D",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root": {
            color: "#e1e1e1",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "& .MuiTextField-root": {
            textarea: {
              color: "black",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "inherit", // Light border color for the textfield
              },
              "&:hover fieldset": {
                borderColor: "inherit",
              },
              "&.Mui-focused fieldset": {
                borderColor: "inherit",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "inherit", // Label color when the textfield is focused
            },
            "& .MuiInputLabel-root": {
              color: "gray", // Label color
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "inherit", // Underline color before focus
            },
          },
          // backgroundColor: "#5E626D",
          // backgroundColor: "#DEDEDE",
          backgroundColor: "#e7e7e7",
          color: "#212121",
          "& .MuiTypography-root": {
            // Increase specificity by targeting MuiTypography within button
            color: "#212121",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#e1e1e1",
          backgroundColor: "#b1262d",
          "&:hover": {
            backgroundColor: "#8e0019",
          },
          "&:disabled": {
            backgroundColor: "#a7a7a7",
          },
          "& .MuiTypography-root": {
            // Increase specificity by targeting MuiTypography within MuiButton
            color: "#e1e1e1",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          // "& .MuiTypography-root": {
          //   // Increase specificity by targeting MuiTypography within MuiButtonBase
          //   color: "#e1e1e1",
          // },
          // "&:disabled": {
          //   "& .MuiTypography-root": {
          //     // Increase specificity by targeting MuiTypography within MuiButtonBase
          //     color: "lightgray",
          //   },
          // },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#cd3c43",
            fontWeight: 800,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            color: "white", // Light text color for readability
            fontSize: 20,
            fontWeight: 100,
          },
          textarea: {
            color: "white",
            fontSize: 20,
            fontWeight: 100,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray", // Light border color for the textfield
            },
            "&:hover fieldset": {
              borderColor: "lightgray", // More prominent border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "lightgray", // Border color when the textfield is focused
            },
          },
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
          borderRadius: 1, // Optional: if you want rounded corners
          "& .MuiInputLabel-root": {
            color: "lightgray", // Label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "lightgray", // Label color when the textfield is focused
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "lightgray", // Underline color before focus
          },
          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottomColor: "white", // Underline color on hover
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "white", // Underline color on focus
          },
        },
      },
    },
  },
  palette: {
    primary: {
      light: "#492c68",
      main: "#1E053D",
      dark: "#232328",
      contrastText: "#e1e1e1",
    },
    secondary: {
      light: "#fd6a6a",
      main: "#b1262d",
      dark: "#8e0019",
      contrastText: "#e1e1e1",
    },
    error: {
      light: "#ff5131",
      main: "#D50000", //same as #d50000
      dark: "#9b0000",
      contrastText: "#e1e1e1",
    },
    warning: {
      light: "#ff9d3f",
      main: "#ef6c00",
      dark: "#b53d00",
      contrastText: "#e1e1e1",
    },
    success: {
      light: "#76d275",
      main: "#43a047",
      dark: "#00701a",
      contrastText: "#e1e1e1",
    },
    info: {
      light: "#8eacbb",
      main: "#607d8b",
      dark: "#34515e",
      contrastText: "#e1e1e1",
    },
    action: {
      disabledBackground: "#e0e0e0",
    },
  },
});

export const primaryButtonStyles = {
  bgcolor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
  color: theme.palette.primary.contrastText,
};

export const secondaryButtonStyles = {
  bgcolor: theme.palette.info.dark,
  "&:hover": {
    bgcolor: theme.palette.info.main,
  },
};

export default theme;
