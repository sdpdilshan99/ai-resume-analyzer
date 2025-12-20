CREATE TABLE resumes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  company_name TEXT,
  job_title TEXT,
  feedback JSONB,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the data so users only see their own resumes
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);