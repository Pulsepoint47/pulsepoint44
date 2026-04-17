-- Add columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Doctors
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  specialization TEXT NOT NULL DEFAULT 'General Practice',
  license_number TEXT NOT NULL DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  bio TEXT,
  consultation_fee NUMERIC(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Doctors can insert own record" ON public.doctors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Doctors can update own record" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);

-- Patients (table only; cross-table policy added after conversations exists)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  date_of_birth DATE,
  blood_type TEXT,
  allergies TEXT[],
  medical_history TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can view own record" ON public.patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can insert own record" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Patients can update own record" ON public.patients FOR UPDATE USING (auth.uid() = user_id);

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, patient_id)
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT USING (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Participants can update conversation" ON public.conversations FOR UPDATE USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

-- Now patients cross-table policy
CREATE POLICY "Doctors can view their patients" ON public.patients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.doctor_id = auth.uid() AND c.patient_id = patients.user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text','image','file','video_call_invite')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversation participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid()))
);
CREATE POLICY "Conversation participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid()))
);
CREATE POLICY "Participants can update message read status" ON public.messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid()))
);

-- Video calls
CREATE TABLE IF NOT EXISTS public.video_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  initiated_by UUID NOT NULL,
  room_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','ended','missed')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.video_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Conversation participants can view video calls" ON public.video_calls FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = video_calls.conversation_id AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid()))
);
CREATE POLICY "Conversation participants can create video calls" ON public.video_calls FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid()))
);
CREATE POLICY "Participants can update video call status" ON public.video_calls FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = video_calls.conversation_id AND (c.doctor_id = auth.uid() OR c.patient_id = auth.uid()))
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  type TEXT NOT NULL DEFAULT 'consultation' CHECK (type IN ('consultation','follow_up','checkup','video_call')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','confirmed','completed','cancelled','no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their appointments" ON public.appointments FOR SELECT USING (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = doctor_id OR auth.uid() = patient_id);
CREATE POLICY "Users can update their appointments" ON public.appointments FOR UPDATE USING (auth.uid() = doctor_id OR auth.uid() = patient_id);

-- Indexes
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

-- Update handle_new_user to populate doctors/patients and email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'patient');

  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    _role
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT DO NOTHING;

  IF _role = 'doctor' THEN
    INSERT INTO public.doctors (user_id, specialization, license_number)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'specialization', 'General Practice'),
      COALESCE(NEW.raw_user_meta_data->>'license_number', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF _role = 'patient' THEN
    INSERT INTO public.patients (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON public.doctors;
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON public.patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;