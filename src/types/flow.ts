type Author = {
  name: string;
  image: string;
  designation: string;
};

export type Flow = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
  category: string;
  complexity: string;
  timeToImplement: string;
  roi: string;
  technologies: string[];
  flowData?: any; // ReactFlow nodes and edges data
};
