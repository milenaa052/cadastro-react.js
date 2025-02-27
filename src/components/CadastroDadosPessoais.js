import React, { useState, useEffect } from 'react';

const CadastroDadosPessoais = ({ onNext }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    dataNasc: '',
    telefone: '',
    genero: ''
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('cadastroDadosPessoais'));
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  const [error, setError] = useState({
    nome: '',
    dataNasc: '',
    telefone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError((prevError) => ({ ...prevError, [name]: '' }));

    if (name === 'dataNasc') {
      const hoje = new Date();
      const dataSelecionada = new Date(value);
      if (dataSelecionada > hoje) {
        setError((prevError) => ({ ...prevError, dataNasc: "A data de nascimento não deve ser maior do que a data atual." }));
        return;
      }
    }

    if (name === 'telefone') {
      const telFormat = formatTelefone(value);
      setFormData((prevData) => ({ ...prevData, [name]: telFormat }));
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formatTelefone = (value) => {
    let telFormat = value.replace(/\D/g, "");
    telFormat = telFormat.replace(/^(\d{2})(\d)/, "($1) $2");
    telFormat = telFormat.replace(/(\d{5})(\d)/, "$1-$2");
    return telFormat.slice(0, 15);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!validateForm()) return;
    localStorage.setItem('cadastroDadosPessoais', JSON.stringify(formData));

    onNext(formData);
  };

  const validateForm = () => {
    const { nome, email, dataNasc, telefone, genero } = formData;

    if (!nome || !email || !dataNasc || !telefone || !genero) {
      setError((prevError) => ({ ...prevError, nome: "Preencha todos os campos." }));
      return false;
    }

    if (telefone.length !== 15) {
      setError((prevError) => ({ ...prevError, telefone: "O telefone deve estar preenchido corretamente." }));
      return false;
    }

    return true;
  };

  return (
    <div className="card">
      <div className="cardForm">
        <h2>Dados Pessoais</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="campos">
            <label htmlFor="nome" className="label">Nome</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange}/>
          </div>

          <div className="campos">
            <label htmlFor="email" className="label">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}/>
          </div>

          <div className="campos">
              <label htmlFor="dataNasc" className="label">Data de Nascimento</label>
              <input type="date" id="dataNasc" name="dataNasc" value={formData.dataNasc} onChange={handleChange}/>
              {error.dataNasc && <span className="error">{error.dataNasc}</span>}
          </div>

          <div className="campos">
              <label htmlFor="telefone" className="label">Número de Telefone</label>
              <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(99) 99999-9999"/>
              {error.telefone && <span className="error">{error.telefone}</span>}
          </div>

          <div className="campos">
              <label htmlFor="genero" className="label">Gênero</label>
              <select id="genero" name="genero" value={formData.genero} onChange={handleChange}> 
                <option value="">Selecione...</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="prefiro-nao-dizer">Prefiro não dizer</option>
              </select>
              {error.nome && <span className="error">{error.nome}</span>}
          </div>

          <div className='submit'>
            <a href="/login" className="login">Fazer login</a>
            <button type="submit" onClick={handleSubmit}>Próximo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroDadosPessoais;