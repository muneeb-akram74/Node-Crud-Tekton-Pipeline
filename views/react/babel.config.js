module.exports = function (api) {
  api.cache(true);

  const presets = [ 
    "@babel/preset-env",
    "@babel/preset-react"
  ];
  const plugins = [ 
//    "babel-plugin-transform-es2015-modules-amd",
    "@babel/plugin-proposal-class-properties"
  ];

  return {
    presets,
    plugins,
//    "env": {
//      "test": {
//        "plugins": ["@babel/plugin-transform-modules-commonjs"]
//      }
//    }
  };
}
