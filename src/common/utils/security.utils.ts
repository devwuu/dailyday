import * as bcrypt from 'bcrypt';

export const encode = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const compare = async (law, encoded) => {
  return await bcrypt.compare(law, encoded);
};
