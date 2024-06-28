import { CharacterFormData, MultipleValueFormData } from "@/lib/types";
import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import theme from "@/lib/theme";
import { useDebouncedCallback } from "use-debounce";

function isMultipleValueFormData(
  formData: CharacterFormData
): formData is MultipleValueFormData {
  return formData.multiple === true;
}

const InputField = (props: CharacterFormData) => {
  const { label, value, onChange, options, type, ...otherProps } = props;
  const [inputValue, setInputValue] = useState("");
  const isError = Boolean(inputValue);

  // This is a debounced function that will be called after a specified delay
  const debouncedOnChange = useDebouncedCallback(
    (newValue) => onChange(newValue),
    300 // debounce delay in ms
  );

  // Update local state immediately upon input change
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    debouncedOnChange(newValue); // Call the debounced onChange function
  };

  // synchronize local state with external changes (e.g. whenever gpt generates something, we want to pull it down)
  useEffect(() => {
    if (typeof value == "string" || typeof value == "number")
      setInputValue(String(value));
  }, [value]);

  // When options are provided and multiple is true
  if (options && isMultipleValueFormData(props)) {
    // Explicitly cast value and onChange to the expected types for multiple selection
    const multipleValue = value as string[];
    const multipleOnChange = onChange as (val: string[]) => void;

    return (
      <Autocomplete
        multiple
        value={multipleValue}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
              // Customize Chip component here
              style={{ color: "white", borderColor: "white" }}
            />
          ))
        }
        limitTags={4}
        onInputChange={(_, newValue) => setInputValue(newValue)}
        onChange={(_, newValue) => multipleOnChange(newValue as string[])}
        options={options}
        fullWidth
        freeSolo
        disableClearable
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            type={type}
            autoComplete="off"
            error={isError}
            helperText={
              isError ? (
                <>
                  <WarningIcon sx={{ color: "white", fontSize: 16 }} />
                  <Typography
                    textAlign="center"
                    fontSize={12}
                  >{`Enter your ${label} to Save`}</Typography>
                </>
              ) : (
                ""
              )
            }
            FormHelperTextProps={{
              sx: { display: "flex" },
            }}
            sx={{
              "& span": {
                color: theme.palette.primary.contrastText,
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option}
            sx={{ backgroundColor: "white" }}
          >
            <Typography>{option}</Typography>
          </Box>
        )}
      />
    );
  }

  // When options are provided and multiple is false
  if (options) {
    // Ensure value is a string for single selection
    return (
      <Autocomplete
        value={inputValue}
        onInputChange={(_, newValue) => handleInputChange(newValue)}
        options={options}
        fullWidth
        freeSolo
        disableClearable
        renderInput={(params) => (
          <TextField {...params} label={label} type={type} autoComplete="off" />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option}
            sx={{ backgroundColor: "white" }}
          >
            <Typography>{option}</Typography>
          </Box>
        )}
      />
    );
  }

  // Fallback for when no options are provided
  return (
    <TextField
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      label={label}
      type={type || "text"}
      fullWidth
      autoComplete="off"
      {...otherProps}
      inputProps={{
        ...props.inputProps,
        onWheel: (e) => e.currentTarget.blur(),
      }}
    />
  );
};

export default InputField;
