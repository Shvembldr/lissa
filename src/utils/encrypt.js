import bcrypt from 'bcrypt';

const encrypt = {
  hash: pass => bcrypt.hash(pass, 12),
  verify: (pass, hash) => bcrypt.compare(pass, hash)
};

export { encrypt };
