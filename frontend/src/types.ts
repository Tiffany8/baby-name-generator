import * as yup from "yup";

export enum Value {
  Integrity = "Integrity",
  Kindness = "Kindness",
  Compassion = "Compassion",
  Respect = "Respect",
  Responsibility = "Responsibility",
  Honesty = "Honesty",
  Courage = "Courage",
  Justice = "Justice",
  Wisdom = "Wisdom",
  Freedom = "Freedom",
  Peace = "Peace",
  Generosity = "Generosity",
  Humility = "Humility",
  Perseverance = "Perseverance",
  Love = "Love",
  Knowledge = "Knowledge",
  Family = "Family",
  Health = "Health",
  Creativity = "Creativity",
  Ambition = "Ambition",
  Faith = "Faith",
}

export enum CulturalBackground {
  African = "African",
  Chinese = "Chinese",
  Indian = "Indian",
  Persion = "Persion",
  American = "American",
  British = "British",
  French = "French",
  German = "German",
  Japanese = "Japanese",
  Mexican = "Mexican",
  Italian = "Italian",
  Spanish = "Spanish",
  Australian = "Australian",
  Irish = "Irish",
  Russian = "Russian",
  Brazilian = "Brazilian",
  Canadian = "Canadian",
  Korean = "Korean",
  Vietnamese = "Vietnamese",
  Greek = "Greek",
  Turkish = "Turkish",
  Arabic = "Arabic",
}

export const ParentDataSchema = yup.object({
  parent1_name: yup.string().required("Parent name is required"),
  parent2_name: yup.string().required("Parent name is required"),
  values: yup.array().of(yup.string()).required(),
  cultural_backgrounds: yup.array().of(yup.string()).required(),
  popularity: yup.string().oneOf(["yes", "no"]).required(),
  role_models: yup.string().nullable(),
  family_names: yup.string().nullable(),
  parent1_name_importance: yup.number().required().min(1).max(5),
  parent2_name_importance: yup.number().required().min(1).max(5),
  values_importance: yup.number().required().min(1).max(5),
  cultural_backgrounds_importance: yup.number().required().min(1).max(5),
  popularity_importance: yup.number().required().min(1).max(5),
  role_models_importance: yup.number().required().min(1).max(5),
  family_names_importance: yup.number().required().min(1).max(5),
});

export type ParentData = yup.InferType<typeof ParentDataSchema>;

export const NameSchema = yup.object({
  name: yup.string().required(),
  reasoning: yup.string().required(),
});

export const NameResultsSchema = yup.object({
  id: yup.string().required(),
  preference_summary: yup.string().required(),
  names: yup.array().of(NameSchema).required(),
});

export type NameResults = yup.InferType<typeof NameResultsSchema>;

export const FootnoteSchema = yup.object({
  id: yup.string().required(),
  content: yup.string().required(),
});

export type Footnote = yup.InferType<typeof FootnoteSchema>;

export const APIErrorSchema = yup.object({
  detail: yup.string().required(),
});

export type APIError = yup.InferType<typeof APIErrorSchema>;

export const isAPIError = (obj: any): obj is APIError =>
  "detail" in obj && typeof obj.detail === "string";

export const EmailResultsRequestSchema = yup.object({
  email_address: yup.string().email().required(),
  results_id: yup.string().required(),
});
