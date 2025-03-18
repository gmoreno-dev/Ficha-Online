// script.js

// Função para exibir a prévia da imagem
document
  .getElementById("aparencia")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("preview");
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

// Atualiza o valor da sanidade conforme o slider
document.getElementById("sanidade").addEventListener("input", function () {
  document.getElementById("sanidade-valor").textContent = this.value + "%";
});

// Lógica para o modal de login/nova ficha
const loginModal = document.getElementById("login-modal");
const btnLogin = document.getElementById("btn-login");
const btnNova = document.getElementById("btn-nova");
const loginForm = document.getElementById("login-form");
const btnRealizarLogin = document.getElementById("btn-realizar-login");
const loginError = document.getElementById("login-error");

btnLogin.addEventListener("click", () => {
  loginForm.style.display = "block";
});

btnNova.addEventListener("click", () => {
  // Esconde o modal e mostra a ficha para criação de nova ficha
  loginModal.style.display = "none";
  document.getElementById("ficha-container").style.display = "block";
});

// Realizar login
btnRealizarLogin.addEventListener("click", () => {
  const login = document.getElementById("login-input").value.trim();
  const senha = document.getElementById("senha-input").value.trim();
  if (!login || !senha) {
    loginError.textContent = "Preencha login e senha.";
    return;
  }
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, senha }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        loginError.textContent = data.error;
      } else {
        // Preenche os campos com os dados da ficha para edição
        preencherFicha(data);
        loginModal.style.display = "none";
        document.getElementById("ficha-container").style.display = "block";
      }
    })
    .catch((err) => {
      console.error(err);
      loginError.textContent = "Erro ao realizar login.";
    });
});

// Função para preencher a ficha com os dados retornados do login
function preencherFicha(data) {
  document.getElementById("nome").value = data.nome || "";
  document.getElementById("destino").value = data.pontos_destino || "";
  document.getElementById("descricao").value = data.descricao || "";
  document.getElementById("conceito").value = data.conceito || "";
  document.getElementById("dificuldade-pessoal").value =
    data.dificuldade_pessoal || "";
  document.getElementById("dificuldade-relacional").value =
    data.dificuldade_relacional || "";
  document.getElementById("aspecto-principal").value =
    data.aspecto_principal || "";
  document.getElementById("aspecto-dificuldade").value =
    data.aspecto_dificuldade || "";
  document.getElementById("aspecto-adicional1").value =
    data.aspecto_adicional1 || "";
  document.getElementById("aspecto-adicional2").value =
    data.aspecto_adicional2 || "";
  document.getElementById("aspecto-adicional3").value =
    data.aspecto_adicional3 || "";

  document.getElementById("pericia-excepcional1").value =
    data.pericia_excepcional1 || "";
  document.getElementById("pericia-excepcional2").value =
    data.pericia_excepcional2 || "";
  document.getElementById("pericia-excepcional3").value =
    data.pericia_excepcional3 || "";

  document.getElementById("pericia-otimo1").value = data.pericia_otimo1 || "";
  document.getElementById("pericia-otimo2").value = data.pericia_otimo2 || "";
  document.getElementById("pericia-otimo3").value = data.pericia_otimo3 || "";

  document.getElementById("pericia-bom1").value = data.pericia_bom1 || "";
  document.getElementById("pericia-bom2").value = data.pericia_bom2 || "";
  document.getElementById("pericia-bom3").value = data.pericia_bom3 || "";

  document.getElementById("pericia-razoavel1").value =
    data.pericia_razoavel1 || "";
  document.getElementById("pericia-razoavel2").value =
    data.pericia_razoavel2 || "";
  document.getElementById("pericia-razoavel3").value =
    data.pericia_razoavel3 || "";

  document.getElementById("pericia-regular1").value =
    data.pericia_regular1 || "";
  document.getElementById("pericia-regular2").value =
    data.pericia_regular2 || "";
  document.getElementById("pericia-regular3").value =
    data.pericia_regular3 || "";

  document.getElementById("sanidade").value = data.sanidade || 50;
  document.getElementById("sanidade-valor").textContent =
    (data.sanidade || 50) + "%";

  document.getElementById("consequencia-leve").value =
    data.consequencia_leve || "";
  document.getElementById("consequencia-moderada").value =
    data.consequencia_moderada || "";
  document.getElementById("consequencia-grave").value =
    data.consequencia_grave || "";

  document.getElementById("historia").value = data.historia || "";
  document.getElementById("equipamentos").value = data.equipamentos || "";
  document.getElementById("contratos-entidades").value =
    data.contratos_entidades || "";
  document.getElementById("contratos-poderes").value =
    data.contratos_poderes || "";

  // Seleciona a habilidade especial, se houver
  if (data.habilidade_especial) {
    const radio = document.querySelector(
      `input[name="habilidade"][value="${data.habilidade_especial}"]`
    );
    if (radio) radio.checked = true;
  }

  // Guarde o id da ficha em um campo oculto (ou variável global) para usar na atualização
  document.getElementById("ficha-container").dataset.fichaId = data.id;
}

