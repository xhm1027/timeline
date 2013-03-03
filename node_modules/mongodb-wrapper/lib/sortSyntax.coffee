
module.exports = (naturalMongoSyntax) ->

  sort = []
  for field, orderNum in naturalMongoSyntax
    sort.push [field, orderNum]

  return sort
