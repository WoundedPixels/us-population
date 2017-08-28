// @flow

const arrayToMap = (items: [], keyName: string) => {
  const addByKey = (resultMap, item) => {
    if (!item.hasOwnProperty(keyName)) {
      throw new Error(`No property found for key: ${keyName}`);
    }

    resultMap[item[keyName]] = item;
    return resultMap;
  };

  return items.reduce(addByKey, {});
};

export { arrayToMap };
