"use client";

import { createTheme } from "@mui/material/styles";

//  Global MUI theme for the app
const theme = createTheme({
  palette: {
    background: {
      default: "#e5e7eb", //  App background (gray)
    },
  },
  typography: {
    //  Uses Geist font loaded in layout.tsx (via CSS variable)
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
});

export default theme;