const is = require("is_js");

function and(id, value) {
  return {
    "facets": {
      $elemMatch: {id, value},
      },
  };
}
function or(id, arr) {
  const $or = [];

  arr.forEach((value) => {
    $or.push(
      {"facets":
        {
          $elemMatch: {id, value},
        },
      }
    );
  });

  return {$or};
}
function between(id, obj) {
  const start = obj.start;
  const end = obj.end;

  if (start && end) {
    return {
      "facets": {
        $elemMatch: {
          id,
          value: {
            $gt: start - 1,
            $lt: end + 1,
          },
        },
      },
    };
  } else return null;
}

function query_builder(body) {
  const ids = Object.keys(body);
  const query = {};
  const $and = [];

  if (ids.length) {
    ids.forEach(function(id) {
      if (is.string(body[id]) && body[id].indexOf('{') !== -1) {
        body[id] = JSON.parse(body[id]);
      }
      if (is.string(body[id]) && body[id].indexOf(',') !== -1) {
        body[id] = body[id].split(',');
      }

      if (is.array(body[id])) {
        if (body[id].length) {
          $and.push(or(id, body[id]));
        }
      } else if (is.object(body[id])) {
        if (body[id].start && body[id].end) {
          $and.push(between(id, body[id]));
        }
      } else {
        $and.push(and(id, body[id]));
      }
    });
  };

  if ($and.length) query.$and = $and;

  return query;
}

module.exports = query_builder;
