export interface Partner {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  partnershipType: 'Strategic' | 'Technology' | 'Reseller' | 'Vendor';
  status: 'Active' | 'Inactive' | 'Pending';
  logo: string;
  joinDate: string;
}
