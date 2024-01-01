const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID:'554589267381-7oa388a7d0ed2buhnka7g8u6edpc1k34.apps.googleusercontent.com',
			clientSecret:'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',
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});