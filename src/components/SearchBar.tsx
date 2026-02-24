"use client";

import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (query: string) => void;   //  Callback to update search query in store
  placeholder?: string;               //  Optional placeholder text
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search tasks by title or description...",
}) => {
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      // Update search query as user types
      onChange={(e) => onSearch(e.target.value)}
      size="small"
      variant="outlined"
      //  Custom styles for nicer rounded input + visible border
      sx={{
        "& .MuiOutlinedInput-root": {
          height: 50,
          borderRadius: "12px",
          backgroundColor: "#f3f4f6",

          //  Default border
          "& fieldset": {
            borderColor: "#d1d5db",
            borderWidth: 1,
          },

          //  Border on hover
          "&:hover fieldset": {
            borderColor: "#9ca3af",
          },

          //  Border on focus
          "&.Mui-focused fieldset": {
            borderColor: "#6366f1",
            borderWidth: 1.5,
          },
        },

        // Input typography/padding
        "& input": {
          fontSize: 14,
          py: 0.8,
        },
      }}
      InputProps={{
        // Search icon at the start of the input
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ fontSize: 20, color: "#6b7280" }} />
          </InputAdornment>
        ),
      }}
    />
  );
};