// Função para coletar os dados da ficha
function coletarDadosFicha() {
  return {
    id: document.getElementById("ficha-container").dataset.fichaId, // Pode ser undefined se nova
    nome: document.getElementById("nome").value.trim(),
    pontos_destino:
      parseInt(document.getElementById("destino").value.trim()) || 0,
    descricao: document.getElementById("descricao").value.trim(),
    conceito: document.getElementById("conceito").value.trim(),
    dificuldade_pessoal: document
      .getElementById("dificuldade-pessoal")
      .value.trim(),
    dificuldade_relacional: document
      .getElementById("dificuldade-relacional")
      .value.trim(),
    aspecto_principal: document
      .getElementById("aspecto-principal")
      .value.trim(),
    aspecto_dificuldade: document
      .getElementById("aspecto-dificuldade")
      .value.trim(),
    aspecto_adicional1: document
      .getElementById("aspecto-adicional1")
      .value.trim(),
    aspecto_adicional2: document
      .getElementById("aspecto-adicional2")
      .value.trim(),
    aspecto_adicional3: document
      .getElementById("aspecto-adicional3")
      .value.trim(),
    pericia_excepcional1: document
      .getElementById("pericia-excepcional1")
      .value.trim(),
    pericia_excepcional2: document
      .getElementById("pericia-excepcional2")
      .value.trim(),
    pericia_excepcional3: document
      .getElementById("pericia-excepcional3")
      .value.trim(),
    pericia_otimo1: document.getElementById("pericia-otimo1").value.trim(),
    pericia_otimo2: document.getElementById("pericia-otimo2").value.trim(),
    pericia_otimo3: document.getElementById("pericia-otimo3").value.trim(),
    pericia_bom1: document.getElementById("pericia-bom1").value.trim(),
    pericia_bom2: document.getElementById("pericia-bom2").value.trim(),
    pericia_bom3: document.getElementById("pericia-bom3").value.trim(),
    pericia_razoavel1: document
      .getElementById("pericia-razoavel1")
      .value.trim(),
    pericia_razoavel2: document
      .getElementById("pericia-razoavel2")
      .value.trim(),
    pericia_razoavel3: document
      .getElementById("pericia-razoavel3")
      .value.trim(),
    pericia_regular1: document.getElementById("pericia-regular1").value.trim(),
    pericia_regular2: document.getElementById("pericia-regular2").value.trim(),
    pericia_regular3: document.getElementById("pericia-regular3").value.trim(),
    sanidade: parseInt(document.getElementById("sanidade").value.trim()),
    consequencia_leve: document
      .getElementById("consequencia-leve")
      .value.trim(),
    consequencia_moderada: document
      .getElementById("consequencia-moderada")
      .value.trim(),
    consequencia_grave: document
      .getElementById("consequencia-grave")
      .value.trim(),
    historia: document.getElementById("historia").value.trim(),
    equipamentos: document.getElementById("equipamentos").value.trim(),
    contratos_entidades: document
      .getElementById("contratos-entidades")
      .value.trim(),
    contratos_poderes: document
      .getElementById("contratos-poderes")
      .value.trim(),
    habilidade_especial: document.querySelector(
      'input[name="habilidade"]:checked'
    )
      ? document.querySelector('input[name="habilidade"]:checked').value
      : "",
  };
}

// Prevenir múltiplos cliques no botão salvar
let salvarBloqueado = false;
const btnSalvar = document.getElementById("btn-salvar");

btnSalvar.addEventListener("click", () => {
  if (salvarBloqueado) return;
  salvarBloqueado = true;
  btnSalvar.textContent = "Salvando...";
  btnSalvar.disabled = true;

  const dados = coletarDadosFicha();
  fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(
        data.message +
          (data.login
            ? `\nSeu login: ${data.login}\nSua senha: ${data.senha}`
            : "")
      );
      btnSalvar.textContent = "Salvar Ficha";
      // Reativa o botão após 15 segundos
      setTimeout(() => {
        salvarBloqueado = false;
        btnSalvar.disabled = false;
      }, 15000);
    })
    .catch((err) => {
      console.error(err);
      alert("Erro ao salvar a ficha.");
      btnSalvar.textContent = "Salvar Ficha";
      setTimeout(() => {
        salvarBloqueado = false;
        btnSalvar.disabled = false;
      }, 15000);
    });
});

// Botão de reset (limpa os campos da ficha)
document.getElementById("btn-reset").addEventListener("click", () => {
  document
    .querySelectorAll('input[type="text"], textarea')
    .forEach((el) => (el.value = ""));
  document.getElementById("sanidade").value = 50;
  document.getElementById("sanidade-valor").textContent = "50%";
});
