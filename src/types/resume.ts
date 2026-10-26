export interface Location {
  city: string;
  countryCode: string;
  region: string;
}

export interface WorkExperience {
  id?: string;
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
}

export interface Education {
  id?: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
}

export interface SkillGroup {
  id?: string;
  name: string;
  level?: string;
  keywords: string[];
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  url?: string;
}

export interface Basics {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  image?: string;
  location: Location;
}

export interface Resume {
  basics: Basics;
  work: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  sectionOrder?: ("work" | "skills" | "education")[];
  languages?: { language: string; fluency: string }[];
  interests?: string[];
}
