// src/config/blog-tags.ts

export interface BlogTagCategories {
  [key: string]: string[];
}

export const blogTagConfig: BlogTagCategories = {
  "Hoofdonderwerpen": [
    "focus",
    "neurodiversiteit",
    "adhd",
    "autisme",
    "balans",
    "inspiratie",
    "opvoeding",
    "puberteit"
  ],
  "Doelgroep": [
    "ouders",
    "tieners",
    "kinderen",
    "coaches",
    "tutors"
  ],
  "Content Type": [
    "strategieën",
    "tips"
  ],
  "Specifieke Thema's": [
    "schermtijd",
    "uitstelgedrag",
    "vriendschap",
    "concentratie"
  ]
};

export const getAllBlogTags = (): string[] => {
  return Object.values(blogTagConfig).flat();
};
