// Default avatar options for users
export const defaultAvatars = {
  male: [
    {
      id: 'male-1',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      name: 'Professional Male'
    },
    {
      id: 'male-2',
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      name: 'Casual Male'
    },
    {
      id: 'male-3',
      url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      name: 'Creative Male'
    }
  ],
  female: [
    {
      id: 'female-1',
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      name: 'Professional Female'
    },
    {
      id: 'female-2',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      name: 'Creative Female'
    },
    {
      id: 'female-3',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      name: 'Casual Female'
    }
  ]
};

// Default system avatars (like Instagram/Snapchat style)
export const systemAvatars = {
  male: {
    id: 'system-male',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTc1IDQwQzg1LjQ5MzQgNDAgOTQgNDguNTA2NiA5NCA1OUM5NCA2OS40OTM0IDg1LjQ5MzQgNzggNzUgNzhDNjQuNTA2NiA3OCA1NiA2OS40OTM0IDU2IDU5QzU2IDQ4LjUwNjYgNjQuNTA2NiA0MCA3NSA0MFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNSAxMjBDMzUgMTAwLjExIDUxLjE5IDg0IDcxIDg0SDc5Qzk4LjgxIDg0IDExNSAxMDAuMTEgMTE1IDEyMFYxMzBIMzVWMTIwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    name: 'Default Male'
  },
  female: {
    id: 'system-female',
    url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiByeD0iNzUiIGZpbGw9IiNFQzQ4OTkiLz4KPHBhdGggZD0iTTc1IDQwQzg1LjQ5MzQgNDAgOTQgNDguNTA2NiA5NCA1OUM5NCA2OS40OTM0IDg1LjQ5MzQgNzggNzUgNzhDNjQuNTA2NiA3OCA1NiA2OS40OTM0IDU2IDU5QzU2IDQ4LjUwNjYgNjQuNTA2NiA0MCA3NSA0MFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNSAxMjBDMzUgMTAwLjExIDUxLjE5IDg0IDcxIDg0SDc5Qzk4LjgxIDg0IDExNSAxMDAuMTEgMTE1IDEyMFYxMzBIMzVWMTIwWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTY1IDY1QzY1IDYwIDcwIDU1IDc1IDU1QzgwIDU1IDg1IDYwIDg1IDY1QzgwIDcwIDc1IDc1IDc1IDc1QzcwIDc1IDY1IDcwIDY1IDY1WiIgZmlsbD0iI0VDNDg5OSIvPgo8L3N2Zz4=',
    name: 'Default Female'
  }
};

export const generateInitialsAvatar = (name: string, size: number = 150) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-teal-500'
  ];
  
  const colorIndex = name.length % colors.length;
  
  return {
    initials,
    colorClass: colors[colorIndex],
    size
  };
};

export const getDefaultAvatarForGender = (gender: 'male' | 'female' | null) => {
  if (!gender) return systemAvatars.male; // Default to male if no gender specified
  return systemAvatars[gender];
};