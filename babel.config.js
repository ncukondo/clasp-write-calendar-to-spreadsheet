module.exports = function (api) {
  api.cache(true);

  const presets = [
    "babel-preset-gas",
    "@babel/preset-typescript", ["@babel/preset-env", {
      "targets": {
        "ie": "8"
      },
      "useBuiltIns": "usage",
      "modules": "commonjs"
    }]
  ];
  const plugins = [
    "@babel/plugin-transform-property-literals",
    "@babel/plugin-transform-member-expression-literals",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-transform-runtime",
    "array-includes"
  ];

  return {
    presets,
    plugins
  };
}
