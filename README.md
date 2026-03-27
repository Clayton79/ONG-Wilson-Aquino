CUFA Pernambuco — Sistema de Gestão

Aplicação full-stack desenvolvida do zero para gerenciar as operações da CUFA Pernambuco (Central Única das Favelas). O sistema oferece um painel administrativo completo com dashboard interativo, gráficos em tempo real, controle de voluntários, doadores, projetos, doações e eventos — tudo com autenticação JWT, validação robusta e exportação de relatórios em CSV/JSON. Também inclui uma **área pública** com página inicial, projetos, eventos e contato.

O **frontend** foi construído com **React 18 + TypeScript + Tailwind CSS**, utilizando **Zustand** para estado global, **React Hook Form + Zod** para formulários tipados e **Recharts** para visualização de dados. O **backend** é uma API RESTful em **Node.js + Express + TypeScript**, com persistência em JSON, controle de concorrência via mutex e sistema de backups integrado.

A aplicação está em produção com deploy frontend no **GitHub Pages** via GitHub Actions e backend no **Render**.

🔗 **Acesse a aplicação:** [https://clayton79.github.io/ONG-Wilson-Aquino/](https://clayton79.github.io/ONG-Wilson-Aquino/)

> **Credenciais de teste:** `admin@cufape.org.br` / `admin123`
