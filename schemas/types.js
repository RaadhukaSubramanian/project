const { GraphQLID } = require("graphql");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList } = graphql;


const UserDetails = new GraphQLObjectType({
  name: "UserDetails",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    dob: { type: GraphQLString},
    profile: { type: GraphQLString},
    nationality: { type: GraphQLString},
    education_qualification: { type: GraphQLString}
  }
});

const CountryDetails = new GraphQLObjectType({
  name: "CountryDetails",
  fields: {
    id: { type: GraphQLString },
    country: { type: GraphQLString }
  }
});

const CountryList = new GraphQLObjectType({
  name: "CountryList",
  fields: {
    data: { type: new GraphQLList(CountryDetails) },
    total: { type: GraphQLString }
  }
});


const EducationDetails = new GraphQLObjectType({
  name: "EducationDetails",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    education: { type: GraphQLString }
  }
});

const UserCompleteDetails = new GraphQLObjectType({
  name: "UserCompleteDetails",
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    dob: { type: GraphQLString},
    photo: { type: GraphQLString},
    country: { type: GraphQLString},
    education_qualification: { type: GraphQLString},
    age: { type: GraphQLString}
  }
});

exports.CountryDetails = CountryDetails;
exports.UserDetails = UserDetails;
exports.EducationDetails = EducationDetails;
exports.UserCompleteDetails = UserCompleteDetails;
exports.CountryList = CountryList;

