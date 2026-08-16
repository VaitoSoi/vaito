const Projects = [
    {
        "title": "TOEIC Writing Platform",
        "git": "https://git.vaito.dev/vaito/ai-toeic",
        "docs": undefined,
        "package": undefined,
        "rawReadme": "https://git.vaito.dev/vaito/ai-toeic/raw/branch/main/README.md"
    },
    {
        "title": "MineJS",
        "git": "https://git.vaito.dev/vaito/minejs",
        "docs": "https://minejs.vaito.dev",
        "package": "https://www.npmjs.com/package/@vaitosoi/minejs",
        "rawReadme": "https://git.vaito.dev/vaito/minejs/raw/branch/main/README.md"
    },
    {
        "title": "Dur Converter",
        "git": "https://git.vaito.dev/vaito/dur_convert",
        "docs": undefined,
        "package": "https://pypi.org/project/dur-converter/",
        "rawReadme": "https://git.vaito.dev/vaito/dur_convert/raw/branch/main/README.md"
    },
    {
        "title": "Dump SQLModel",
        "git": "https://git.vaito.dev/vaito/dump-sqlmodel",
        "docs": undefined,
        "package": "https://pypi.org/project/dump-sqlmodel/",
        "rawReadme": "https://git.vaito.dev/vaito/dump-sqlmodel/raw/branch/main/README.md"
    },
    {
        "title": "This site",
        "git": "https://git.vaito.dev/vaito/vaito",
        "docs": undefined,
        "package": undefined,
        "rawReadme": "https://git.vaito.dev/vaito/dur_convert/raw/branch/main/README.md"
    },
]

let currentInd = -1,
    isAnimating = false;

function init() {
    const sidebarItems = document.querySelectorAll("#projects .project-sidebar");
    sidebarItems.forEach((item, ind) => {
        item.addEventListener("click", () => {
            if (isAnimating || currentInd === ind) return;
            sidebarItems.forEach(el => el.classList.remove("selected"))
            item.classList.add("selected");
            selectProject(ind);
        })
    })
}

async function selectProject(ind) {
    console.log(ind)
    const container = document.getElementById("project-detail");

    if (ind == "null") {
        currentInd = -1;
        container.classList.add("exit-down");
        container.addEventListener("animationend", async () => {
            container.classList.remove("exit-down")
            container.innerHTML = `
            <div class="flex" style="height: 100%; width: 100%; font-size: large;">
                <div class="flex flex-col" style="margin: auto; align-items: center; gap: 10px;">
                    <h1 style="font-size: x-large">Nothing here right now :(</h1>
                    <p>Please choose the project on the sidebar</p>
                </div>
            </div>
            `
        }, { once: true });
        return;
    }

    const html = buildProjectDetail(ind);
    if (currentInd === -1) {
        currentInd = ind;
        const resolvedHtml = await html;
        container.innerHTML = resolvedHtml;
        container.classList.add("enter-from-top");
        container.addEventListener("animationend", () => {
            container.classList.remove("enter-from-top");
        }, { once: true })
        return;
    }
    const goingDown = ind > currentInd;
    currentInd = ind;

    // Exit animation
    container.classList.add(goingDown ? "exit-down" : "exit-up");
    container.addEventListener("animationend", async () => {
        container.classList.remove(goingDown ? "exit-down" : "exit-up")

        // Enter animation
        const resolvedHtml = await html;
        container.innerHTML = resolvedHtml;
        container.classList.add(goingDown ? "enter-from-top" : "enter-from-bottom");
        container.addEventListener("animationend", () => {
            container.classList.remove(goingDown ? "enter-from-top" : "enter-from-bottom");
        }, { once: true })
    }, { once: true })
}

async function buildProjectDetail(ind) {
    const project = Projects[ind];
    const res = await fetch(project.rawReadme)
    let content;
    if (res.status === 200)
        content = DOMPurify.sanitize(
            marked.parse(
                await res.text()
            )
        );
    else
        return `<p>Can't fetch the <a href="${url}">REAMDE</a> file :sad:</p>`

    return `
    <div class="flex flex-row" style="font-size: x-large; align-items: baseline; gap: 30px;">
        <h1 class="flex flex-row" style="font-size: 3rem; gap: 15px; align-items: center;">
            ${project.title}
        </h1>
        <div class="flex flex-row" style="align-items: center; gap: 20px">
            <a target="_blank" href="${project.git}">git</a>
            ${project.docs ? `<a target="_blank" href="${project.docs}">docs</a>` : ""}
            ${project.package ? `<a target="_blank" href="${project.package}">package</a>` : ""}
        </div>
    </div>
    <div class="flex flex-col readme" style="height: 100%; width: 100%; overflow-y: scroll; overflow-x: hidden; overflow-wrap: break-word; gap: 10px">${content}</div>
    `;
}