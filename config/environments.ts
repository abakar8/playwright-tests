export const environments = {
  dev: {
    baseURL: 'https://dev.orangehrmlive.com',
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD
  },
  demo: {
    baseURL: 'http://localhost:8081/orangehrm-5.7/web/index.php/auth/login',
    username: 'Admin',
    password: 'Abandass-2024'
  }
};


export const getEnvironment = () => {
  const env = process.env.ENV || 'demo';
  return environments[env as keyof typeof environments];
};