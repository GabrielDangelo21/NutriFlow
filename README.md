# 🥗 NutriFlow - Nutrição Inteligente Integrada

**NutriFlow** é uma aplicação moderna de rastreamento nutricional que utiliza Inteligência Artificial para simplificar o acompanhamento da sua dieta. Desenvolvido com uma interface premium (Glassmorphism), o app oferece uma experiência fluida e intuitiva tanto em desktop quanto em dispositivos móveis.

---

## ✨ Funcionalidades Principais

### 🧠 NutriAI - Análise por IA
*   **Identificação Automática**: Tire uma foto ou descreva sua refeição e deixe que nossa IA (Google Gemini) calcule as calorias e macronutrientes para você.
*   **Estimativas Precisas**: Análise detalhada de proteínas, carboidratos e gorduras.

### 📊 Painel de Controle (Dashboard)
*   **Resumo Diário**: Visualize instantaneamente sua ingestão de calorias em relação à sua meta.
*   **Gráficos de Histórico**: Acompanhe sua evolução ao longo da semana com gráficos interativos (Recharts).
*   **Metas Personalizadas**: Defina seus objetivos de calorias e macros através do perfil.

### 🍱 Gestão de Refeições
*   **Categorização**: Organize sua alimentação por Café da Manhã, Almoço, Jantar e Lanches.
*   **Edição Flexível**: Adicione manualmente ou edite refeições existentes com facilidade.
*   **Fotos das Refeições**: Salve imagens dos seus pratos para recordação visual.

### 🌙 Experiência Premium
*   **Modo Dark/Light**: Interface adaptável que respeita sua preferência de sistema.
*   **Design Glassmorphism**: Estética moderna com transparências e animações suaves (Framer Motion).
*   **PWA Ready**: Totalmente responsivo e otimizado para mobile.

---

## 🛠️ Tecnologias Utilizadas

*   **Frontend**: React 19 + TypeScript + Vite
*   **Estilização**: Tailwind CSS v4
*   **Banco de Dados**: Supabase (PostgreSQL + Auth)
*   **IA**: Google Generative AI (Gemini SDK)
*   **Animações**: Framer Motion
*   **Gráficos**: Recharts
*   **Estado**: Zustand

---

## 🚀 Como Executar o Projeto

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/GabrielDangelo21/NutriFlow.git
    cd NutriFlow
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente**:
    Crie um arquivo `.env` na raiz com as seguintes chaves:
    ```env
    VITE_SUPABASE_URL=seu_url_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima
    VITE_GOOGLE_AI_API_KEY=sua_chave_gemini
    ```

4.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

---

## 👤 Autor

Desenvolvido por **Gabriel Dangelo**.

---

*NutriFlow - O fluxo inteligente da sua nutrição.*
