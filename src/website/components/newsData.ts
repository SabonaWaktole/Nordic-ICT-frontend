export type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  thumbnail: string;
  pinned: boolean;
};

export const newsData: NewsItem[] = [
  { id: 1, title: 'Nordic ICT: Advancing Technology and Welfare in Ethiopia', excerpt: 'Nordic ICT is a team of six people working daily to contribute to technological development and improved welfare in Ethiopia. Need digital solutions or a website? Contact us at contact@nordicict.com', date: '2025-03-15', thumbnail: 'https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', pinned: true },
  { id: 2, title: 'Partnering with Ethiopian Writers on Oromo Audiobooks', excerpt: 'We collaborate with Ethiopian writers as narrators for Oromo-language audiobooks, building partnerships based on mutual benefit.', date: '2025-03-01', thumbnail: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', pinned: false },
  { id: 3, title: 'Collaborating with Trading Groups and Tech Companies', excerpt: 'We have partnered with several trading groups and tech companies, working together on projects that bring mutual benefits.', date: '2025-02-20', thumbnail: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', pinned: false },
  { id: 4, title: 'Launching the First Oromo Audiobook in Ethiopian History', excerpt: 'Our Oromo audiobook project marks a historic milestone — the very first of its kind in Ethiopian and Oromo literary history.', date: '2025-02-10', thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', pinned: false }
];
