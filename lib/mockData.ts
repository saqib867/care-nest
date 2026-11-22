export interface MockCaregiver {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  gender: 'Female' | 'Male' | 'Other';
  experienceYears: number;
  hourlyRate: number;
  currency: string;
  languages: string[];
  certifications: string[];
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  isVerified: boolean;
  location: string;
  availability: {
    dayOfWeek: number; // 0 = Sun, 1 = Mon, etc.
    hours: string; // e.g. "08:00 - 17:00"
  }[];
}

export interface MockBooking {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverAvatar: string;
  familyId: string;
  familyName: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  commissionFee: number;
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  dateString: string;
}

export interface MockConversation {
  id: string;
  participantIds: string[];
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: 'FAMILY' | 'CAREGIVER';
  }[];
  createdAt: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export const mockCaregivers: MockCaregiver[] = [
  {
    id: "cg-1",
    name: "Dr. Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Certified Dementia Care Practitioner and former general practitioner with over 12 years of experience in senior care. Specialized in Alzheimer care, physical rehabilitation assistance, and personalized medicine compliance.",
    gender: "Female",
    experienceYears: 12,
    hourlyRate: 45.00,
    currency: "EUR",
    languages: ["German", "English", "Russian"],
    certifications: ["Dementia Care Specialist", "Advanced Cardiac Life Support (ACLS)", "First Aid certified"],
    rating: 4.9,
    reviewCount: 38,
    isPremium: true,
    isVerified: true,
    location: "Munich, Germany",
    availability: [
      { dayOfWeek: 1, hours: "08:00 - 16:00" },
      { dayOfWeek: 2, hours: "08:00 - 16:00" },
      { dayOfWeek: 3, hours: "08:00 - 16:00" },
      { dayOfWeek: 4, hours: "08:00 - 16:00" },
      { dayOfWeek: 5, hours: "08:00 - 12:00" }
    ]
  },
  {
    id: "cg-2",
    name: "Marcus Vance, CNA",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Dedicated Certified Nursing Assistant (CNA) with 8 years of home care experience. Committed to helping clients maintain their independence, dignity, and active lifestyle in the comfort of their homes.",
    gender: "Male",
    experienceYears: 8,
    hourlyRate: 32.50,
    currency: "EUR",
    languages: ["English", "German"],
    certifications: ["Licensed CNA", "Hospice Care certified", "CPR certified"],
    rating: 4.8,
    reviewCount: 24,
    isPremium: false,
    isVerified: true,
    location: "Berlin, Germany",
    availability: [
      { dayOfWeek: 1, hours: "09:00 - 18:00" },
      { dayOfWeek: 2, hours: "09:00 - 18:00" },
      { dayOfWeek: 4, hours: "09:00 - 18:00" },
      { dayOfWeek: 5, hours: "09:00 - 18:00" }
    ]
  },
  {
    id: "cg-3",
    name: "Clara Dupont",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Compassionate pediatric and elderly assistant with 6 years of expertise. Specialized in dietary management, physical therapy assistance, and active companionship.",
    gender: "Female",
    experienceYears: 6,
    hourlyRate: 38.00,
    currency: "CHF",
    languages: ["French", "German", "English"],
    certifications: ["Spitex-approved Companion", "Nutritional Therapy Practitioner"],
    rating: 4.7,
    reviewCount: 19,
    isPremium: true,
    isVerified: true,
    location: "Zurich, Switzerland",
    availability: [
      { dayOfWeek: 2, hours: "10:00 - 20:00" },
      { dayOfWeek: 3, hours: "10:00 - 20:00" },
      { dayOfWeek: 4, hours: "10:00 - 20:00" },
      { dayOfWeek: 6, hours: "09:00 - 15:00" }
    ]
  },
  {
    id: "cg-4",
    name: "Sophie Becker",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "Home companion and nurse helper. 10+ years helping seniors with mobility issues, grocery shopping, meal preparation, and transportation to clinical visits.",
    gender: "Female",
    experienceYears: 10,
    hourlyRate: 29.00,
    currency: "EUR",
    languages: ["German", "English"],
    certifications: ["Mobility & Transfer Assistance", "First Aid certified"],
    rating: 4.9,
    reviewCount: 51,
    isPremium: false,
    isVerified: false,
    location: "Vienna, Austria",
    availability: [
      { dayOfWeek: 1, hours: "08:00 - 17:00" },
      { dayOfWeek: 3, hours: "08:00 - 17:00" },
      { dayOfWeek: 5, hours: "08:00 - 17:00" }
    ]
  }
];

export const mockBookings: MockBooking[] = [
  {
    id: "bk-1",
    caregiverId: "cg-1",
    caregiverName: "Dr. Elena Rostova",
    caregiverAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    familyId: "fam-1",
    familyName: "The Mueller Family",
    startTime: "09:00",
    endTime: "13:00",
    hourlyRate: 45.00,
    commissionFee: 27.00, // 15% of 180 = 27
    totalAmount: 180.00,
    status: "ACCEPTED",
    paymentStatus: "PAID",
    dateString: "2026-08-03"
  },
  {
    id: "bk-2",
    caregiverId: "cg-2",
    caregiverName: "Marcus Vance, CNA",
    caregiverAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    familyId: "fam-1",
    familyName: "The Mueller Family",
    startTime: "13:00",
    endTime: "17:00",
    hourlyRate: 32.50,
    commissionFee: 19.50, // 15% of 130 = 19.5
    totalAmount: 130.00,
    status: "PENDING",
    paymentStatus: "UNPAID",
    dateString: "2026-08-04"
  },
  {
    id: "bk-3",
    caregiverId: "cg-3",
    caregiverName: "Clara Dupont",
    caregiverAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    familyId: "fam-1",
    familyName: "The Mueller Family",
    startTime: "10:00",
    endTime: "15:00",
    hourlyRate: 38.00,
    commissionFee: 28.50,
    totalAmount: 190.00,
    status: "COMPLETED",
    paymentStatus: "PAID",
    dateString: "2026-07-28"
  }
];

export const mockConversations: MockConversation[] = [
  {
    id: "conv-1",
    participantIds: ["fam-1", "cg-1"],
    participants: [
      { id: "fam-1", name: "Mueller Family", avatar: "", role: "FAMILY" },
      { id: "cg-1", name: "Dr. Elena Rostova", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200", role: "CAREGIVER" }
    ],
    createdAt: "2026-08-01T10:00:00Z"
  },
  {
    id: "conv-2",
    participantIds: ["fam-1", "cg-2"],
    participants: [
      { id: "fam-1", name: "Mueller Family", avatar: "", role: "FAMILY" },
      { id: "cg-2", name: "Marcus Vance, CNA", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200", role: "CAREGIVER" }
    ],
    createdAt: "2026-08-01T10:00:00Z"
  }
];

export const mockMessages: MockMessage[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "fam-1",
    senderName: "Mueller Family",
    content: "Hello Dr. Rostova, we are looking for a dementia care assistant for my mother starting next Tuesday. Are you available for a 4-hour morning shift?",
    createdAt: "2026-08-01T10:15:00Z"
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "cg-1",
    senderName: "Dr. Elena Rostova",
    content: "Hello! Yes, I am available on Tuesdays from 08:00 to 16:00. I would love to schedule an initial consultation call first. Does that work for you?",
    createdAt: "2026-08-01T10:22:00Z"
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "fam-1",
    senderName: "Mueller Family",
    content: "That sounds excellent. I will schedule a call through the portal now. Thank you!",
    createdAt: "2026-08-01T10:30:00Z"
  }
];
