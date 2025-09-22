import { Chat, User } from "@/types/index";

export const users: User[] = [
  { id: 1, name: 'Himanshu', avatar: 'https://picsum.photos/seed/alice/200/200', isOnline: true },
  { id: 2, name: 'Aditya', avatar: 'https://picsum.photos/seed/bob/200/200', isOnline: false },
  { id: 3, name: 'Shivansh', avatar: 'https://picsum.photos/seed/charlie/200/200', isOnline: true },
  { id: 4, name: 'Design Team', avatar: 'https://picsum.photos/seed/team/200/200', isOnline: false },
  { id: 5, name: 'Palak', avatar: 'https://picsum.photos/seed/eve/200/200', isOnline: false },
  { id: 6, name: 'Sandhya', avatar: 'https://picsum.photos/seed/frank/200/200', isOnline: true },
];

export const chats: Chat[] = [
  {
    id: 1,
    user: users[0],
    unreadCount: 2,
    messages: [
      // Last week's messages (oldest)
      { id: 1, content: 'See you on Monday!', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), sender: 1, status: 'read' },
      { id: 2, content: 'Sure, have a great weekend! ', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      // Yesterday's messages
      { id: 3, content: 'Good morning!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), sender: 1, status: 'read' },
      { id: 4, content: 'Morning! How was your night?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      // Today's messages (newest)
      { id: 5, content: 'Hey, how are you?', timestamp: new Date().toISOString(), sender: 1, status: 'read' },
      { id: 6, content: 'I am good, thanks! How about you?', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      { id: 7, content: 'Doing great! Just working on the new project.', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), sender: 1, status: 'read' },
      { id: 8, content: 'Sounds exciting!', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      { id: 9, content: 'Yeah, it is!', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), sender: 1, status: 'delivered' },
      { id: 10, content: 'Talk later!', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), sender: 1, status: 'delivered' },
    ],
  },
  {
    id: 2,
    user: users[1],
    unreadCount: 0,
    messages: [
      // Yesterday's messages (oldest)
      { id: 3, content: 'Thanks for the help!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), sender: 2, status: 'read' },
      // Today's messages (newest)
      { id: 1, content: 'Can you send me the file?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), sender: 2, status: 'read' },
      { id: 2, content: 'Sure, just sent it.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
    ],
  },
  {
    id: 3,
    user: users[2],
    unreadCount: 0,
    messages: [
      // Last week's messages (oldest)
      { id: 3, content: 'Party was amazing!', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), sender: 3, status: 'read' },
      // Yesterday's messages (newest)
      { id: 1, content: 'Happy Birthday!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      { id: 2, content: 'Thank you so much!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 15 * 60 * 1000).toISOString(), sender: 3, status: 'read' },
    ],
  },
  {
    id: 4,
    user: users[3],
    unreadCount: 5,
    messages: [
      // Yesterday's messages (oldest)
      { id: 4, content: 'Meeting postponed to tomorrow', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), sender: 4, status: 'read' },
      // Today's messages (newest)
      { id: 1, content: 'Team meeting at 3 PM.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), sender: 4, status: 'delivered' },
      { id: 2, content: 'Got it.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 - 1 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      { id: 3, content: "Don't forget the presentation slides.", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(), sender: 4, status: 'delivered' },
    ],
  },
  {
    id: 5,
    user: users[4],
    unreadCount: 0,
    messages: [
      // Last week's messages (oldest)
      { id: 2, content: 'Coffee was great!', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), sender: 5, status: 'read' },
      // Yesterday's messages (newest)
      { id: 1, content: 'See you tomorrow!', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), sender: 5, status: 'read' },
    ],
  },
  {
    id: 6,
    user: users[5],
    unreadCount: 1,
    messages: [
      // Yesterday's messages (oldest)
      { id: 2, content: 'Sure, 12:30 PM works?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), sender: 'me', status: 'read' },
      // Today's messages (newest)
      { id: 1, content: 'Lunch tomorrow?', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), sender: 6, status: 'delivered' },
    ],
  },
];
