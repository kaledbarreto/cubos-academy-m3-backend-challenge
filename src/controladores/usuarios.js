const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chave = require('../chave');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome) {
    return res.status(404).json({ mensagem: 'O campo nome é obrigatório' });
  }

  if (!email) {
    return res.status(404).json({ mensagem: 'O campo email é obrigatório' });
  }

  if (!senha) {
    return res.status(404).json({ mensagem: 'O campo senha é obrigatório' });
  }

  if (!nome_loja) {
    return res.status(404).json({ mensagem: 'O campo nome_loja é obrigatório' });
  }

  try {
    const queryEmail = 'select * from usuarios where email = $1';
    const { rowCount: quantidaDeUsuarios } = await conexao.query(queryEmail, [email]);

    if (quantidaDeUsuarios > 0) {
      return res.status(400).json({ mensagem: 'O email informado já existe' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
    const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);

    if (usuarioCadastrado.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível cadastrar o usuário' });
    }

    res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    return res.status(404).json(error.message);
  }
}

const logarUsuario = async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(404).json({ mensagem: 'O campo email é obrigatório' });
  }

  if (!senha) {
    return res.status(404).json({ mensagem: 'O campo senha é obrigatório' });
  }

  try {
    const queryEmail = 'select * from usuarios where email = $1';
    const { rows, rowCount } = await conexao.query(queryEmail, [email]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const usuario = rows[0];

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
      return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }

    const token = jwt.sign({ id: usuario.id }, chave, { expiresIn: '1d' });

    return res.status(200).json({ token });

  } catch (error) {
    return res.status(404).json(error.message);
  }
}

const detalharUsuario = async (req, res) => {
  const { usuario } = req;

  try {
    const { id } = await conexao.query('select * from usuarios where email = $1', [usuario.email]);

    return res.status(200).json({ id, usuario });
  } catch (error) {
    return res.status(401).json(error.message);
  }
}

const atualizarUsuario = async (req, res) => {
  const { usuario } = req;
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome) {
    return res.status(404).json({ mensagem: 'O campo nome é obrigatório' });
  }

  if (!email) {
    return res.status(404).json({ mensagem: 'O campo email é obrigatório' });
  }

  if (!senha) {
    return res.status(404).json({ mensagem: 'O campo senha é obrigatório' });
  }

  if (!nome_loja) {
    return res.status(404).json({ mensagem: 'O campo nome_loja é obrigatório' });
  }


  try {
    const queryEmail = 'select * from usuarios where email = $1';
    const { rowCount: quantidaDeUsuarios } = await conexao.query(queryEmail, [email]);

    if (quantidaDeUsuarios > 0) {
      return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
    const usuarioAtualizado = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja, usuario.id]);

    if (usuarioAtualizado.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível atualizar o usuário' });
    }

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  cadastrarUsuario,
  logarUsuario,
  detalharUsuario,
  atualizarUsuario
}