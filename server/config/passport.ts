import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as crypto from 'crypto';

import { getManager, Repository, OneToMany } from 'typeorm';
import { User } from '../entity/User';

const LocalStrategy = passportLocal.Strategy;
const userRepo: Repository<User> = getManager().getRepository(User);

/**
 * Serializes the user's id to be stored in the browser as a cookie.
 */
passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

/**
 * Deserializes the user object from the id stored in the browser's cookies.
 */
passport.deserializeUser(async (id, done) => {
  const user = await userRepo.findOne(id);
  done(null, user);
});

/**
 * Ensures that the passport middleware uses the Local strategy.
 */
passport.use(new LocalStrategy(async (username, password, done) => {
  let hash: string;
  const user: User = await userRepo.findOne({ 
    where: { 
      name: username.toLowerCase() 
    }
  });

  if(!user) {
    return done(
      undefined, 
      false, { 
        message: `User ${username} was not found.`
      }
    );
  }

  hash = hashPassword(password, user.salt);
  if(user.password === hash) {
    return done(undefined, user);
  }

  return done(
    undefined, 
    false, { 
      message: 'Invalid username or password.'
    }
  );
}));