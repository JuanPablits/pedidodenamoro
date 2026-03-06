import React, { useState, useEffect } from 'react';
import './App.css'; // Aqui vai o seu CSS depois

// 1. Nossa estrutura de dados com as fases
const steps = [
  {
    id: 1,
    question: "Toda grande história tem um ponto de partida. O nosso não foi escrito em um livro, mas tem um endereço exato. Qual é o nome do lugar onde tudo começou?",
    options: ["Praça da Independência", "Mc Donalds", "Emissário Submarino", "Jardim da Praia"],
    correctAnswer: "Mc Donalds", // Coloque o local correto aqui
    locationPassword: "fevereiro", // Senha escondida no Roxy
    revealedAddress: "Av. Ana Costa, 550 - Gonzaga, Santos - SP, 11060-002",
    mapIframeUrl: "https://maps.google.com/maps?q=McDonald's,%20Av.%20Ana%20Costa,%20550,%20Gonzaga,%20Santos&t=&z=16&ie=UTF8&iwloc=&output=embed"
  },
  {
    id: 2,
    question: "Atrás de um vidro, pelúcias fofinhas nos julgam enquanto uma garra de metal testa a nossa paciência. Onde nossa maior frustração mora?",
    options: ["Miramar Shopping", "Praiamar Shopping", "Brisamar", "Fliperama do Gonzaga"],
    correctAnswer: "Praiamar Shopping", // Coloque o shopping correto aqui
    locationPassword: "garra", // Senha escondida na máquina
    revealedAddress: "R. Alexandre Martins, 80 - Aparecida, Santos - SP, 11025-202",
    mapIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227.8459453997699!2d-46.31072512838442!3d-23.9768734555584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce035374538c95%3A0xe13ffb1bd638a35c!2sPraiamar%20Shopping!5e0!3m2!1spt-BR!2sbr!4v1771900668636!5m2!1spt-BR!2sbr"
  },
  {
    id: 3,
    question: "O local em que eu sinto a amarga tristeza do fim, o local ao qual minha bela dama repousa, Qual é o lugar?",
    options: ["Cafeteria do Centro", "Sua casa", "Ponto de Ônibus", "Restaurante da Esquina"],
    correctAnswer: "Sua casa",
    locationPassword: "cheguei", // Aqui a senha final pode ser o próprio "sim" do pedido!
    revealedAddress: "Me encontre onde meu coração repousa: sua casa (fonte do sapo).",
    mapIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d541.8996859396651!2d-46.31343415635504!3d-23.97980991980763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce030049aaeefd%3A0x37c80ecdac8e8ce7!2sFonte%20do%20Sapo!5e0!3m2!1spt-BR!2sbr!4v1772777276523!5m2!1spt-BR!2sbr"
}];

export default function TreasureHunt() {
  // 1. Inicialização "preguiçosa" (Lazy Initialization)
  // O React vai ler o localStorage apenas na primeira vez que o componente for carregado.
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const savedStep = localStorage.getItem('@PedidoNamoro:stepIndex');
    return savedStep !== null ? parseInt(savedStep, 10) : 0;
  });

  const [showMap, setShowMap] = useState(() => {
    const savedShowMap = localStorage.getItem('@PedidoNamoro:showMap');
    return savedShowMap === 'true'; // Converte a string 'true' para o valor booleano true
  });

  const [finished, setFinished] = useState(() => {
    const savedFinished = localStorage.getItem('@PedidoNamoro:finished');
    return savedFinished === 'true';
  });

  // Estes estados não precisam de ir para o localStorage
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentStepData = steps[currentStepIndex];

  // 2. O useEffect para GUARDAR as alterações
  // Sempre que currentStepIndex, showMap ou finished mudarem, esta função é executada e guarda no telemóvel.
  useEffect(() => {
    localStorage.setItem('@PedidoNamoro:stepIndex', currentStepIndex);
    localStorage.setItem('@PedidoNamoro:showMap', showMap);
    localStorage.setItem('@PedidoNamoro:finished', finished);
  }, [currentStepIndex, showMap, finished]);


  // Função para limpar o progresso (ÚTIL PARA VOCÊ TESTAR)
  const resetProgress = () => {
    localStorage.removeItem('@PedidoNamoro:stepIndex');
    localStorage.removeItem('@PedidoNamoro:showMap');
    localStorage.removeItem('@PedidoNamoro:finished');
    setCurrentStepIndex(0);
    setShowMap(false);
    setFinished(false);
    setErrorMsg('');
  };

  // --- O RESTO DAS SUAS FUNÇÕES CONTINUA IGUAL ---
  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === currentStepData.correctAnswer) {
      setErrorMsg('');
      setShowMap(true); 
    } else {
      setErrorMsg('Ops, resposta errada! Tente de novo.');
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput.toLowerCase().trim() === currentStepData.locationPassword.toLowerCase()) {
      setPasswordInput('');
      setErrorMsg('');
      setShowMap(false);
      
      if (currentStepIndex + 1 < steps.length) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        setFinished(true); 
      }
    } else {
      setErrorMsg('Senha do local incorreta. Você já chegou lá?');
    }
  };

 // Tela Final
  if (finished) {
    return (
      <div className="container final-screen">
        <h2>Você chegou ao destino final!</h2>
        <p>Olhe para trás...</p>
        <p>Você quer namorar comigo?</p>
        
        {/* Botão de reset temporário para testar */}
        <button 
          onClick={resetProgress} 
          style={{ 
            marginTop: '30px', 
            padding: '10px 20px', 
            background: 'transparent', 
            color: '#666', 
            border: '1px solid #666', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Resetar Teste (Dev)
        </button>
      </div>
    );
  }
  return (
    <div className="container">
      {/* Botão de reset temporário para testar */}
      <button 
        onClick={resetProgress} 
        style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '10px', background: 'transparent', color: '#666', border: '1px solid #666' }}
      >
        Reset Dev
      </button>

      {/* TELA DE PERGUNTA */}
      {!showMap && (
        <div className="question-container">
          <h2>Fase {currentStepData.id}</h2>
          <p className="question-text">{currentStepData.question}</p>
          
          <div className="options-grid">
            {currentStepData.options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswerClick(option)}
                className="option-button"
              >
                {option}
              </button>
            ))}
          </div>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </div>
      )}

      {/* TELA DO MAPA */}
      {showMap && (
        <div className="map-container">
          <div className="map-header">
            <h3>Endereço</h3>
          </div>
          
          <div className="address-bar">
            <p>{currentStepData.revealedAddress}</p>
            <span>&gt;</span>
          </div>

          <iframe 
            src={currentStepData.mapIframeUrl}
            width="100%" 
            height="350" 
            style={{ border: 0, borderRadius: '8px' }} 
            allowFullScreen="" 
            loading="lazy"
            title="Mapa do Local"
          ></iframe>

          <div className="password-section">
            <p>Vá até o local para encontrar a senha da próxima pista!</p>
            <input 
              type="text" 
              placeholder="Digite a senha do local..." 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button onClick={handlePasswordSubmit}>Avançar</button>
            {errorMsg && <p className="error">{errorMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}