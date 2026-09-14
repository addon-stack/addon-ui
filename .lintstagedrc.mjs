const eslint = "eslint --fix --max-warnings 0 --no-warn-ignored --";

export default {
    "*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}": [eslint, "jest --bail --findRelatedTests --passWithNoTests --"],
    "*.{css,scss}": [eslint, "stylelint --fix --max-warnings 0 --allow-empty-input --"],
    "!(*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,css,scss})": eslint,
};
