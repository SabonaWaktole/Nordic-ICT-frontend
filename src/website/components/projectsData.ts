export type ProjectItem = {
  id: number;
  name: string;
  overview: string;
  link: string;
  thumbnail: string;
};

export const projectsData: ProjectItem[] = [
  { id: 1, name: 'ETHIO BOOK', overview: 'Innovative platform that offers digital books and audiobooks.', link: 'https://www.nordic-et-platform.nordicict.com/', thumbnail: 'https://images.pexels.com/photos/5053740/pexels-photo-5053740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, name: 'BAZARO', overview: 'Digital marketplace solution with modern design and functionality.', link: 'https://diestus.com/referanser/bazaro/', thumbnail: '/assets/bazaro.png' },
  { id: 3, name: 'KNKT', overview: 'Innovative digital platform for seamless connectivity.', link: 'https://diestus.com/referanser/knkt/', thumbnail: '/assets/knkt.png' },
];
