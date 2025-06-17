import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["saper"] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.strictTypeChecked,

            // Custom
            stylistic.configs.recommended,
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,

            // Custom
            "@stylistic": stylistic,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],

            // Custom
            "eqeqeq": ["error", "always"],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/method-signature-style": ["error", "property"],
            "@typescript-eslint/naming-convention": ["error",
                {
                    selector: "variableLike",
                    format: ["camelCase"],
                },
                {
                    selector: "variable",
                    types: ["function"],
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
            ],
            "@typescript-eslint/prefer-nullish-coalescing": ["error", {
                allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
                ignoreBooleanCoercion: false,
                ignoreConditionalTests: false,
                ignoreIfStatements: false,
                ignoreMixedLogicalExpressions: false,
                ignorePrimitives: {
                    bigint: false,
                    boolean: false,
                    number: false,
                    string: false,
                },
                ignoreTernaryTests: false,
            }],
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/strict-boolean-expressions": ["error", {
                allowAny: false,
                allowNullableBoolean: false,
                allowNullableEnum: false,
                allowNullableNumber: false,
                allowNullableObject: false,
                allowNullableString: false,
                allowNumber: false,
                allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
                allowString: false,
            }],
            "@stylistic/arrow-parens": ["error", "as-needed"],
            "@stylistic/brace-style": ["error", "1tbs"],
            "@stylistic/comma-dangle": ["error", {
                arrays: "always-multiline",
                dynamicImports: "always-multiline",
                exports: "always-multiline",
                functions: "only-multiline",
                importAttributes: "always-multiline",
                imports: "always-multiline",
                objects: "always-multiline",
                tuples: "always-multiline",
            }],
            "@stylistic/indent": ["error", 4],
            "@stylistic/max-len": ["error", {
                code: 100,
            }],
            "@stylistic/member-delimiter-style": ["error", {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                "singleline": {
                    delimiter: "semi",
                    requireLast: false,
                },
            }],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/jsx-indent-props": ["error", 4],
            "@stylistic/jsx-one-expression-per-line": ["error", {
                allow: "non-jsx",
            }],
        },
    },
);
