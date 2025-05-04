const checkMongoIdEquality = (id1, id2) => {
  const isEqualId = id1.equals(id2);
  return isEqualId; //boolean value
};

export default checkMongoIdEquality;
