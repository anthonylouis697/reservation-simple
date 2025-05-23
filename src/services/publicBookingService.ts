import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';
import { Category } from '@/types/service';

export interface BookingPageSettings {
  id: string;
  businessId: string;
  businessName: string;
  welcomeMessage: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  buttonCorners: string;
  selectedTemplate: string;
  showConfirmation: boolean;
  steps: any[];
  customTexts: any;
  layoutType: string;
  confirmationMessage: string | null;
  bookingButtonText: string;
  customUrl: string | null;
}

export const getPublicBusinessSettings = async (businessId: string): Promise<BookingPageSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('booking_page_settings')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching business settings:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Format data to match frontend structure
    return {
      id: data.id,
      businessId: data.business_id,
      businessName: data.business_name || '',
      welcomeMessage: data.welcome_message || 'Bienvenue sur notre page de réservation',
      logo: data.logo || null,
      primaryColor: data.primary_color || '#4f46e5',
      secondaryColor: data.secondary_color || '#ffffff',
      buttonCorners: data.button_corners || 'rounded',
      selectedTemplate: data.selected_template || 'standard',
      showConfirmation: data.show_confirmation !== false,
      steps: data.steps || [],
      customTexts: data.custom_texts || {},
      layoutType: data.layout_type || 'stepped',
      confirmationMessage: data.confirmation_message,
      bookingButtonText: data.booking_button_text || 'Réserver',
      customUrl: data.custom_url
    };
  } catch (error) {
    console.error('Error in getPublicBusinessSettings:', error);
    return null;
  }
};

export const getPublicServices = async (businessId: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('position');
    
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    
    // Map data to match frontend Service type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price || 0,
      duration: item.duration || 60,
      categoryId: item.category_id || '',
      position: item.position || 0,
      isActive: item.is_active !== false,
      // Add default values for required properties in Service type
      location: '',
      capacity: 1,
      category: null,
      bufferTimeBefore: 0,
      bufferTimeAfter: 0,
      assignedEmployees: [], // Add this missing property
      notes: '',
      color: '',
      isRecurring: false // Add this missing property
    }));
  } catch (error) {
    console.error('Error in getPublicServices:', error);
    return [];
  }
};

// Add the missing hasActiveServices function
export const hasActiveServices = async (businessId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true);
    
    if (error) {
      console.error('Error checking for active services:', error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('Error in hasActiveServices:', error);
    return false;
  }
};

export const getPublicCategories = async (businessId: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('business_id', businessId)
      .order('position');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    // Map data to match frontend Category type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      position: item.position || 0,
      isActive: true // Default value to match Category type requirement
    }));
  } catch (error) {
    console.error('Error in getPublicCategories:', error);
    return [];
  }
};

export const getPublicBusinessInfo = async (businessId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('name, logo_url, description')
      .eq('id', businessId)
      .maybeSingle();
    
    if (error || !data) {
      console.error('Error fetching business info:', error);
      return null;
    }
    
    return {
      name: data.name,
      logo: data.logo_url,
      description: data.description
    };
  } catch (error) {
    console.error('Error in getPublicBusinessInfo:', error);
    return null;
  }
};
