import dotenv from 'dotenv';

dotenv.config();

const Constants = {
  ApiKey: process.env.ELSEVIER_API_KEY,
  QueryString:
    '("Digital Transformation" OR "Digital Projects" OR "Digital Strategy" OR "Technology Adoption" OR "Digital Innovation" OR "Tech Projects" OR "E-Business" OR "Digital Change") ',
  ItemsPerQuery: 100,
  UpperLimit: 1_000,
  StartYear: 2024,
  EndYear: 2024,
};

export default Constants;
