import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  SignUpButton,
  SignInButton,
  SignOutButton,
  SignedOut,
  SignedIn,
} from "@clerk/clerk-react";

import { NameResults } from "../types";
import SendEmailFormDialog from "./SendEmailFormDialog";

export interface ResultsCardProps {
  nameResults: NameResults | null;
  isLoading: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  nameResults,
  isLoading,
}): JSX.Element => (
  <Card
    sx={{
      marginY: 4,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    }}
    color="primary"
  >
    {nameResults ? (
      <>
        <CardHeader
          component="div"
          action={
            <SignedIn>
              <SendEmailFormDialog nameResultsId={nameResults.id} />
            </SignedIn>
          }
          sx={{ fontSize: "1.5rem", backgroundColor: "primary.50" }}
        ></CardHeader>
        <CardContent>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {nameResults.preference_summary}
          </Typography>
          {nameResults.names.map((nameObject, i) => (
            <Box key={i} sx={{ margin: 2 }}>
              <Typography variant="body1" component="div">
                {nameObject.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nameObject.reasoning}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </>
    ) : isLoading ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="caption">Generating names...</Typography>
          <CircularProgress size={100} />
        </Box>
      </Box>
    ) : (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography sx={{ margin: "auto" }} variant="body1" component="div">
          Your results will appear here.
        </Typography>
      </Box>
    )}

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <SignedOut>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "auto",
          }}
        >
          <SignUpOrSignInButtons />
        </div>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button size="small" variant="text">
            Sign out
          </Button>
        </SignOutButton>
      </SignedIn>
    </Box>
  </Card>
);

const SignUpOrSignInButtons: React.FC = (): JSX.Element => (
  <>
    <SignUpButton mode="modal">
      <Button size="small" variant="text">
        Sign up
      </Button>
    </SignUpButton>
    <Typography variant="body2" display="block" gutterBottom>
      or
    </Typography>
    <SignInButton mode="modal">
      <Button size="small" variant="text">
        Sign in
      </Button>
    </SignInButton>
    <Typography variant="body2" display="block" gutterBottom>
      to save your results
    </Typography>
  </>
);

export default ResultsCard;
