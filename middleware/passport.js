const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../model/User");

const passport = require("passport");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_JWT,
    },
    async (jwtPayload, done) => {
      const user = await User.findOne({ where: { id: jwtPayload.id } });

      if (user) return done(null, user);
    }
  )
);
