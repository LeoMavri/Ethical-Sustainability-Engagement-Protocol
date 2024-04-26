export const PointsGiven = {
  FirstFind: 5, // 5 points if it's the first time this keyword is found
  OtherFind: 1, // 1 point for each subsequent time the keyword is found
  MoreThanThree: 5, // 5 points if the keyword is found more than three times (only applies once)
  CategoryNeeded: 50, // points needed in total to be a match
};

const KeyWords = {
  Susteainability: [
    'Green Computing',
    'Corporate Social Responsibility',
    'CSR',
    'Renewable Technologies',
    'Life Cycle Assessment',
    'LCA',
    'Sustainable Innovation',
  ],

  Ethics: ['Data Privacy', 'AI Ethics', 'Code of Conduct', 'Ethical Hacking', 'Fair Use Policies'],

  'Stakeholder Engagement': [
    'Community Outreach',
    'Stakeholder Analysis',
    'Engagement Strategies',
    'User Feedback Loops',
    'Public Consultation',
  ],
};

export default KeyWords;
