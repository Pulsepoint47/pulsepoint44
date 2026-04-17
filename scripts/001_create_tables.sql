-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'doctor', 'patient');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (for all users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Doctors table (extends profiles for doctors)
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  years_experience INTEGER DEFAULT 0,
  bio TEXT,
  consultation_fee DECIMAL(10, 2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Patients table (extends profiles for patients)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  blood_type TEXT,
  allergies TEXT[],
  medical_history TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Conversations table (for chat between doctor and patient)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, patient_id)
);

-- Messages table (chat messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'video_call_invite')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video calls table
CREATE TABLE IF NOT EXISTS public.video_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  initiated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'missed')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  type TEXT DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow_up', 'checkup', 'video_call')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doctors
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can update own record" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Doctors can insert own record" ON public.doctors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for patients
CREATE POLICY "Patients can view own record" ON public.patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Doctors can view their patients" ON public.patients FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.doctor_id = auth.uid() AND c.patient_id = patients.user_id
  )
);
CREATE POLICY "Patients can update own record" ON public.patients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Patients can insert own record" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT 
USING (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT 
WITH CHECK (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Participants can update conversation" ON public.conversations FOR UPDATE 
USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

-- RLS Policies for messages
CREATE POLICY "Conversation participants can view messages" ON public.messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid())
  )
);
CREATE POLICY "Conversation participants can send messages" ON public.messages FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid())
  )
);
CREATE POLICY "Participants can update message read status" ON public.messages FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid())
  )
);

-- RLS Policies for video_calls
CREATE POLICY "Conversation participants can view video calls" ON public.video_calls FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = video_calls.conversation_id
    AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid())
  )
);
CREATE POLICY "Conversation participants can create video calls" ON public.video_calls FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid())
  )
);
CREATE POLICY "Participants can update video call status" ON public.video_calls FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = video_calls.conversation_id
    AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid())
  )
);

-- RLS Policies for appointments
CREATE POLICY "Users can view their appointments" ON public.appointments FOR SELECT 
USING (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT 
WITH CHECK (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Users can update their appointments" ON public.appointments FOR UPDATE 
USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON public.doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_doctor ON public.conversations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_patient ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_video_calls_conversation ON public.video_calls(conversation_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON public.appointments(scheduled_at);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.email,
    COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'patient')
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- If role is doctor, create doctor record
  IF COALESCE(new.raw_user_meta_data ->> 'role', 'patient') = 'doctor' THEN
    INSERT INTO public.doctors (user_id, specialization, license_number)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data ->> 'specialization', 'General Practice'),
      COALESCE(new.raw_user_meta_data ->> 'license_number', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- If role is patient, create patient record
  IF COALESCE(new.raw_user_meta_data ->> 'role', 'patient') = 'patient' THEN
    INSERT INTO public.patients (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON public.doctors;
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
