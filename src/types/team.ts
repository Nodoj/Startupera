export type TeamMember = {
  id: number;
  name: string;
  position: string;
  description: string;
  image: string;
  backgroundColor: string; // For card background color
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
};
