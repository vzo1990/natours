class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  find() {
    const queryObj = { ...this.queryStr };

    const excludedParameters = ['limit', 'page', 'sort', 'fields'];
    excludedParameters.forEach((par) => delete queryObj[par]);

    let searchQueryStr = JSON.stringify(queryObj);
    searchQueryStr = searchQueryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(searchQueryStr));

    return this;
  }

  sort() {
    this.query = this.query.sort(
      this.queryStr.sort
        ? this.queryStr.sort.replaceAll(',', ' ')
        : '-createdAt',
    );

    return this;
  }

  selectFields() {
    this.query = this.query.select(
      this.queryStr.fields ? this.queryStr.fields.replaceAll(',', ' ') : '-__v',
    );

    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;

    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
