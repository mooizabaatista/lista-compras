import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'


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
      } else {
        novaLista[key].qtd = 1;
      }
    }
    setListaCompras(novaLista);
  }

  // Editar valor do produto
  const handleEditaValor = (key, valor) => {
    const novaLista = [...listaCompras];
    if (isNaN(valor))
      valor = 0;
    novaLista[key].valor = valor;
    setListaCompras(novaLista);
    const valorTotal = novaLista[key].qtd * novaLista[key].valor
    setValor(valorTotal);
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

  const handleDoubleClick = (e, key) => {
    const novaLista = [...listaCompras];
    novaLista[key].qtd = 1;
    setListaCompras(novaLista);
  }


  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (nome === "" || qtd === "" || qtd === "0") {
      alert("Preencha os campos corretamente!")
      return;
    }

    const novoItem = {
      nome: nome,
      qtd: qtd,
      valor: valor,
      concluido: false
    }




    const novaLista = [...listaCompras, novoItem];
    setListaCompras(novaLista);

    setNome("");
    setQtd("");

    document.querySelector("#nome").value = '';
    document.querySelector("#qtd").value = '';
    document.querySelector("#nome").focus();
  }

  // Remove
  const handleRemove = (key) => {
    const novaLista = [...listaCompras];
    if (window.confirm("Deseja remover o produto?")) {
      novaLista.pop(novaLista[key])
    }
    setListaCompras(novaLista);
  }

  return (
    <>
      <div className="container-fluid">

        <div className="fixed-items-top">
          <div className="bg-dark">
            <div className="row">
              <div className="col-12">
                <header className="header text-light bg-dark py-2">
                  <h1 className="mx-3 my-1 fs-5"><i className="fal fa-shopping-cart fs-5 me-3 "></i> Lista de Compras </h1>
                </header>
              </div>
            </div>


            <div className="row my-2">
              <div className="col-12">
                <div className="total text-light py-2 text-center bg-success">
                  <h1 className="mx-3 my-1 fs-1">R$ {total.toFixed(2)}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12 col-xs-12 text-light ">
              <form className="form-items" onSubmit={(e) => { handleSubmit(e) }}>
                <input type="text" placeholder="Digite o nome do item..." className="form-control" id="nome" onChange={(e) => { setNome(e.target.value) }} autoComplete="off" />
                <input type="number" placeholder="Digite a quantidade..." className="form-control" id="qtd" onChange={(e) => { setQtd(e.target.value) }} autoComplete="off" />
                <input type="hidden" className="form-control" id="valor" value={valor} onChange={(e) => { setValor(e.target.value) }} />
                <button type="submit" className="btn btn-light ">Adicionar</button>
              </form>
            </div>
          </div>
        </div>



        <div className="table-responsive table-items">
          <table className="table text-center">
            <thead className="bg-dark text-light">
              <tr>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {
                listaCompras.map((item, key) => {
                  return (
                    <>
                      <tr>
                        <td className="nome-item">{item.nome}</td>
                        <td className="d-flex justify-content-center align-items-center item-qtd">
                          <i className="fal fa-minus  bg-primary p-2 rounded text-light" onClick={(e) => handleDiminuiQtd(key)}></i> &nbsp;
                          <div>
                            <span className="badge bg-secondary fs-5" onClick={(e) => { handleDoubleClick(e, key) }}>{item.qtd}</span>
                          </div>
                          &nbsp;<i className="fal fa-plus bg-primary p-2 rounded text-light" onClick={(e) => { handleAumentaQtd(key) }}></i>
                          &nbsp;<i class="fa fa-trash p-2 rounded bg-danger text-light" onClick={(e) => { handleRemove(key) }}></i>
                        </td>
                        <td>
                          <input
                            defaultValue={listaCompras[key].valor === 0 ? "" : listaCompras[key].valor}
                            type="text"
                            className="form-control text-center valor"
                            placeholder="Valor..."
                            onBlur={(e) => { handleEditaValor(key, parseFloat(e.target.value)) }}
                          />
                        </td>
                      </tr>
                    </>
                  )
                })
              }
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

export default App;

