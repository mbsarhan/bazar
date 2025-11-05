// src/frontend/data/mockChatData.js

export const mockUsers = [
  {
    id: 1,
    fname: 'أحمد',
    lname: 'محمد',
    profilePicture: null,
    lastSeen: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    fname: 'سارة',
    lname: 'خالد',
    profilePicture: null,
    lastSeen: '2024-01-15T09:45:00'
  },
  {
    id: 3,
    fname: 'محمد',
    lname: 'العلي',
    profilePicture: null,
    lastSeen: '2024-01-14T18:20:00'
  },
  {
    id: 4,
    fname: 'فاطمة',
    lname: 'أحمد',
    profilePicture: null,
    lastSeen: '2024-01-15T11:00:00'
  },
  {
    id: 5,
    fname: 'عبدالله',
    lname: 'السالم',
    profilePicture: null,
    lastSeen: '2024-01-13T14:30:00'
  }
];

export const mockMessages = {
  1: [
    {
      id: 101,
      body: 'مرحباً، هل السيارة ما زالت متوفرة؟',
      sender_id: 1,
      receiver_id: 999, // Current user ID
      created_at: '2024-01-15T09:00:00',
      read_at: '2024-01-15T09:05:00'
    },
    {
      id: 102,
      body: 'نعم متوفرة، متى يمكنك المعاينة؟',
      sender_id: 999, // Current user ID
      receiver_id: 1,
      created_at: '2024-01-15T09:30:00',
      read_at: '2024-01-15T09:35:00'
    },
    {
      id: 103,
      body: 'يمكنني المعاينة اليوم مساءً',
      sender_id: 1,
      receiver_id: 999,
      created_at: '2024-01-15T10:00:00',
      read_at: '2024-01-15T10:05:00'
    },
    {
      id: 104,
      body: 'ممتاز، سأرسل لك الموقع',
      sender_id: 999,
      receiver_id: 1,
      created_at: '2024-01-15T10:15:00',
      read_at: '2024-01-15T10:20:00'
    },
    {
      id: 105,
      body: 'شكراً لك',
      sender_id: 1,
      receiver_id: 999,
      created_at: '2024-01-15T10:30:00',
      read_at: null // Unread message
    }
  ],
  2: [
    {
      id: 201,
      body: 'السلام عليكم، ما آخر سعر للشقة؟',
      sender_id: 2,
      receiver_id: 999,
      created_at: '2024-01-14T14:00:00',
      read_at: '2024-01-14T14:30:00'
    },
    {
      id: 202,
      body: 'وعليكم السلام، آخر سعر 500 ألف ريال',
      sender_id: 999,
      receiver_id: 2,
      created_at: '2024-01-14T15:00:00',
      read_at: '2024-01-14T15:10:00'
    },
    {
      id: 203,
      body: 'هل يمكن التفاوض؟',
      sender_id: 2,
      receiver_id: 999,
      created_at: '2024-01-14T16:00:00',
      read_at: null // Unread
    },
    {
      id: 204,
      body: 'السعر نهائي للأسف',
      sender_id: 999,
      receiver_id: 2,
      created_at: '2024-01-14T17:00:00',
      read_at: null
    }
  ],
  3: [
    {
      id: 301,
      body: 'مرحباً، أريد الاستفسار عن السيارة المعروضة',
      sender_id: 3,
      receiver_id: 999,
      created_at: '2024-01-13T10:00:00',
      read_at: '2024-01-13T11:00:00'
    },
    {
      id: 302,
      body: 'أهلاً بك، تفضل',
      sender_id: 999,
      receiver_id: 3,
      created_at: '2024-01-13T11:30:00',
      read_at: '2024-01-13T12:00:00'
    }
  ],
  4: [
    {
      id: 401,
      body: 'هل الإعلان ما زال متوفر؟',
      sender_id: 4,
      receiver_id: 999,
      created_at: '2024-01-15T08:00:00',
      read_at: null // Unread
    },
    {
      id: 402,
      body: 'أريد المزيد من الصور',
      sender_id: 4,
      receiver_id: 999,
      created_at: '2024-01-15T08:30:00',
      read_at: null // Unread
    },
    {
      id: 403,
      body: 'متى يمكنني المعاينة؟',
      sender_id: 4,
      receiver_id: 999,
      created_at: '2024-01-15T09:00:00',
      read_at: null // Unread
    }
  ],
  5: [
    {
      id: 501,
      body: 'السلام عليكم',
      sender_id: 999,
      receiver_id: 5,
      created_at: '2024-01-12T10:00:00',
      read_at: '2024-01-12T11:00:00'
    },
    {
      id: 502,
      body: 'وعليكم السلام ورحمة الله',
      sender_id: 5,
      receiver_id: 999,
      created_at: '2024-01-12T11:30:00',
      read_at: '2024-01-12T12:00:00'
    }
  ]
};

export const mockAds = {
  1: 'تويوتا كامري 2020',
  2: 'شقة للبيع في الرياض',
  3: 'هوندا أكورد 2019',
  4: 'فيلا في جدة',
  5: 'مازدا CX-5 2021'
};