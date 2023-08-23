import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useSnackbar, SnackbarSeverity } from "../hooks/useSnackbar";
import { isAPIError } from "../types";

export interface SendEmailFormDialogProps {
  nameResultsId: string;
}

const SendEmailFormDialog: React.FC<SendEmailFormDialogProps> = ({
  nameResultsId,
}): JSX.Element => {
  const isProduction = import.meta.env.VITE_NODE_ENV === "production";
  const [emailTextPlaceholder, emailTextFieldDisabled] = isProduction
    ? ["Email currently disabled", true]
    : ["Email", false];
  const [isOpen, setIsOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const handleClose = () => setIsOpen(false);
  const showSnackbar = useSnackbar();

  const emailResults: () => Promise<void> = async (): Promise<void> => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/email-results`,
        {
          email_address: emailAddress,
          results_id: nameResultsId,
        },
        {
          headers: {
            "X-API-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );

      showSnackbar("Email on its way!", SnackbarSeverity.INFO);
    } catch (error) {
      const errorMsg = isAPIError(error)
        ? error.detail
        : "Unexpected error. Please try again later.";
      showSnackbar(errorMsg, SnackbarSeverity.ERROR);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Tooltip placement="top" title="Email results">
        <IconButton
          color="primary"
          aria-label="email results"
          onClick={() => setIsOpen(true)}
        >
          <SendIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogContent>
          <DialogTitle>
            Share your names with a loved one or send to yourself.
          </DialogTitle>
          <TextField
            fullWidth
            size="small"
            id="email"
            placeholder={emailTextPlaceholder}
            type="text"
            variant="standard"
            autoFocus
            disabled={emailTextFieldDisabled}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={emailResults}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendEmailFormDialog;
