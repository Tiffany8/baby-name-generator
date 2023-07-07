import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";

import { NameResults } from "../types";

export interface ResultsCardProps {
  nameResults: NameResults | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  nameResults,
  isLoading,
  error,
}): JSX.Element => (
  <Card sx={{ marginY: 4, width: "100%" }}>
    {nameResults ? (
      <>
        <CardHeader
          component="div"
          subheader={nameResults.preference_summary}
          sx={{
            backgroundColor: "secondary.50",
          }}
        ></CardHeader>
        <CardContent>
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
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography sx={{ margin: "auto" }} variant="body1" component="div">
          Your results will appear here.
        </Typography>
      </Box>
    )}
  </Card>
);

export default ResultsCard;
