module.exports = {
  extends: ["@commitlint/config-conventional"],
  "scope-enum": [
    2,
    "always",
    [
      // only allow scopes listed here
    ]
  ],
  // https://conventional-changelog.github.io/commitlint/#/reference-rules?id=scope-case
  "scope-case": [2, "always", "pascal-case"]
};
