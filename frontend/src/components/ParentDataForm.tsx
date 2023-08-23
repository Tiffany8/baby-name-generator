import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  TextField,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useFormik } from "formik";

import {
  CulturalBackground,
  NameResults,
  NameResultsSchema,
  ParentDataSchema,
  Value,
  isAPIError,
} from "../types";
import { SnackbarSeverity, useSnackbar } from "../hooks/useSnackbar";

export interface ParentDataFormProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNameResults: React.Dispatch<React.SetStateAction<NameResults | null>>;
}
const ParentDataForm: React.FC<ParentDataFormProps> = ({
  isLoading,
  setIsLoading,
  setNameResults,
}): JSX.Element => {
  const isProduction = import.meta.env.VITE_NODE_ENV === "production";
  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (isProduction) {
      event.preventDefault();
      alert("This feature is currently disabled.");
    }
  };
  const showSnackbar = useSnackbar();
  const formik = useFormik({
    initialValues: {
      parent1_name: "",
      parent2_name: "",
      values: [],
      cultural_backgrounds: [],
      popularity: "yes",
      role_models: "",
      family_names: "",
      parent1_name_importance: 3,
      parent2_name_importance: 3,
      values_importance: 3,
      cultural_backgrounds_importance: 3,
      popularity_importance: 3,
      role_models_importance: 3,
      family_names_importance: 3,
    },
    validationSchema: ParentDataSchema,
    onSubmit: () => {
      generateNames();
    },
  });

  const generateNames: () => Promise<void> = async (): Promise<void> => {
    setNameResults(null);
    setIsLoading(true);
    try {
      const response: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/names`,
        formik.values,
        {
          headers: {
            "X-API-Key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      const results = await NameResultsSchema.validate(response.data);
      setNameResults(results);
      setIsLoading(false);
    } catch (error: any) {
      const errorMsg = isAPIError(error)
        ? error.detail
        : "Unexpected error. Please try again later.";
      setIsLoading(false);
      showSnackbar(errorMsg, SnackbarSeverity.ERROR);
    }
  };

  return (
    <Grid
      width="100%"
      component="form"
      onSubmit={formik.handleSubmit}
      container
      direction="row"
      justifyContent="space-between"
      spacing={2}
      marginY={2}
    >
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          id="parent1_name"
          label="Your Name"
          type="text"
          variant="outlined"
          {...formik.getFieldProps("parent1_name")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Your Name's Importance</FormLabel>
        <Slider
          aria-label="Parent 1 Name Importance"
          id="parent1_name_importance"
          marks
          min={1}
          size="small"
          max={5}
          step={1}
          valueLabelDisplay="on"
          {...formik.getFieldProps("parent1_name_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          id="parent2_name"
          label="Your Partner's Name"
          type="text"
          variant="outlined"
          {...formik.getFieldProps("parent2_name")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Your Partner's Name Importance</FormLabel>
        <Slider
          size="small"
          aria-label="Parent 2 Name Importance"
          id="paeent2_name_importance"
          marks
          min={1}
          max={5}
          step={1}
          valueLabelDisplay="auto"
          {...formik.getFieldProps("parent2_name_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          id="role_models"
          label="Role Models"
          multiline
          maxRows={6}
          variant="outlined"
          helperText="Comma separate the names of your role models."
          {...formik.getFieldProps("role_models")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Role Models Importance</FormLabel>
        <Slider
          size="small"
          aria-label="Role Models Importance"
          id="role_models_importance"
          marks
          min={1}
          max={5}
          step={1}
          valueLabelDisplay="auto"
          {...formik.getFieldProps("role_models_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size="small"
          id="family_names"
          label="Family Names"
          multiline
          maxRows={6}
          variant="outlined"
          helperText="Comma separate the names of your family members."
          {...formik.getFieldProps("family_names")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Family Names Importance</FormLabel>
        <Slider
          size="small"
          aria-label="Family Names Importance"
          id="family_names_importance"
          marks
          min={1}
          max={5}
          step={1}
          valueLabelDisplay="auto"
          {...formik.getFieldProps("family_names_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          fullWidth
          size="small"
          id="values"
          multiple
          freeSolo
          options={Object.keys(Value)}
          value={formik.values.values}
          onChange={(_, value) => formik.setFieldValue("values", value)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Values"
              helperText="You can select multiple values and add your own."
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Values Importance</FormLabel>
        <Slider
          size="small"
          aria-label="Values Importance"
          id="values_importance"
          marks
          min={1}
          max={5}
          step={1}
          valueLabelDisplay="auto"
          {...formik.getFieldProps("values_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          fullWidth
          size="small"
          id="cultural_backgrounds"
          multiple
          freeSolo
          options={Object.keys(CulturalBackground)}
          value={formik.values.cultural_backgrounds}
          onChange={(_, value) =>
            formik.setFieldValue("cultural_backgrounds", value)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Cultural Backgrounds"
              helperText="You can select more than one and add your own."
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">
          Cultural Backgrounds Importance
        </FormLabel>
        <Slider
          size="small"
          aria-label="Cultural Background Importance"
          id="culrural_backgrounds_importance"
          marks
          min={1}
          max={5}
          step={1}
          valueLabelDisplay="auto"
          {...formik.getFieldProps("cultural_backgrounds_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Popular</FormLabel>
          <RadioGroup
            row
            aria-label="Popular"
            defaultValue="yes"
            name="popularity"
            onChange={(e) => formik.setFieldValue("popularity", e.target.value)}
          >
            <FormControlLabel
              value="yes"
              control={<Radio color="primary" />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio color="primary" />}
              label="No"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormLabel component="legend">Popularity Importance</FormLabel>
        <Slider
          size="small"
          aria-label="Popularity Importance"
          id="popularity_importance"
          marks
          min={1}
          max={5}
          step={1}
          valueLabelDisplay="auto"
          {...formik.getFieldProps("popularity_importance")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          disabled={isLoading}
          onClick={handleButtonClick}
        >
          Generate
        </Button>
      </Grid>
    </Grid>
  );
};

export default ParentDataForm;
