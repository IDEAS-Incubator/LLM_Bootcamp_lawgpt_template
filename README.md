# bootcamp_lawgpt

LAWGPT is a legal assistant chatbot built using Retrieval-Augmented Generation (RAG) technology. This project helps users ask legal questions and get accurate responses based on legal documents and knowledge.

## Project Overview

LAWGPT uses a combination of:

- **Large Language Models** (via Ollama)
- **Vector Embeddings** for document understanding
- **Retrieval-Augmented Generation (RAG)** to provide accurate and sourced legal information

## Prerequisites

- Python 3.8 or higher
- Git
- 8GB+ RAM recommended
- 10GB+ free disk space

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/IDEAS-Incubator/LLM_Bootcamp_lawgpt_template.git
```

### Step 2: Set Up Python Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate


```

### Step 3: Install Ollama

#### Ollama is an easy way to run LLMs locally.

```bash

For macOS:
curl -fsSL https://ollama.com/install.sh | sh

For Linux:
curl -fsSL https://ollama.com/install.sh | sh

For Windows:

Download the installer from Ollama's official website
Run the installer and follow the on-screen instructions


```

### Step 4: Download Required Models

```bash
# Pull the llama2 model for text generation
ollama pull llama2

# Pull the embedding model for vector embeddings
ollama pull nomic-embed-text

```

### Step 5: Run the Application

```bash
python code.py
python embedding.py
# Copy your legal documents into this directory
```

## For Full stack Application

## To Start BackEnd

Go to the server directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start

```bash
  npm run start
```

## To Start FrontEnd

Go to the client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start

```bash
   npm run dev
```
