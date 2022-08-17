module.exports = {
  extends: ["@commitlint/config-conventional"],
  "type-enum": [2, "always", ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]],
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
