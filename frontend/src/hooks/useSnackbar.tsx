import { Alert, Snackbar } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

export enum SnackbarSeverity {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}

type SnackbarContextType = (
  message: string,
  severity: SnackbarSeverity
) => void;

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarContext = createContext<SnackbarContextType>(() => {});

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState(SnackbarSeverity.INFO);
  const [message, setMessage] = useState("");

  const showSnackbar: (message: string, severity: SnackbarSeverity) => void =
    useCallback((message: string, severity: SnackbarSeverity) => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    }, []);

  const handleClose = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};
