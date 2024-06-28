import { forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack";

const CustomSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref} onClick={handleDismiss}>
        {props.message}
      </SnackbarContent>
    );
  }
);

CustomSnackbar.displayName = "CustomSnackbar";

export default CustomSnackbar;
