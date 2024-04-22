/**
 * Sustainability
Green Computing - Refers to environmentally sustainable computing or IT practices, which include energy efficiency, reduced resource consumption, and disposal management.
Corporate Social Responsibility (CSR) - Pertains to companies taking responsibility for their impact on social and environmental well-being, often linked with sustainable business practices.
Renewable Technologies - Focuses on technologies that utilize renewable resources, such as solar energy and wind power, to support sustainable development in digital projects.
Life Cycle Assessment (LCA) - A technique to assess environmental impacts associated with all the stages of a product's life from cradle to grave (i.e., from raw material extraction through materials processing, manufacture, distribution, use, repair and maintenance, and disposal or recycling).
Sustainable Innovation - Refers to the development of new products and processes that contribute to sustainable development, including significantly lower use of natural resources and reduction of environmental impact.

Ethics
Data Privacy - Concerns protecting personal information from unauthorized access and ensuring the confidentiality and integrity of data in digital projects.
AI Ethics - Focuses on the moral issues and standards related to the design, creation, use, and behavior of artificial intelligence systems.
Code of Conduct - Refers to a set of rules outlining the norms, rules, and responsibilities or proper practices of an individual party or an organization.
Ethical Hacking - The practice of bypassing system security to identify potential data breaches and threats in a network that a malicious attacker could potentially exploit.
Fair Use Policies - Pertains to the guidelines that stipulate under what circumstances the use of copyrighted material without permission from the copyright owner is allowed, particularly relevant in digital content and software.

Stakeholder Engagement
Community Outreach - Involves activities and strategies used to communicate and engage with local communities and stakeholders in the planning and implementation phases of digital projects.
Stakeholder Analysis - A process of systematically gathering and analyzing qualitative information to determine whose interests should be considered when developing and deploying digital projects.
Engagement Strategies - Detailed plans on how to involve various stakeholders in the decision-making process effectively and inclusively.
User Feedback Loops - Refers to mechanisms and processes through which users of digital projects can provide continual feedback to improve and adapt the project development.
Public Consultation - The process of involving the public in the planning and decision-making processes of digital projects, ensuring transparency and better governance.
 */

type Points = number;

export const PointsGiven = {
  FirstFind: 5, // 5 points if it's the first time this keyword is found
  OtherFind: 1, // 1 point for each subsequent time the keyword is found
  MoreThanThree: 5, // 5 points if the keyword is found more than three times (only applies once)
  CategoryNeeded: 50, // points needed in total to be a match
};

export const KeyWordsPoint: {
  [categoryName: string]: {
    [keyWord: string]: Points;
  };
} = {
  Sustainability: {
    'Green Computing': 1,
    'Corporate Social Responsibility': 1,
    'Renewable Technologies': 1,
    'Life Cycle Assessment': 1,
    'Sustainable Innovation': 1,
  },

  Ethics: {
    'Data Privacy': 1,
    'AI Ethics': 1,
    'Code of Conduct': 1,
    'Ethical Hacking': 1,
    'Fair Use Policies': 1,
  },

  'Stakeholder Engagement': {
    'Community Outreach': 1,
    'Stakeholder Analysis': 1,
    'Engagement Strategies': 1,
    'User Feedback Loops': 1,
    'Public Consultation': 1,
  },
};

/*
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
*/
