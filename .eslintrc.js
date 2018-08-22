module.exports = {
    "env": {
        "node": true,
        "es6": true,
        "mocha": true
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "keyword-spacing": [
            "error"
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "no-console": "off"
    }
};