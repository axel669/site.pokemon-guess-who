import fs from "fs/promises"

import pokemon from "./pokemon.mjs"

// const mapped = pokemon.map(
//     name => ({
//         name,
//         urlName: name.toLowerCase()
//             .replaceAll(" ", "-")
//             .replaceAll("♀", "-f")
//             .replaceAll("♂", "-m")
//             .replace(/[^a-z\- ]/g, "")
//     })
// )
// await fs.writeFile(
//     "scrape/pokemon-urls.js",
//     `export default ${JSON.stringify(mapped)}`
// )

for (const name of pokemon) {
    const urlName =
        name.toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("♀", "-f")
        .replaceAll("♂", "-m")
        .replace(/[^a-z\- ]/g, "")
    console.log("downloading", name, urlName)
    const url = `https://img.pokemondb.net/sprites/scarlet-violet/icon/${urlName}.avif`
    const res = await fetch(url)
    await fs.writeFile(
        `image/${urlName}.png`,
        res.body
    )
}
