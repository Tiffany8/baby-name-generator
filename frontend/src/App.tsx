import * as React from "react";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { teal } from "@mui/material/colors";
import Box from "@mui/material/Box";

import AppContent from "./components/AppContent";

const theme = createTheme({
  palette: {
    primary: teal,
    secondary: teal,
  },
});

const App: React.FC = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
};

export default App;
