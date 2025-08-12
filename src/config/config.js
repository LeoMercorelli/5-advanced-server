import 'dotenv/config';

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name} en .env`);
  return v;
};

export const config = {
  port: Number(process.env.PORT) || 8080,
  mongoUrl: required('MONGODB_URI'),
  jwt: {
    secret: required('JWT_SECRET'),
    expires: process.env.JWT_EXPIRES || '1d',
  },
};
