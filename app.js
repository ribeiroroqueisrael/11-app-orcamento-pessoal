class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados() {
        for (let i in this) {
            if ((this[i] === undefined) || (this[i] === null) || (this[i] === '')) {
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');
        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(despesa) {
        let id = this.getProximoId();
        localStorage.setItem('id', id);
        localStorage.setItem(id, JSON.stringify(despesa));
    }

    recuperarTodosRegistros() {
        let id = localStorage.getItem('id');
        let despesas = [];

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));

            if (despesa === null) {
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesas = this.recuperarTodosRegistros();

        if (despesa.ano !== '') despesas = despesas.filter(d => d.ano == despesa.ano);
        if (despesa.mes !== '') despesas = despesas.filter(d => d.mes == despesa.mes);
        if (despesa.dia !== '') despesas = despesas.filter(d => d.dia == despesa.dia);
        if (despesa.tipo !== '') despesas = despesas.filter(d => d.tipo == despesa.tipo);
        if (despesa.descricao !== '') despesas = despesas.filter(d => d.descricao == despesa.descricao);
        if (despesa.valor !== '') despesas = despesas.filter(d => d.valor == despesa.valor);

        return despesas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }

}

const bd = new Bd();

function cadastrarDespesa() {

    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    if (despesa.validarDados()) {
        document.getElementById('modalHeader').className = 'modal-header text-success';
        document.getElementById('modalTitle').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modalBody').innerHTML = 'Despesa foi cadastrada com sucesso!';
        document.getElementById('modalButton').className = 'btn btn-secondary btn-success';
        document.getElementById('modalButton').innerHTML = 'Voltar';

        $('#modalRegistraDespesa').modal();
        bd.gravar(despesa);

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';

    } else {
        document.getElementById('modalHeader').className = 'modal-header text-danger';
        document.getElementById('modalTitle').innerHTML = 'Erro ao gravar dados';
        document.getElementById('modalBody').innerHTML = 'Existem campos obrigatórios que não foram preenchidos.';
        document.getElementById('modalButton').className = 'btn btn-secondary btn-danger';
        document.getElementById('modalButton').innerHTML = 'Voltar e corrigir';

        $('#modalRegistraDespesa').modal();
    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    console.log(despesas.length);

    if (despesas.length === 0) {
        despesas = bd.recuperarTodosRegistros();
    }


    let tBody = document.getElementById('tBody');
    tBody.innerHTML = '';


    despesas.forEach((despesa) => {

        let tr = tBody.insertRow();
        let tdData = tr.insertCell(0);
        let tdTipo = tr.insertCell(1);
        let tdDescricao = tr.insertCell(2);
        let tdValor = tr.insertCell(3);
        let tdButton = tr.insertCell(4);
        let botaoExcluir = document.createElement('button');

        tdData.innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`;
        switch (despesa.tipo) {
            case '1': despesa.tipo = 'Alimentação';
                break;
            case '2': despesa.tipo = 'Educação';
                break;
            case '3': despesa.tipo = 'Lazer';
                break;
            case '4': despesa.tipo = 'Saúde';
                break;
            case '5': despesa.tipo = 'Transporte';
                break;
        }
        tdTipo.innerHTML = despesa.tipo;
        tdDescricao.innerHTML = despesa.descricao;
        tdValor.innerHTML = `R$ ${despesa.valor}`;

        botaoExcluir.className = 'btn btn-danger';
        botaoExcluir.innerHTML = '<i class="fas fa-trash-alt"></i>';
        botaoExcluir.id = `idDespesa-${despesa.id}`;
        botaoExcluir.onclick = function () {
            let id = this.id.replace('idDespesa-', '');
            bd.remover(id);
            window.location.reload();
        }
        tdButton.append(botaoExcluir);
    });

    console.log();
}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    carregaListaDespesas(despesas, true);
}