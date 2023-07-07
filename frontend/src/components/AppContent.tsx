import { Paper, Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";

import { Footnote as TFootnote, NameResults } from "../types";
import AppDescription from "./Description";
import Footnote from "./Footnote";
import ParentForm from "./Form";
import ResultsCard from "./ResultsCard";

const AppLayout: React.FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [footnote, setFootnote] = useState<TFootnote | null>(null);
  const [nameResults, setNameResults] = useState<NameResults | null>(null);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        marginX: "auto",
      }}
    >
      <Grid container flexDirection="column" spacing={3} padding={4}>
        <Grid container margin={2} paddingX={4}>
          <AppDescription setFootnote={setFootnote} />
        </Grid>
        <Divider orientation="horizontal" variant="middle" flexItem />
        <Grid
          container
          flexDirection="row"
          justifyContent="space-between"
          spacing={2}
          xs={12}
          columns={12}
          paddingX={4}
        >
          <Grid xs={12} sm={8}>
            <ParentForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setNameResults={setNameResults}
              setError={setError}
            />
          </Grid>
          <Grid container xs={12} sm={4}>
            <ResultsCard
              nameResults={nameResults}
              isLoading={isLoading}
              error={error}
            />
          </Grid>
        </Grid>
        {footnote && (
          <Grid container xs={12}>
            <Divider variant="middle" />
            <Footnote footnote={footnote} />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default AppLayout;
