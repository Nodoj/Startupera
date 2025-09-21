export type TeamMember = {
  id: number;
  name: string;
  position: string;
  description: string;
  image: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
};
