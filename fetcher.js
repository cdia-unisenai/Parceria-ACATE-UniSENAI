// Configurações da Parceria
const REPO_OWNER = 'seu-usuario';
const REPO_NAME = 'nome-do-repositorio';
const PR_NUMBER = 1; // O ID do Pull Request criado previamente
const GITHUB_TOKEN = 'ghp_seu_token_aqui'; // CUIDADO: Use apenas em ambiente controlado

async function checkPRStatus() {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${PR_NUMBER}`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const pr = await response.json();

    if (pr.merged) {
        exibirSucesso(pr.merged_at);
        return true;
    }
    return false;
}

async function realizarAssinatura() {
    const btn = document.getElementById('btn-assinar');
    btn.disabled = true;
    btn.innerText = "Processando Assinatura...";

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls/${PR_NUMBER}/merge`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                commit_title: "Firmando Parceria Estratégica",
                commit_message: "Assinatura digital via Pull Request aceito em evento oficial."
            })
        });

        if (response.ok) {
            console.log("Merge realizado com sucesso!");
            // A função de polling detectará a mudança e atualizará a UI
        }
    } catch (error) {
        console.error("Erro ao assinar:", error);
        alert("Falha na conexão com o GitHub.");
    }
}

// Loop de verificação (Polling) a cada 3 segundos
const interval = setInterval(async () => {
    const isMerged = await checkPRStatus();
    if (isMerged) clearInterval(interval);
}, 3000);