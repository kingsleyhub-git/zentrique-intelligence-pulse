ALTER TABLE public.contact_submissions DROP CONSTRAINT contact_submissions_intent_check;
ALTER TABLE public.contact_submissions ADD CONSTRAINT contact_submissions_intent_check CHECK (intent = ANY (ARRAY['consultation','demo','bi-services','ai-predictive','research','partnership']));
ALTER TABLE public.contact_submissions ADD COLUMN industry text CHECK (industry IS NULL OR char_length(industry) <= 80);
ALTER TABLE public.contact_submissions ADD COLUMN service_interest text CHECK (service_interest IS NULL OR char_length(service_interest) <= 80);
ALTER TABLE public.contact_submissions ADD COLUMN preferred_contact text CHECK (preferred_contact IS NULL OR char_length(preferred_contact) <= 40);
COMMENT ON COLUMN public.contact_submissions.message IS 'Business challenge described by the visitor';
COMMENT ON COLUMN public.contact_submissions.company IS 'Organization (optional)';