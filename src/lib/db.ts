// Types for our database entities
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'agent' | 'admin';
  createdAt: string;
  avatarUrl: string;
  isActive: boolean;
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  userId: number;
  assignedToId: number | null;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  ticketId: number;
  userId: number;
  isAi: boolean;
}

export interface KbArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isAgentOnly: boolean;
}

// Mock data utilities
const generateMockUsers = (count: number, role: User['role']): Partial<User>[] => {
  const users = [];
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    
    users.push({
      name,
      email,
      password: '$2a$10$XQhaVPeWJN83MGtL8xXw6e2cvqKiN8e32KymIOvUW2wllee8DhAuC', // "password"
      role,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      avatarUrl: `https://avatars.dicebear.com/api/avataaars/${name.replace(' ', '')}.svg`,
      isActive: true
    });
  }
  
  return users;
};

const ticketSubjects = [
  "Can't access my account",
  "Payment failed",
  "How do I reset my password?",
  "Service is down",
  "Need to update billing information",
  "Feature request",
  "Bug report",
  "Product not working as expected",
  "Request for refund",
  "Subscription cancellation"
];

const generateMockTickets = (count: number, userIds: number[], agentIds: number[]): Partial<Ticket>[] => {
  const tickets = [];
  const statuses: Ticket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
  const priorities: Ticket['priority'][] = ['low', 'medium', 'high', 'urgent'];
  
  for (let i = 1; i <= count; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    const updatedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    
    tickets.push({
      subject: ticketSubjects[Math.floor(Math.random() * ticketSubjects.length)],
      description: `This is a description for ticket ${i}. It contains details about the issue.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      assignedToId: Math.random() > 0.2 ? agentIds[Math.floor(Math.random() * agentIds.length)] : null
    });
  }
  
  return tickets;
};

const generateMockMessages = (count: number, ticketIds: number[], userIds: number[], agentIds: number[]): Partial<Message>[] => {
  const messages = [];
  
  for (let i = 1; i <= count; i++) {
    const ticketId = ticketIds[Math.floor(Math.random() * ticketIds.length)];
    const isCustomerMessage = Math.random() > 0.5;
    const userId = isCustomerMessage ? 
      userIds[Math.floor(Math.random() * userIds.length)] : 
      agentIds[Math.floor(Math.random() * agentIds.length)];
    
    messages.push({
      content: `This is a sample ${isCustomerMessage ? 'customer' : 'agent'} message ${i}.`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      ticketId,
      userId,
      isAi: false
    });
  }
  
  return messages;
};

const kbArticleTitles = [
  "How to reset your password",
  "Troubleshooting account access issues",
  "Billing and payment FAQ",
  "Getting started with our product",
  "Advanced features guide",
  "Security best practices",
  "API documentation",
  "Known issues and workarounds",
  "Upcoming features and releases",
  "Contact support options"
];

const generateMockKbArticles = (count: number): Partial<KbArticle>[] => {
  const articles = [];
  const categories = ['Account', 'Billing', 'Technical', 'General', 'Security'];
  
  for (let i = 1; i <= count; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000));
    const updatedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    
    articles.push({
      title: kbArticleTitles[i % kbArticleTitles.length],
      content: `# ${kbArticleTitles[i % kbArticleTitles.length]}\n\nThis is a detailed article that explains how to use this feature or solve this problem.\n\n## Steps\n\n1. First step\n2. Second step\n3. Third step\n\n## Additional Information\n\nHere is some additional information about this topic.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      viewCount: Math.floor(Math.random() * 1000),
      isAgentOnly: Math.random() > 0.7
    });
  }
  
  return articles;
};

// In a real app, we would connect to SQLite
// For this prototype, we'll use localStorage for persistence
let users: User[] = [];
let tickets: Ticket[] = [];
let messages: Message[] = [];
let kbArticles: KbArticle[] = [];
let isDbInitialized = false;

// Load data from localStorage
const loadFromLocalStorage = () => {
  try {
    const storedUsers = localStorage.getItem('support360_users');
    const storedTickets = localStorage.getItem('support360_tickets');
    const storedMessages = localStorage.getItem('support360_messages');
    const storedKbArticles = localStorage.getItem('support360_kbArticles');
    
    if (storedUsers) users = JSON.parse(storedUsers);
    if (storedTickets) tickets = JSON.parse(storedTickets);
    if (storedMessages) messages = JSON.parse(storedMessages);
    if (storedKbArticles) kbArticles = JSON.parse(storedKbArticles);
    
    return storedUsers !== null; // Return true if data was loaded
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return false;
  }
}

