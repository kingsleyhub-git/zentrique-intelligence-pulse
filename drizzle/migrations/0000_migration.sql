CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  intent text NOT NULL DEFAULT 'consultation' CHECK (intent IN ('consultation', 'demo')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  company text CHECK (company IS NULL OR char_length(company) <= 150),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000)
);

GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit the contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);