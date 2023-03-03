import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'

// import app css
import './App.css';

function App() {
  // Lista de Compras
  const [listaCompras, setListaCompras] = useState([]);

  // Total
  const [total, setTotal] = useState(0);

  // Adicionar item
  const [nome, setNome] = useState('');
  const [qtd, setQtd] = useState('');
  const [valor, setValor] = useState(0.0);

  useEffect(() => {
    const listaComprasStorage = localStorage.getItem("@lista")
    if (listaComprasStorage)
      setListaCompras(JSON.parse(listaComprasStorage))
  }, [])

  useEffect(() => {
    let valorTotal = 0
    listaCompras.map((item) => {
      valorTotal += item.qtd * item.valor;
    });
    setTotal(parseFloat(valorTotal));

    if (listaCompras.length > 0)
      localStorage.setItem("@lista", JSON.stringify(listaCompras))
    else
      localStorage.removeItem("@lista");
  }, [listaCompras])


  // Aumentar a quantidade do item
  const handleAumentaQtd = (key) => {
    const novaLista = [...listaCompras];
    novaLista[key].qtd++;
    setListaCompras(novaLista);
  }

  // Diminuir a quantidade do item
  const handleDiminuiQtd = (key) => {
    const novaLista = [...listaCompras];
    novaLista[key].qtd--;
    if (novaLista[key].qtd < 0)
      novaLista[key].qtd = 0;

    if (novaLista[key].qtd === 0) {
      if (window.confirm("Deseja remover o produto?")) {
        novaLista.pop(novaLista[key])
      }
    }

    setListaCompras(novaLista);
  }

  // Editar valor do produto
  const handleEditaValor = (key, valor) => {
    const novaLista = [...listaCompras]; // Cria uma cópia da lista
    novaLista[key].valor = valor; // Atualiza o valor do item correto na lista
    setListaCompras(novaLista);
  }

  // Risca o item selecionado
  const handleRiscaElemento = (key) => {
    const novaLista = [...listaCompras];
    const item = novaLista[key];

    if (item.concluido === false) {
      item.concluido = true;
      item.classe = "item-lista-riscado"
    }
    else {
      item.concluido = false;
      item.classe = "item-lista"
    }

    setListaCompras(novaLista);
  }

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const novoItem = {
      nome: nome,
      qtd: qtd,
      valor: valor,
      concluido: false
    }

    const novaLista = [...listaCompras, novoItem];
    setListaCompras(novaLista);

    document.querySelector("#nome").value = '';
    document.querySelector("#qtd").value = '';

    document.querySelector("#nome").focus();
  }

  return (
    <>
      <div>
        <header className="header text-light">
          <h1 className="fs-3 mx-3 my-2"><i className="fal fa-shopping-cart "></i> Lista de Compras </h1>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-12 my-3">
              <h3 className="card-title mb-4 text-dark"><span className="badge bg-success total">R$: {parseFloat(total.toFixed(2))}</span></h3>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6 text-center">
              <div className="card mb-5">
                <div className="card-body">
                  {
                    listaCompras.map((item, key) => {
                      return (
                        <p key={key} className="item-lista" >
                          <span className={item.classe} onClick={(e) => { handleRiscaElemento(key) }}>{item.nome} </span>
                          <i className="fal fa-minus ms-3 bg-primary p-1 rounded text-light" onClick={(e) => handleDiminuiQtd(key)}></i> &nbsp; <span class="badge bg-secondary">{item.qtd < 10 ? `0${item.qtd}` : item.qtd}</span> &nbsp;<i className="fal fa-plus me-3 bg-primary p-1 rounded text-light" onClick={(e) => { handleAumentaQtd(key) }}></i>
                          <span className="fs-5">
                            <input
                              defaultValue={listaCompras[key].valor === 0 ? "" : listaCompras[key].valor}
                              type="text"
                              className="form-control text-center valor"
                              placeholder="Valor"
                              onBlur={(e) => { handleEditaValor(key, parseFloat(e.target.value)) }}
                            />
                          </span>
                          <hr />
                        </p>

                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">

                  <form onSubmit={(e) => { handleSubmit(e) }}>
                    <div className="mb-3">
                      <label className="form-label">Nome</label>
                      <input type="text" className="form-control" id="nome" onChange={(e) => { setNome(e.target.value) }} autoComplete="off" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantidade</label>
                      <input type="number" className="form-control" id="qtd" onChange={(e) => { setQtd(e.target.value) }} autoComplete="off" />
                    </div>
                    <div className="mb-3">
                      <input type="hidden" className="form-control" id="valor" value={valor} onChange={(e) => { setValor(e.target.value) }} />
                    </div>
                    <button type="submit" className="btn btn-primary">Adicionar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

