import { apiClient, API_BASE_URL } from './client';
import type {
  User, Salon, Customer, ServiceCategory, ServiceItem,
  ProductItem, Invoice, DailyReport, SalesReport, Subscription
} from '../../types';

export const api = {
  auth: {
    signup: (data: { email: string; password: string; full_name: string; phone?: string; salon_name?: string }) =>
      apiClient<{ access_token: string; token_type: string; salon_id: string; role: string; user: User }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    login: (data: { email: string; password: string }) =>
      apiClient<{ access_token: string; token_type: string; salon_id: string; role: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    me: () => apiClient<User & { salons: { id: string; name: string; slug: string; role: string }[] }>('/auth/me'),
  },

  salons: {
    getCurrent: () => apiClient<Salon>('/salons/current'),
    updateCurrent: (data: Partial<Salon>) => apiClient<Salon>('/salons/current', {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    getMembers: () => apiClient<any[]>('/salons/members'),
  },

  customers: {
    list: (search?: string) => {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      return apiClient<Customer[]>(`/customers${q}`);
    },
    create: (data: { name: string; phone?: string; email?: string; gender?: string; notes?: string; preferences?: string }) =>
      apiClient<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    get: (id: string) => apiClient<{ customer: Customer; invoices: Invoice[] }>(`/customers/${id}`),
    update: (id: string, data: Partial<Customer>) =>
      apiClient<Customer>(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
  },

  services: {
    getCategories: () => apiClient<ServiceCategory[]>('/services/categories'),
    createCategory: (data: { name: string; description?: string; icon?: string }) =>
      apiClient<ServiceCategory>('/services/categories', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    list: (categoryId?: string) => {
      const q = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : '';
      return apiClient<ServiceItem[]>(`/services${q}`);
    },
    create: (data: Partial<ServiceItem>) =>
      apiClient<ServiceItem>('/services', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id: string, data: Partial<ServiceItem>) =>
      apiClient<ServiceItem>(`/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
  },

  products: {
    list: () => apiClient<ProductItem[]>('/products'),
    create: (data: Partial<ProductItem>) =>
      apiClient<ProductItem>('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id: string, data: Partial<ProductItem>) =>
      apiClient<ProductItem>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
  },

  invoices: {
    create: (data: any) =>
      apiClient<Invoice>('/invoices', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    list: (params?: { search?: string; status?: string; skip?: number; limit?: number }) => {
      const p = new URLSearchParams();
      if (params?.search) p.append('search', params.search);
      if (params?.status) p.append('status_filter', params.status);
      if (params?.skip) p.append('skip', String(params.skip));
      if (params?.limit) p.append('limit', String(params.limit));
      const qs = p.toString();
      return apiClient<Invoice[]>(`/invoices${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) => apiClient<Invoice>(`/invoices/${id}`),
    cancel: (id: string, reason?: string) =>
      apiClient<Invoice>(`/invoices/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
    refund: (id: string, reason?: string) =>
      apiClient<Invoice>(`/invoices/${id}/refund`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      }),
    downloadPdf: async (id: string, invoiceNumber: string) => {
      const blob = await apiClient<Blob>(`/invoices/${id}/pdf`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  },

  reports: {
    getDaily: (date?: string) => {
      const q = date ? `?report_date=${date}` : '';
      return apiClient<DailyReport>(`/reports/daily${q}`);
    },
    getSales: (startDate?: string, endDate?: string) => {
      const p = new URLSearchParams();
      if (startDate) p.append('start_date', startDate);
      if (endDate) p.append('end_date', endDate);
      const qs = p.toString();
      return apiClient<SalesReport>(`/reports/sales${qs ? `?${qs}` : ''}`);
    },
    getExportUrl: (startDate?: string, endDate?: string) => {
      const p = new URLSearchParams();
      if (startDate) p.append('start_date', startDate);
      if (endDate) p.append('end_date', endDate);
      const qs = p.toString();
      const token = localStorage.getItem('salondesk_token') || '';
      return `${API_BASE_URL}/reports/export${qs ? `?${qs}` : ''}`;
    }
  },

  subscriptions: {
    getCurrent: () => apiClient<Subscription>('/subscriptions/current'),
    upgrade: (planId: string) =>
      apiClient<Subscription>('/subscriptions/upgrade', {
        method: 'POST',
        body: JSON.stringify({ plan_id: planId })
      }),
  }
};
