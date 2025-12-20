interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface Resume {
  id: string;
  user_id: string;
  companyName?: string;
  jobTitle?: string;
  job : Job[]
  imagePath: string;
  imagePath2 ?: string;
  resumePath: string;
  feedback: Feedback;
  createdAt : string;
}

interface FeedbackTip {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface FeedbackCategory {
  score: number;
  tips: FeedbackTip[];
}

interface Feedback {
  overallScore: number;
  ATS : FeedbackCategory;
  toneAndStyle: FeedbackCategory;
  content: FeedbackCategory;
  structure: FeedbackCategory;
  skills: FeedbackCategory;
}
