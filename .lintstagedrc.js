// See https://github.com/okonet/lint-staged#configuration
const { ESLint } = require("eslint");

const eslint = new ESLint({});

async function asyncFilter(arr, predicate) {
	return Promise.all(arr.map(predicate)).then((results) =>
		arr.filter((_v, index) => results[index])
	);
}

async function filter(prefix, files) {
	const filteredFiles = (
		await asyncFilter(
			files,
			async (file) =>
				!(prefix.startsWith("eslint") && (await eslint.isPathIgnored(file)))
		)
	)
		.map((filename) => `"${filename}"`)
		.join(" ");

	return filteredFiles.length
		? `${prefix} ${filteredFiles}`
		: "echo All files ignored";
}

module.exports = {
	"*.{js,jsm,ts,tsx,md,yml,yaml}": (files) =>
		filter("eslint --max-warnings=0", files),
	"openapi.{yml,yaml}": (files) => filter("openapi lint", files),
	".*ignore": (files) => filter("giismudge", files),
};
