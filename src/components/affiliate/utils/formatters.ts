
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': 
      return 'text-green-600 bg-green-100';
    case 'active': 
      return 'text-blue-600 bg-blue-100';
    case 'rejected': 
      return 'text-red-600 bg-red-100';
    case 'pending': 
    default: 
      return 'text-yellow-600 bg-yellow-100';
  }
};
