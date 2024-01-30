import fs from "node:fs/promises"
import path from "node:path"

import pokemon from "./pokemonurls.mjs"

const mapped = pokemon.reduce(
    (list, current) => {
        if (list.find(mon => mon[1] === current[1]) !== undefined) {
            return list
        }
        list.push(current)
        return list
    },
    []
)

// for (const [url, name] of mapped) {
//     console.log("downloading", name)
//     const urlName = path.basename(url, path.extname(url))
//     const response = await fetch(url)
//     await fs.writeFile(`site/image/${urlName}.avif`, response.body)
// }

await fs.writeFile(
    "site/data/pokemon-urls.js",
    `export default ${JSON.stringify(
        mapped.map(data => [path.basename(data[0], path.extname(data[0])), data[1]])
    )}`
)
