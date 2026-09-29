export interface Profile {
  name: string;
  role: string;
  headline: string;
  location: string;
  availability: string;
  about: string[];
  principle: string;
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  tech: string[];
  repoUrl: string;
  liveUrl: string;
}

export interface Service {
  title: string;
  promise: string;
  detail: string;
  tags: string[];
}

export interface ProcessStep {
  title: string;
  promise: string;
  detail: string;
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Portfolio {
  profile: Profile;
  projects: Project[];
  services: Service[];
  process: ProcessStep[];
  stack: StackGroup[];
  testimonials: Testimonial[];
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof ContactRequest | 'request', string>>;
