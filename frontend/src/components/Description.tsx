import { Typography } from "@mui/material";
import { useEffect } from "react";

import { Footnote } from "../types";

export interface AppDescriptionProps {
  setFootnote: React.Dispatch<React.SetStateAction<Footnote | null>>;
}

const AppDescription: React.FC<AppDescriptionProps> = ({
  setFootnote,
}): JSX.Element => {
  useEffect(() => {
    setFootnote({
      id: "1",
      content: "Powered by OpenAI's GPT-3.5.",
    });

    return () => {
      setFootnote(null);
    };
  }, [setFootnote]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Baby Name Generator
      </Typography>
      <Typography variant="body2" paragraph>
        Welcome to the Baby Name Generator! Powered by artificial intelligence
        <sup>
          <a href="#1">
            <span>1</span>
          </a>
        </sup>{" "}
        , this tool crafts personalized name suggestions based on your unique
        preferences. Getting started is easy:
      </Typography>
      <Typography
        component={"ol"}
        sx={{ paddingInlineStart: "0.25em !important" }}
      >
        <ol>
          <Typography variant="body2" gutterBottom>
            <li>Parent Names: Fill in your and your partner's names.</li>

            <li>
              Cultural Backgrounds: Select or input one or more cultural
              backgrounds that resonate with you.
            </li>
            <li>
              Values: Select or input one or more values that are most important
              to you in a baby name.
            </li>
            <li>Popularity: Check if you prefer popular names.</li>
            <li>
              Role Models: Share any inspirations you'd like the name to
              reflect.
            </li>
          </Typography>
        </ol>
      </Typography>
      <Typography variant="body2" paragraph>
        Next, use the slider by each field to rank its importance—1 for 'Not
        important at all' and 5 for 'Extremely important'. After submitting the
        form with the 'Generate' button, you'll receive a list of names tailored
        to your inputs.
        <br />
        <br />
        Enjoy the journey of choosing your baby's name!
      </Typography>
    </>
  );
};

export default AppDescription;
