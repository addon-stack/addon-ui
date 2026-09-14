import path from "node:path";
import {fileURLToPath} from "node:url";

export const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
export const fixtureRoot = path.join(repositoryRoot, "tests/fixtures/shadow-dom");
export const buildDirectory = (root, engine) => path.join(root, "dist", `shadow-ui-${engine}-mv3`);
