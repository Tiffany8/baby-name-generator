import { Typography } from "@mui/material";

import { Footnote as TFootnote } from "../types";

export interface FootnotesProps {
  footnote: TFootnote;
}

const Footnote: React.FC<FootnotesProps> = ({ footnote }): JSX.Element => (
  <Typography id={footnote.id} variant="caption" display="block" gutterBottom>
    <sup>{footnote.id}</sup> {footnote.content}
  </Typography>
);

export default Footnote;
