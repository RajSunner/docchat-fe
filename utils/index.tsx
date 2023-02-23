import { faker } from '@faker-js/faker';

export const generateBotMessage = () => {
  return {
    message: faker.lorem.sentence(),
    user: false
  };
};