// Save data to localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('support360_users', JSON.stringify(users));
    localStorage.setItem('support360_tickets', JSON.stringify(tickets));
    localStorage.setItem('support360_messages', JSON.stringify(messages));
    localStorage.setItem('support360_kbArticles', JSON.stringify(kbArticles));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

// Initialize our mock database
export const initializeDb = () => {
  if (isDbInitialized) return;
  
  console.log('Checking for existing data...');
  
  // Try to load data from localStorage first
  const dataLoaded = loadFromLocalStorage();
  
  if (dataLoaded) {
    console.log('Database loaded from localStorage');
    isDbInitialized = true;
    return;
  }
  
  console.log('Initializing database with mock data...');
  
  // Create admin user
  users.push({
    id: 1,
    name: 'Admin User',
    email: 'admin@SUPPORTLINE.com',
    password: '$2a$10$XQhaVPeWJN83MGtL8xXw6e2cvqKiN8e32KymIOvUW2wllee8DhAuC', // "password"
    role: 'admin',
    createdAt: new Date().toISOString(),
    avatarUrl: 'https://avatars.dicebear.com/api/avataaars/admin.svg',
    isActive: true
  });
  
  // Generate mock users
  const mockCustomers = generateMockUsers(200, 'customer');
  const mockAgents = generateMockUsers(50, 'agent');
  
  let nextId = 2;
  mockCustomers.forEach(user => {
    users.push({...user, id: nextId++} as User);
  });
  
  const customerIds = users.filter(u => u.role === 'customer').map(u => u.id);
  
  mockAgents.forEach(user => {
    users.push({...user, id: nextId++} as User);
  });
  
  const agentIds = users.filter(u => u.role === 'agent').map(u => u.id);
  
  // Generate mock tickets
  const mockTickets = generateMockTickets(1000, customerIds, agentIds);
  nextId = 1;
  mockTickets.forEach(ticket => {
    tickets.push({...ticket, id: nextId++} as Ticket);
  });
  
  const ticketIds = tickets.map(t => t.id);
  
  // Generate mock messages
  const mockMessages = generateMockMessages(5000, ticketIds, customerIds, agentIds);
  nextId = 1;
  mockMessages.forEach(message => {
    messages.push({...message, id: nextId++} as Message);
  });
  
  // Generate KB articles
  const mockArticles = generateMockKbArticles(30);
  nextId = 1;
  mockArticles.forEach(article => {
    kbArticles.push({...article, id: nextId++} as KbArticle);
  });
  
  isDbInitialized = true;
  
  // Save the initial data to localStorage
  saveToLocalStorage();
  
  console.log('Database initialized with mock data');
};

// Auth functions
export const authenticateUser = (email: string, password: string) => {
  // In a real app, we would verify the password hash
  const user = users.find(u => u.email === email && u.isActive);
  
  if (!user) return null;
  
  // For the prototype, we'll accept any password that matches "password"
  if (password !== "password") return null;
  
  // Generate a simple token - browser compatible approach instead of JWT
  const token = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
  }));
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    }
  };
};

export const verifyToken = (token: string) => {
  try {
    // Decode the base64 token
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp < Date.now()) {
      return null;
    }
    
    const user = users.find(u => u.id === decoded.id && u.isActive);
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    };
  } catch (error) {
    return null;
  }
};

// Data access functions - In a real app, these would be SQL queries
export const getUsers = (role?: User['role']) => {
  return role ? users.filter(u => u.role === role) : users;
};

export const getUser = (id: number) => {
  return users.find(u => u.id === id);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'avatarUrl'>) => {
  const newUser: User = {
    ...userData,
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    avatarUrl: `https://avatars.dicebear.com/api/avataaars/${userData.name.replace(' ', '')}.svg`,
  };
  
  users.push(newUser);
  saveToLocalStorage(); // Save changes
  return newUser;
};

