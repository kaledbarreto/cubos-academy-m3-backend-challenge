const conexao = require('../conexao');

const listarProdutos = async (req, res) => {
  const { usuario } = req;

  try {
    const produtos = await conexao.query('select * from produtos where usuario_id = $1', [usuario.id]);

    return res.status(200).json(produtos.rows);
  } catch (error) {
    return res.status(401).json({ mensagem: error.message });
  }
}

const detalharProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const produto = await conexao.query('select * from produtos where usuario_id = $1 and id = $2', [usuario.id, id]);

    if (produto.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possivel encontrar o produto solicitado.' });
    }

    return res.status(200).json(produto.rows[0]);
  } catch (error) {
    return res.status(401).json({ mensagem: error.message });
  }
}

const cadastrarProduto = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;

  if (!nome) {
    return res.status(404).json({ mensagem: 'O campo nome é obrigatório' });
  }

  if (!quantidade) {
    return res.status(404).json({ mensagem: 'O campo quantidade é obrigatório' });
  }

  if (!categoria) {
    return res.status(404).json({ mensagem: 'O campo categoria é obrigatório' });
  }

  if (!preco) {
    return res.status(404).json({ mensagem: 'O campo preco é obrigatório' });
  }

  if (!descricao) {
    return res.status(404).json({ mensagem: 'O campo descricao é obrigatório' });
  }

  if (!imagem) {
    return res.status(404).json({ mensagem: 'O campo imagem é obrigatório' });
  }

  try {
    const queryProduto = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
    const produto = await conexao.query(queryProduto, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem]);

    if (produto.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível cadastrar o produto' });
    }

    return res.status(200).json({ mensagem: 'O produto foi cadastrado com sucesso.' });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const atualizarProduto = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;
  const { id } = req.params;

  if (!nome) {
    return res.status(404).json({ mensagem: 'O campo nome é obrigatório' });
  }

  if (!quantidade) {
    return res.status(404).json({ mensagem: 'O campo quantidade é obrigatório' });
  }

  if (!preco) {
    return res.status(404).json({ mensagem: 'O campo preco é obrigatório' });
  }

  if (!descricao) {
    return res.status(404).json({ mensagem: 'O campo descricao é obrigatório' });
  }

  try {
    const queryProdutoExistente = 'select * from produtos where id = $1 and usuario_id = $2';
    const produtoExistente = await conexao.query(queryProdutoExistente, [id, usuario.id]);

    if (produtoExistente.rowCount === 0) {
      return res.status(404).json({ mensagem: 'O produto não foi encontrado' });
    }

    const queryProduto = 'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8';
    const produto = await conexao.query(queryProduto, [nome, quantidade, categoria, preco, descricao, imagem, id, usuario.id]);

    if (produto.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível atualizar o produto' });
    }

    return res.status(200).json({ mensagem: 'O produto foi atualizado com sucesso.' });
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const excluirProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const queryProduto = 'select * from produtos where id = $1 and usuario_id = $2';
    const produto = await conexao.query(queryProduto, [id, usuario.id]);

    if (produto.rowCount === 0) {
      return res.status(404).json({ mensagem: 'O produto não foi encontrado' });
    }

    const { rowCount } = await conexao.query('delete from produtos where id = $1', [id]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível excluir o produto' });
    }

    return res.status(200).json({ mensagem: 'O produto foi excluido com sucesso.' });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  listarProdutos,
  detalharProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
}