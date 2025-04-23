import { User } from 'src/app/users/entities/user.entity';
import { connectionSource } from '../datasource';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

config();

async function run() {
  await connectionSource.initialize();
  const repo = connectionSource.getRepository(User);

  const user = await repo.findOneBy({ email: process.env.USER_SEED_EMAIL });
  if (!user) {
    await repo.insert({
      id: uuidv4(),
      name: process.env.USER_SEED_NAME,
      email: process.env.USER_SEED_EMAIL,
      password: await bcrypt.hash(process.env.USER_SEED_PASSWORD, 10),
      phonenumber: process.env.USER_SEED_PHONENUMBER,
      role: 'superadmin',
    });

    console.log('Superadmin seeded!');
  } else {
    console.log('Superadmin already exists');
  }

  await connectionSource.destroy();
}

run().catch(console.error);
