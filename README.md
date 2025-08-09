# Duelo das Sinapses — estilo Atari

Joguinho retrô em HTML5/Canvas com dois heróis jogáveis:

- 🧠 **Prof. Faleiro Neuro** — dispara cérebros energizados
- 💉 **Dr. Xadão Pediatrão** — dispara injeções supersônicas

## 🎮 Como jogar
- **Mover**: ← → (ou **A**/**D**)
- **Atirar**: **Espaço**
- **Pausar**: **P**
- **Mobile**: botões de toque na tela

## ▶️ Rodando localmente
Basta abrir `index.html` no navegador (sem dependências).  
Se preferir um servidorzinho local:

```bash
python -m http.server 8080
# depois acesse http://localhost:8080
```

## 📦 Publicar no GitHub Pages
1. Crie um repositório chamado `duelo-das-sinapses-atari-like`
2. Faça o upload de **index.html**, **LICENSE** e **README.md**
3. Nas *Settings* → **Pages** → *Build and deployment* → **Deploy from a branch**  
   - Branch: `main`  
   - Folder: `/root`  
4. Acesse a URL do GitHub Pages do repositório.

## 🧩 Tecnologias
- HTML5 + Canvas 2D
- WebAudio API (bipes retrô)
- Zero libs externas

## ✨ Recursos
- Escolha de personagem (Faleiro ou Xadão)
- HUD: Pontos, Nível, Vidas
- Dificuldade dinâmica
- Controles mobile
- Reinício e pausa

## 📝 Licença
MIT — veja `LICENSE`.
