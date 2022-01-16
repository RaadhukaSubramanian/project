const graphql = require("graphql");
const db = require("../pgAdapter").db;
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLNonNull } = graphql;
const { CountryDetails, UserDetails, EducationDetails } = require("./types");

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {
    addCountry: {
      type: CountryDetails,
      args: {
        country: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO country(country) VALUES ($1) returning id,country`;
        const values = [
          args.country
        ];
        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      }
    },
    addEducation: {
      type: EducationDetails,
      args: {
        education: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO education(education) VALUES ($1) returning id,education`;
        const values = [
          args.education
        ];
        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      }
    },
    addUser: {
      type: UserDetails,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        dob: { type: GraphQLString },
        profile: { type: GraphQLString },
        nationality: { type: GraphQLString },
        education_qualification: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        let email_validate = false;
        let profile_validate = false;
        if (args.email) {
          email_validate = validateEmail(args.email);
          console.log('emial_validate', email_validate);
        }
        else
          email_validate = true;
        if (args.profile) {
          profile_validate = validateProfile(args.profile);
          console.log('profile validate', profile_validate);
        }
        else
          profile_validate = true;

        if (email_validate == true && profile_validate == true) {
          let create_ts = new Date();
          console.log('Date', create_ts);
          const query = `INSERT INTO user_details (username,email,dob,profile,nationality,education_qualification,created_ts) VALUES ($1,$2,$3,$4,$5,$6,$7) returning username,email,dob,nationality,education_qualification`;
          const values = [
            args.username,
            args.email,
            args.dob,
            args.profile,
            args.nationality,
            args.education_qualification,
            create_ts
          ];
          return db
            .one(query, values)
            .then(res => res)
            .catch(err => err);
        }
        else {
          console.log('Validation failed');
          return null
        }
      }
    },
    updateUser: {
      type: UserDetails,
      args: {
        id: { type: GraphQLString, },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        dob: { type: GraphQLString },
        profile: { type: GraphQLString },
        nationality: { type: GraphQLString },
        education_qualification: { type: GraphQLString }
      },
      resolve(parentValue, args) {

        let email_validate = false;
        let profile_validate = false;
        if (args.email) {
          email_validate = validateEmail(args.email);
          console.log('emial_validate', email_validate);
        }
        else
          email_validate = true;
        if (args.profile) {
          profile_validate = validateProfile(args.profile);
          console.log('profile validate', profile_validate);
        }
        else
          profile_validate = true;

        if (email_validate == true && profile_validate == true) {
          let update_ts = new Date();
          const query = `UPDATE user_details SET username=$1, email=$2, dob=$3, profile=$4, nationality=$5, education_qualification=$6, updated_ts = $8 where id = $7 returning username,email,dob,nationality,education_qualification`;
          const values = [
            args.username,
            args.email,
            args.dob,
            args.profile,
            args.nationality,
            args.education_qualification,
            args.id,
            update_ts
          ];
          return db
            .one(query, values)
            .then(res => res)
            .catch(err => err);
        }
        else {
          console.log('Validation failed');
        }
      }
    },
    deleteUser: {
      type: UserDetails,
      args: {
        id: { type: GraphQLString},
      },
      resolve(parentValue, args) {
        let updated_ts = new Date();
          const query = `UPDATE user_details SET status='00', updated_ts = $2 where id = $1 returning username`;
          const values = [
            args.id,
            updated_ts
          ];
          return db
            .one(query, values)
            .then(res => res)
            .catch(err => err);
      }
    },

  }
});

function validateEmail(email) {
  let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let data = String(email).toLowerCase();
  if (data.match(regexEmail))
    return true;
  else
    return false;
}

function validateProfile(profile) {
  let regexProfile = /^[A-Za-z]{3,}\.(?:jpe?g|png|gif)$/;
  let data = String(profile).toLowerCase();
  if (data.match(regexProfile))
    return true;
  else
    return false;
}

exports.mutation = RootMutation;