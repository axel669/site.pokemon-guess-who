import { html, render } from "https://esm.sh/htm/preact"
import { signal, computed, effect } from "https://esm.sh/@preact/signals"
import update from "https://esm.sh/@axel669/immutable-update"

import pokemon from "./data/pokemon-urls.js"

const theme = signal(
    localStorage.theme ?? "dark"
)
const menuToggle = { current: null }

effect(
    () => {
        localStorage.theme = theme.value
        document.body.setAttribute(
            "ws-x",
            `@theme:${theme.value} @app`
        )
        if (menuToggle.current !== null) {
            menuToggle.current.checked = false
        }
    }
)

const pickMon = (mon) => ({
    name: mon[1],
    urlName: mon[0],
    active: true,
    index: pokemon.indexOf(mon)
})
const rand = (n) => Math.floor(Math.random() * n)
const generateBoard = () => {
    const mons = [...pokemon]
    return Array.from(
        { length: 24 },
        () => {
            const i = rand(mons.length)
            const mon = mons[i]
            mons.splice(i, 1)
            return pickMon(mon)
        }
    )
}

const hash = location.hash.slice(1)

const board = signal(
    hash === ""
    ? null
    : Array.from(
        { length: 24 },
        (_, i) => {
            const index = parseInt(
                hash.slice(i * 3, (i + 1) * 3),
                16
            )
            return pickMon(pokemon[index])
        }
    )
)
const preview = signal(null)
const selected = signal(false)
const gameText = computed(
    () => {
        if (board.value === null) {
            return null
        }
        if (selected.value === false) {
            return "Choose that Pokémon!"
        }
        return "Toggle the Pokémon until you can make a guess"
    }
)

const gameURL = computed(
    () => {
        if (board.value === null) {
            return ""
        }
        return board.value.map(
            mon => mon.index.toString(16).padStart(3, "0")
        ).join("")
    }
)

effect(
    () => {
        location.hash = gameURL.value
    }
)

const coreButtonX = {
    "tf.o": "bottom center",
    tr: "opacity 200ms linear, transform 200ms linear",
    $outline: true,
    "r.b": "0px",
    "b.w": "3px",
}
const buttonx = (mon) => {
    if (mon.active === true) {
        return ws.x({
            ...coreButtonX,
            o: 1,
            tf: "rotateX(10deg)",
        })
    }
    return ws.x({
        ...coreButtonX,
        o: 0.3,
        tf: "rotateX(75deg)",
    })
}

const Board = () => {
    if (board.value === null) {
        return null
    }

    const select = (mon) => {
        console.log("wat")
        if (selected.value === false) {
            preview.value = mon
            return
        }
        const index = board.value.indexOf(mon)
        board.value = update(
            board.value,
            { [`${index}.active.$set`]: mon.active === false}
        )
    }

    return html`
        <ws-grid ws-x="[gr.cols repeat(6, 1fr)] [sm|gr.cols repeat(3, 1fr)] [p 0x]">
            ${board.value.map(
                (mon) => html`
                    <div ws-x="[grid] [tf.p 300px]">
                        <button ws-x="${buttonx(mon)}"
                        key=${mon.name} data-mon=${mon.name}
                        onClick=${() => select(mon)}>
                            <ws-flex ws-x="[fl.cross center]">
                                <img src="image/${mon.urlName}.avif" ws-x="[h 80px]" />
                                <div>${mon.name}<//>
                            <//>
                        <//>
                    <//>
                `
            )}
        <//>
    `
}

const GameControls = () => {
    const select = () => selected.value = true

    if (board.value === null) {
        return null
    }

    return html`
        <ws-flex ws-x="[b.t 1px solid @secondary]" slot="footer" class="">
            ${selected.value && html`
                <div ws-x="[t.a center]">Your Pokémon<//>
            `}
            ${preview.value && html`
                <ws-flex ws-x="[fl.cross center]">
                    <img src="image/${preview.value.urlName}.avif" ws-x="[h 70px]" />
                    <div>${preview.value.name}<//>
                <//>
            `}
            ${selected.value === false && html`
                <button ws-x="[$fill] [$color @secondary]" onClick=${select}
                disabled=${preview.value === null}>
                    Start Game
                <//>
            `}
        <//>
    `
}

const Menu = () => {
    return html`
        <label slot="menu" ws-x="@button [$flat]" for="menu">
            <ws-icon class="ti-menu-2" />
        <//>
        <input type="checkbox" ws-x="[hide]" id="menu" ref=${menuToggle} />
        <ws-modal>
            <label for="menu"><//>
            <ws-paper ws-x="@menu [r 0px] [w 175px]">
                <ws-flex slot="content">
                    <ws-titlebar ws-x="[$color @primary]">
                        <span ws-x="[$title]" slot="title">
                            Theme
                        <//>
                    <//>
                    <button ws-x="[$outline] [$color @primary]"
                    onClick=${() => theme.value = "light"}>
                        Light
                    <//>
                    <button ws-x="[$outline] [$color @primary]"
                    onClick=${() => theme.value = "dark"}>
                        Dark
                    <//>
                    <button ws-x="[$outline] [$color @primary]"
                    onClick=${() => theme.value = "tron"}>
                        Tron
                    <//>
                <//>
            <//>
        <//>
    `
}

const App = () => {
    const newGame = () => {
        board.value = generateBoard()
        preview.value = null
        selected.value = false
    }
    const reset = () => {
        board.value = null
        preview.value = null
        selected.value = false
    }

    return html`
        <ws-screen>
            <ws-paper ws-x="[r 0px]">
                <ws-flex slot="header" ws-x="[p 0x]">
                    <ws-titlebar ws-x="[$fill] [$color @primary]">
                        <div ws-x="[$title]" slot="title">
                            Pokémon Guess Who
                        <//>

                        <button slot="action" ws-x="[$flat]" onClick=${reset}>
                            Reset
                        <//>

                        <${Menu} />
                    <//>

                    <button ws-x="[$fill] [$color @primary] [m.r 4px] [m.l 4px]"
                    onClick=${newGame}>
                        New Game
                    <//>

                    <div ws-x="[t.a center] [hide:empty]">
                        ${gameText.value}
                    <//>
                <//>

                <ws-flex slot="content" ws-x="[over auto]">
                    <${Board} />
                <//>

                <${GameControls} />
            <//>
        <//>
    `
}

render(html`<${App} />`, document.body)
