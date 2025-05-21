
CREATE TABLE IF NOT EXISTS public.availability_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  regular_schedule JSONB NOT NULL,
  special_dates JSONB[] DEFAULT '{}',
  blocked_dates TEXT[] DEFAULT '{}',
  buffer_time_minutes INTEGER NOT NULL DEFAULT 15,
  advance_booking_days INTEGER NOT NULL DEFAULT 30,
  min_advance_hours INTEGER NOT NULL DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (business_id)
);

-- Create an index on business_id for faster lookups
CREATE INDEX IF NOT EXISTS availability_settings_business_id_idx ON public.availability_settings (business_id);

-- Add updated_at trigger
CREATE TRIGGER set_availability_settings_updated_at
BEFORE UPDATE ON public.availability_settings
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();
