const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
  type: String,
  validate: {
    validator(value) {
      if (!value) return true;  // Allow empty or undefined values
      return validator.isURL(value);
    },
    message: "You must enter a valid URL",
  },
},
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Wrong email or password",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre("save", function hashPassword(next) {
  if (!this.isModified("password")) return next();

  return bcrypt
    .hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password!"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password!"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
