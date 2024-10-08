const format = require("pg-format")
const db = require("../connection")

// exports.checkExists = (comment, article_id, value) => {
//   const queryStr = format("SELECT * FROM %I WHERE %I = $1;", comment, article_id);
//   console.log(queryStr)
//   return db.query(queryStr, [value])
//   .then(({ rows }) => {
//      if (rows.length === 0) {
//     // resource does NOT exist
//     return Promise.reject({ status: 404, msg: "Sorry, I couldn't find that article!" });
//   }
//   })
 
// };

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};
