const insertionColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);
    const fields = Object.keys(object).map((key,index) => {
        return key = `$${++index}`;
    })
    columnSet = keys.join(', ');

    return {
        columnSet,
        fields,
        values
    }
}
const updateColumnSet = (object, conditionObject) => {
    if (typeof object !== 'object' || typeof conditionObject !== 'object') {
      throw new Error('Invalid input');
    }
  
    const keys = Object.keys(object);
    const values = Object.values(object);
    const fields = Object.keys(object).map((key, index) => {
      return `${key}=$${++index}`;
    });
    columnSet = fields.join(', ');
  
    const conditionKeys = Object.keys(conditionObject);
    const conditionValues = Object.values(conditionObject);
    const conditionFields = conditionKeys.map((key, index) => {
      return `${key}=$${index + keys.length + 1}`;
    });
    const whereClause = `WHERE ${conditionFields.join(' AND ')}`;
  
    return {
      columnSet,
      values: [...values, ...conditionValues],
      whereClause
    }
  }

  const  insertionANDColumnSet = (object)=> {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map((key,index) => `${key} = $${++index}`).join(' AND ');

    return {
        columnSet,
        values
    }
}


module.exports = {insertionColumnSet,updateColumnSet,insertionANDColumnSet};