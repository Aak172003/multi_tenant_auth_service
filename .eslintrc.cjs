/* eslint-env node */
module.exports = {
    extends: [
        // This is recommended rules
        "eslint:recommended",

        // This is typescript rules which is recommended
        // "plugin:@typescript-eslint/recommended",

        "plugin:@typescript-eslint/recommended-type-checked",

        // Linters and Prettiers
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    // refer to tsconfig file , for types information
    parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        // __dirname -> this means current folder
    },
    root: true,
    rules: {
        // if console give error
        // "no-console": "error",

        "dot-notation": "error",
    },
};
