Markdown
# 🌿 Lapisco Plant Identification Fullstack Challenge

[![en](https://img.shields.io/badge/lang-en-red.svg)](#english)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](#português)

---

## 🇺🇸 English <a id="english"></a>

### About the Project
This project was developed as a solution for the Fullstack Challenge by **LAPISCO** (Laboratório de Processamento de Imagens, Sinais e Computação Aplicada - IFCE). It consists of a complete system for user authentication and plant species identification through artificial intelligence. 

Users can register, log in securely, upload images of plants, and receive the species name along with the AI's confidence level. All analyses are saved securely and segregated by user in a history dashboard.

### 🛠 Tech Stack

**Frontend:**
* React.js (Vite)
* TypeScript
* Tailwind CSS
* React Router DOM
* Axios & Lucide React (Icons)

**Backend:**
* NestJS
* TypeScript
* TypeORM
* PostgreSQL (Docker)
* JWT (Passport.js) for Authentication

**AI API (Computer Vision):**
* Python
* FastAPI
* PyTorch & HuggingFace (`FloraSense-ONNX`)

### 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18+)
* [Docker](https://www.docker.com/) and Docker Compose
* [Python](https://www.python.org/) (v3.9+)

### 🚀 How to Run the Project

The ecosystem consists of 3 distinct servers running simultaneously. Open three terminal tabs and follow the steps below:

#### 1. Database & Backend (NestJS)
```bash
# Enter the backend folder
cd backend

# Start the PostgreSQL database using Docker
docker compose up -d

# Install dependencies
npm install

# Start the NestJS server (runs on port 3000)
npm run start:dev
```
2. Artificial Intelligence API (Python)
```bash
# Enter the AI/Python folder (assuming the name of your folder)
cd ai-api

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn torch torchvision transformers Pillow python-multipart

# Start the FastAPI server (runs on port 8000)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
3. Frontend (React)
```Bash
# Enter the frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server (runs on port 5173)
npm run dev
```
✨ Features
User Authentication: Registration and secure Login using JWT.


Data Segregation: Users can only view their own classification history.

Image Upload: Integrated system handling multipart/form-data connecting Frontend -> NestJS -> FastAPI.

History Dashboard: Interactive table displaying past analyses with the option to click and view detailed predictions.



## 🇧🇷 Português 
### Sobre o Projeto
Este projeto foi desenvolvido como solução para o Desafio Fullstack do LAPISCO (Laboratório de Processamento de Imagens, Sinais e Computação Aplicada - IFCE). Trata-se de um sistema completo de autenticação de usuários e identificação de espécies de plantas através de inteligência artificial.

Os usuários podem se cadastrar, fazer login com segurança, enviar imagens de plantas e receber o nome da espécie junto com o nível de confiança da IA. Todas as análises são salvas de forma segura e segregada por usuário em um painel de histórico.

### 🛠 Tecnologias Utilizadas
**Frontend:**
* React.js (Vite)
* TypeScript
* Tailwind CSS
* React Router DOM
* Axios & Lucide React (Ícones)

**Backend:**
* NestJS
* TypeScript
* TypeORM
* PostgreSQL (Docker)
* JWT (Passport.js) para Autenticação

**API da IA (Visão Computacional):**
* Python
* FastAPI
* PyTorch & HuggingFace (`FloraSense-ONNX`)


### 📋 Pré-requisitos
Antes de começar, certifique-se de ter as seguintes ferramentas instaladas na sua máquina:
* [Node.js](https://nodejs.org/) (v18+)
* [Docker](https://www.docker.com/) and Docker Compose
* [Python](https://www.python.org/) (v3.9+)
* 

## 🚀 Como Executar o Projeto
O ecossistema é composto por 3 servidores distintos rodando simultaneamente. Abra três abas de terminal e siga os passos abaixo:

1. Banco de Dados e Backend (NestJS)
```Bash
# Entre na pasta do backend
cd backend

# Inicie o banco PostgreSQL usando Docker
docker compose up -d

# Instale as dependências
npm install

# Inicie o servidor NestJS (roda na porta 3000)
npm run start:dev
```
2. API de Inteligência Artificial (Python)
```Bash
# Entre na pasta da IA/Python (ajuste para o nome real da sua pasta)
cd ai-api

# Crie e ative um ambiente virtual (opcional, mas recomendado)
python -m venv venv
source venv/bin/activate  # No Windows use: venv\Scripts\activate

# Instale as dependências
pip install fastapi uvicorn torch torchvision transformers Pillow python-multipart

# Inicie o servidor FastAPI (roda na porta 8000)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
3. Frontend (React)
```Bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento Vite (roda na porta 5173)
npm run dev
```
✨ Funcionalidades
Autenticação: Cadastro e Login seguro utilizando JWT.

Segregação de Dados: Usuários só têm acesso ao próprio histórico de classificações.

Upload de Imagens: Sistema integrado lidando com multipart/form-data conectando Frontend -> NestJS -> FastAPI.

Painel de Histórico: Tabela interativa exibindo análises passadas, com a opção de clicar e visualizar os detalhes da predição em um modal.
