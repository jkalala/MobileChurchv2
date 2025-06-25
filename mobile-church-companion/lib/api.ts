import { supabase } from './supabase';

// Base API URL - hardcoded to bypass .env issues
const API_BASE_URL = 'http://192.168.18.15:3000/api';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

class ApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log('Making API request to:', fullUrl);
      console.log('Headers:', headers);
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return { data, error: null };
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Members API
  async getMembers() {
    return this.makeRequest('/members');
  }

  async createMember(memberData: any) {
    return this.makeRequest('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateMember(id: string, memberData: any) {
    return this.makeRequest(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteMember(id: string) {
    return this.makeRequest(`/members/${id}`, {
      method: 'DELETE',
    });
  }

  // Events API
  async getEvents() {
    return this.makeRequest('/events');
  }

  async createEvent(eventData: any) {
    return this.makeRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: any) {
    return this.makeRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.makeRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics API
  async getAnalytics() {
    return this.makeRequest('/analytics');
  }

  // Financial API
  async getFinancialData() {
    return this.makeRequest('/financial');
  }

  // Bible API
  async searchBible(query: string) {
    return this.makeRequest(`/bible/search?q=${encodeURIComponent(query)}`);
  }

  async getBibleVerse(reference: string) {
    return this.makeRequest(`/bible/verses?reference=${encodeURIComponent(reference)}`);
  }

  // Profile API
  async getUserProfile() {
    return this.makeRequest('/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.makeRequest('/profile/save', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Attendance API
  async recordAttendance(attendanceData: any) {
    return this.makeRequest('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async getAttendanceStats() {
    return this.makeRequest('/attendance');
  }
}

export const apiService = new ApiService(); 