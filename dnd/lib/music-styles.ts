import theme, { secondaryButtonStyles } from "./theme";

export const musicSectionTitleFontSize = 26;
export const musicIconSx = {
  color: theme.palette.primary.contrastText,
};
export const musicFontAwesomeStyle = {
  color: theme.palette.primary.contrastText,
  fontSize: 20,
};
export const musicPlayButtonSx = {
  fontSize: 40,
};
export const musicButtonSxFun = (isSelected: boolean) => {
  const smallWidth = 100;
  const largeWidth = 125;
  const styles = {
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    width: { xs: smallWidth, sm: largeWidth },
    height: { xs: smallWidth, sm: largeWidth },
    borderRadius: "50%",
  };
  return isSelected ? styles : { ...secondaryButtonStyles, ...styles };
};
