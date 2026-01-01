# Deploy no Render (Web Service)

**Build command**
```bash
npm install && npm run build
```

**Start command**
```bash
npm start
```

**Observação**
- Este projeto é Vite/React (gera `dist/`). O `server.js` (Express) serve o conteúdo de `dist/`.
- Depois você pode criar rotas em `/api/*` para persistir dados com banco.
