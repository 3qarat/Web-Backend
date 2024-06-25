import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../../database/index.js";
import config from "../../../config/config.js";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.jwt]),
      secretOrKey: "jwt-secret-string",
    },
    async (jwtPayLoad, done) => {
      try {
        const sql = "select id, username, email from user where id = ?";
        const [rows] = await pool.query(sql, [jwtPayLoad.id]);

        if (rows.length === 0) {
          done(null, false);
        }

        const user = rows[0];
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8181/api/v1/user/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const [rows] = await pool.query("select * from user where google_id = ?", [
          profile.id,
        ]);
        let user = rows[0];

        if (!user) {
          const result = await pool.query(
            "insert into user (google_id, username, email, profile_picture) values (?,?,?,?)",
            [
              profile.id,
              profile.displayName,
              profile.emails[0].value,
              profile.photos[0].value,
            ]
          );
          user = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            profile_picture: profile.photos[0].value,
          };

          }
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query(
      "select id, username, email, profile_picture from user where id = ?",
      [id]
    );
    done(null, rows[0]);
  } catch (err) {
    done(err, false);
  }
});

export default passport;
