export interface ProductModel {
  name: string;
  description?: string;
  productType: string; // name; resolved via UI to a ProductType id
  businessCriticality?: 'Very High' | 'High' | 'Medium' | 'Low' | 'None';
  platform?: 'Web Application' | 'API' | 'Mobile' | 'Desktop' | 'Network';
  lifecycle?: 'New' | 'Production' | 'Limited Production' | 'Pre-production' | 'End of Life';
}

export interface ProductTypeModel {
  name: string;
  critical?: boolean;
}
