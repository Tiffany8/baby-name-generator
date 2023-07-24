import { ClerkProvider } from "@clerk/clerk-react";
import * as React from "react";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { teal, blue, red, orange } from "@mui/material/colors";
import Box from "@mui/material/Box";

import AppContent from "./components/AppContent";
import { SnackbarProvider } from "./hooks/useSnackbar";

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: teal,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: teal["700"],
          color: "white",
        },
        standardError: {
          backgroundColor: red["700"],
          color: "white",
        },
        standardWarning: {
          backgroundColor: orange["700"],
          color: "white",
        },
        standardInfo: {
          backgroundColor: blue["700"],
          color: "white",
        },
      },
    },
  },
});

const App: React.FC = (): JSX.Element => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingTop: "2rem",
              height: "100vh",
              width: "100vw",
              overflowY: "auto",
              backgroundColor: "white",
              color: "black",
            }}
          >
            <Container maxWidth="xl" sx={{ width: "100%" }}>
              <AppContent />
            </Container>
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default App;
