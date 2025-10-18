export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isPinned: boolean;
  startDate: Date; // Date object for app logic
  endDate?: Date;
  status?: string;
  projectLink?: string;
}