export const updateUser = (id: number, updates: Partial<Omit<User, 'id' | 'createdAt' | 'role'>>) => {
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  };
  
  saveToLocalStorage(); // Save changes
  return users[userIndex];
};

export const deleteUser = (id: number) => {
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) return false;
  
  users.splice(userIndex, 1);
  saveToLocalStorage(); // Save changes
  return true;
};

// Ticket related functions
export const getTickets = (filters: {
  userId?: number,
  assignedToId?: number,
  status?: Ticket['status'] | Ticket['status'][]
} = {}) => {
  let filteredTickets = [...tickets];
  
  if (filters.userId !== undefined) {
    filteredTickets = filteredTickets.filter(t => t.userId === filters.userId);
  }
  
  if (filters.assignedToId !== undefined) {
    filteredTickets = filteredTickets.filter(t => t.assignedToId === filters.assignedToId);
  }
  
  if (filters.status !== undefined) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    filteredTickets = filteredTickets.filter(t => statuses.includes(t.status));
  }
  
  return filteredTickets;
};

export const getTicket = (id: number) => {
  return tickets.find(t => t.id === id);
};

export const getTicketMessages = (ticketId: number) => {
  return messages.filter(m => m.ticketId === ticketId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newTicket: Ticket = {
    ...ticketData,
    id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tickets.push(newTicket);
  saveToLocalStorage(); // Save changes
  return newTicket;
};

export const updateTicket = (id: number, updates: Partial<Omit<Ticket, 'id' | 'createdAt'>>) => {
  const ticketIndex = tickets.findIndex(t => t.id === id);
  
  if (ticketIndex === -1) return null;
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveToLocalStorage(); // Save changes
  return tickets[ticketIndex];
};

export const createMessage = (messageData: Omit<Message, 'id' | 'createdAt'>) => {
  const newMessage: Message = {
    ...messageData,
    id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  
  messages.push(newMessage);
  
  // Update the ticket's updatedAt timestamp
  const ticketIndex = tickets.findIndex(t => t.id === messageData.ticketId);
  if (ticketIndex !== -1) {
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      updatedAt: new Date().toISOString()
    };
  }
  
  saveToLocalStorage(); // Save changes
  return newMessage;
};

// Knowledge Base related functions
export const getKbArticles = (isAgentOnly: boolean = false) => {
  return kbArticles.filter(article => isAgentOnly || !article.isAgentOnly);
};

export const getKbArticle = (id: number) => {
  return kbArticles.find(a => a.id === id);
};

export const incrementArticleViews = (id: number) => {
  const articleIndex = kbArticles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) return null;
  
  kbArticles[articleIndex] = {
    ...kbArticles[articleIndex],
    viewCount: kbArticles[articleIndex].viewCount + 1
  };
  
  saveToLocalStorage(); // Save changes
  return kbArticles[articleIndex];
};

export const updateKbArticle = (id: number, updates: Partial<Omit<KbArticle, 'id' | 'createdAt'>>) => {
  const articleIndex = kbArticles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) return null;
  
  kbArticles[articleIndex] = {
    ...kbArticles[articleIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveToLocalStorage(); // Save changes
  return kbArticles[articleIndex];
};

export const deleteKbArticle = (id: number) => {
  const articleIndex = kbArticles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) return false;
  
  kbArticles.splice(articleIndex, 1);
  saveToLocalStorage(); // Save changes
  return true;
};

// New function to get ticket comments
export const getTicketComments = (ticketId: number) => {
  const storedComments = localStorage.getItem('ticket_comments') || '[]';
  const allComments = JSON.parse(storedComments);
  return allComments.filter((comment: any) => comment.ticketId === ticketId);
};

// New function to create a comment
export const createComment = (comment: {
  content: string;
  ticketId: number;
  userId: number;
}) => {
  const storedComments = localStorage.getItem('ticket_comments') || '[]';
  const comments = JSON.parse(storedComments);
  
  const newComment = {
    ...comment,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  
  comments.push(newComment);
  localStorage.setItem('ticket_comments', JSON.stringify(comments));
  
  return newComment;
};

// New function to get available agents (for ticket assignment)
export const getAvailableAgents = () => {
  const users = getUsers();
  return users.filter((user: any) => user.role === 'agent');
};

// Initialize DB on module import
initializeDb();
