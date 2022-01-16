const { db } = require("../pgAdapter");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } = require("graphql");
const { CountryDetails, EducationDetails, UserCompleteDetails, CountryList } = require("./types");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    country: {
      // type: new GraphQLList(CountryDetails),
      type: CountryList,
      args: {
        size: {type: GraphQLString},
        index: {type: GraphQLString}
      },
      async resolve(parentValue, args) {
        let limit = args.size;
        let offset = (args.index - 1) * args.size;
        const query = `SELECT * from country where status = '01' ORDER BY country limit $1 offset $2`;
        const values = [limit, offset];
        return db
          .manyOrNone(query, values)
          .then(async res => {
            const query = `SELECT count(id) from country where status = '01'`
            let count = await db.manyOrNone(query).then(resp => resp);
            let result = {};
            result.data = res;
            result.total = count[0].count;
            return result
          })
          .catch(err => err);
      }
    },
    education: {
      type: new GraphQLList(EducationDetails),
      resolve(parentValue, args) {
        const query = `SELECT * from education where status = '01'`;
        return db
          .manyOrNone(query)
          .then(res => res)
          .catch(err => err);
      }
    },
    user_complete_details: {
      type: new GraphQLList(UserCompleteDetails),
      args: {
        username: { type: GraphQLString },
        nationality: { type: GraphQLString },
        education_qualification: { type: GraphQLString }
      },
      resolve(parentValue, args) {

        const query = `SELECT ud.username AS name, ud.email, ud.dob, ud.profile AS photo, c.country as nationality, e.education as education_qualification
        FROM user_details ud JOIN country c on c.id = ud.nationality
        JOIN education e on e.id = ud.education_qualification
        where ud.status = '01' and ud.username = $1
        and ud.nationality = $2 and 
        ud.education_qualification = $3`;
        const values = [args.username, args.nationality, args.education_qualification]
        return db
          .manyOrNone(query, values)
          .then(res => {
            console.log('res', res);
            for (let i = 0; i < res.length; i++) {
              let age = getAge(res[i].dob);
              res[i].age = age;
              console.log('res', res[i]);
            }
            return res
          })
          .catch(err => err);
      }


    }
  }
});

function getAge(dob) {
  console.log('dob', dob);
  const today = new Date();
  const bithdate = dob.substr(0, 2);
  const birthmonth = dob.substr(3, 2);
  const birthyear = dob.substr(6, 4);
  console.log('birthdate', bithdate, birthmonth, birthyear);
  var age = today.getFullYear() - birthyear;
  const month = today.getMonth() - birthmonth;
  if (month < 0 || (month === 0 && today.getDate() < bithdate)) {
    age--;
  }
  console.log('age', age);
  return age;
}

exports.query = RootQuery;