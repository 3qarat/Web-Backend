import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import pool from "../../database/index.js";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.jwt]),
      secretOrKey: "jwt-secret-string",
    },
    async (jwtPayLoad, done) => {
      try {
        const sql = "select id, username, email, role from user where id = ?";
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

export const protectedRoute = passport.authenticate("jwt", {
  session: false,
});
