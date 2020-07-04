const isEmpty = (value) =>
    value === undefined ||
        value === null ||
    (value === "object" && Object.keys(value).isLength === 0) ||
    (value === "String" && value.trim().isLength === 0)

module.exports = isEmpty;
