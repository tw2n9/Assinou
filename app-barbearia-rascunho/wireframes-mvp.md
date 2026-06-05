# Wireframes Textuais do MVP - Aplicativo de Barbearia

## 1. Objetivo

Este documento descreve os wireframes textuais das telas do MVP.

Ele define:

- Estrutura visual de cada tela.
- Componentes principais.
- Acoes do usuario.
- Informacoes exibidas.
- Estados importantes.

Este material pode ser usado para criar um prototipo no Figma ou orientar o desenvolvimento inicial.

## 2. Padrao Visual Base

### App Mobile

Formato:
- Interface vertical.
- Navegacao inferior para cliente.
- Cabecalho simples com titulo da tela.
- Cards para servicos, barbeiros e reservas.
- Botoes principais grandes e fixos quando necessario.

Componentes recorrentes:
- Header.
- Card.
- Botao primario.
- Botao secundario.
- Campo de texto.
- Lista.
- Badge de status.
- Modal de confirmacao.
- Estado vazio.

### Painel Administrativo Web

Formato:
- Menu lateral.
- Topo com nome da tela.
- Area principal com cards, tabelas e filtros.
- Acoes principais no canto superior direito.

Componentes recorrentes:
- Sidebar.
- Header de pagina.
- Cards de indicador.
- Tabela.
- Filtro por data.
- Botao criar.
- Modal ou formulario lateral.
- Badge de status.

## 3. Wireframes do Cliente

### 3.1 Tela Inicial

Objetivo:
Apresentar a barbearia e direcionar o usuario.

Estrutura:

Topo:
- Logo ou nome da barbearia.

Centro:
- Titulo: "Agende seu horario sem complicacao"
- Texto curto: "Escolha o servico, barbeiro e horario em poucos minutos."
- Destaque visual com imagem ou bloco premium da barbearia.

Acoes:
- Botao primario: "Criar conta"
- Botao secundario: "Entrar"
- Link ou botao: "Agendar agora"

Rodape:
- Endereco resumido.
- Horario de funcionamento resumido.

Estados:
- Usuario deslogado.
- Se usuario ja estiver logado, redirecionar para Home.

### 3.2 Login

Objetivo:
Permitir entrada de cliente, barbeiro ou admin.

Estrutura:

Topo:
- Titulo: "Entrar"
- Texto curto: "Acesse sua conta para continuar."

Formulario:
- Campo e-mail.
- Campo senha.
- Link "Esqueci minha senha".

Acoes:
- Botao primario: "Entrar"
- Link: "Criar conta"

Estados:
- Campos vazios.
- E-mail invalido.
- Senha incorreta.
- Carregando.
- Login concluido.

### 3.3 Cadastro

Objetivo:
Criar conta de cliente.

Estrutura:

Topo:
- Titulo: "Criar conta"
- Texto curto: "Informe seus dados para agendar."

Formulario:
- Nome completo.
- Telefone.
- E-mail.
- Senha.
- Confirmar senha.

Acoes:
- Botao primario: "Criar conta"
- Link: "Ja tenho conta"

Estados:
- Telefone invalido.
- E-mail ja cadastrado.
- Senhas diferentes.
- Cadastro criado.

### 3.4 Recuperacao de Senha

Objetivo:
Solicitar redefinicao de senha.

Estrutura:

Topo:
- Titulo: "Recuperar senha"
- Texto curto: "Enviaremos instrucoes para seu e-mail."

Formulario:
- Campo e-mail.

Acoes:
- Botao primario: "Enviar instrucoes"
- Link: "Voltar para login"

Estados:
- E-mail enviado.
- E-mail nao encontrado.
- Erro temporario.

### 3.5 Home do Cliente

Objetivo:
Mostrar resumo e atalhos principais.

Estrutura:

Topo:
- Saudacao: "Ola, [Nome]"
- Icone/botao de notificacoes.

Card principal:
- Se houver reserva futura:
  - "Proximo horario"
  - Servico.
  - Barbeiro.
  - Data e hora.
  - Botao: "Ver reserva"
- Se nao houver reserva:
  - "Nenhum horario marcado"
  - Botao: "Agendar agora"

Atalhos:
- Agendar.
- Minhas reservas.
- Historico.
- Perfil.

Secao:
- Servicos populares.

Navegacao inferior:
- Home.
- Agendar.
- Reservas.
- Historico.
- Perfil.

Estados:
- Com reserva.
- Sem reserva.
- Carregando dados.

### 3.6 Escolha de Servico

Objetivo:
Selecionar o servico desejado.

Estrutura:

Topo:
- Titulo: "Escolha o servico"
- Subtitulo: "Veja preco e duracao antes de continuar."

Lista de cards:
- Nome do servico.
- Descricao curta.
- Duracao.
- Preco.
- Botao/acao: selecionar.

Exemplos:
- Corte.
- Barba.
- Sobrancelha.
- Pigmentacao.
- Hidratacao.
- Combo Corte + Barba.

Estados:
- Servicos carregando.
- Nenhum servico disponivel.
- Erro ao carregar.

### 3.7 Escolha de Barbeiro

Objetivo:
Selecionar o profissional.

Estrutura:

Topo:
- Titulo: "Escolha o barbeiro"
- Resumo do servico selecionado.

Lista de cards:
- Foto ou inicial do barbeiro.
- Nome.
- Especialidade.
- Status: disponivel/indisponivel.
- Botao: selecionar.

Opcao futura:
- "Qualquer barbeiro disponivel".

Estados:
- Sem barbeiros disponiveis.
- Barbeiro selecionado.
- Lista carregando.

### 3.8 Calendario de Horarios

Objetivo:
Selecionar data e horario.

Estrutura:

Topo:
- Titulo: "Escolha data e horario"
- Resumo: servico + barbeiro.

Calendario:
- Linha horizontal com proximos dias.
- Dia selecionado destacado.

Horarios:
- Grade de botoes com horarios disponiveis.
- Horarios indisponiveis desabilitados ou ocultos.

Rodape fixo:
- Resumo do horario escolhido.
- Botao: "Continuar"

Estados:
- Nenhum horario no dia.
- Horario selecionado.
- Horario indisponivel.
- Carregando disponibilidade.

### 3.9 Confirmacao de Reserva

Objetivo:
Revisar dados antes de confirmar.

Estrutura:

Topo:
- Titulo: "Confirmar reserva"

Card de resumo:
- Servico.
- Barbeiro.
- Data.
- Horario.
- Duracao.
- Valor.

Politica:
- Texto curto: "Cancelamento permitido ate 2 horas antes do horario."

Acoes:
- Botao primario: "Confirmar reserva"
- Botao secundario: "Voltar e editar"

Estados:
- Confirmando.
- Horario ficou indisponivel.
- Erro ao confirmar.

### 3.10 Reserva Confirmada

Objetivo:
Confirmar sucesso e orientar proxima acao.

Estrutura:

Centro:
- Indicador visual de sucesso.
- Titulo: "Horario confirmado"
- Texto: "Sua reserva foi registrada com sucesso."

Card:
- Servico.
- Barbeiro.
- Data e hora.

Acoes:
- Botao primario: "Ver minhas reservas"
- Botao secundario: "Agendar outro horario"

### 3.11 Minhas Reservas

Objetivo:
Listar reservas futuras.

Estrutura:

Topo:
- Titulo: "Minhas reservas"

Lista:
- Card da reserva.
- Servico.
- Barbeiro.
- Data e hora.
- Status.
- Botao: "Ver detalhes"

Estado vazio:
- Texto: "Voce ainda nao tem reservas futuras."
- Botao: "Agendar agora"

### 3.12 Detalhes da Reserva

Objetivo:
Mostrar informacoes completas e permitir cancelamento.

Estrutura:

Topo:
- Titulo: "Detalhes da reserva"

Card:
- Status.
- Servico.
- Barbeiro.
- Data.
- Horario.
- Duracao.
- Valor.

Politica:
- Regra de cancelamento.

Acoes:
- Botao secundario/destrutivo: "Cancelar reserva"

Modal de cancelamento:
- Titulo: "Cancelar reserva?"
- Texto com impacto.
- Botao confirmar.
- Botao voltar.

Estados:
- Cancelamento permitido.
- Cancelamento bloqueado por prazo.
- Reserva cancelada.

### 3.13 Historico

Objetivo:
Mostrar atendimentos passados.

Estrutura:

Topo:
- Titulo: "Historico"

Lista:
- Servico.
- Barbeiro.
- Data.
- Status.
- Valor.

Estado vazio:
- "Seu historico aparecera aqui."

### 3.14 Perfil

Objetivo:
Visualizar e editar dados basicos.

Estrutura:

Topo:
- Titulo: "Perfil"

Formulario:
- Nome.
- Telefone.
- E-mail somente leitura ou editavel com verificacao.

Acoes:
- Botao: "Salvar alteracoes"
- Botao/link: "Sair"

Estados:
- Alteracoes salvas.
- Erro ao salvar.

## 4. Wireframes do Barbeiro

### 4.1 Agenda do Dia

Objetivo:
Mostrar a rotina do barbeiro.

Estrutura:

Topo:
- Saudacao.
- Data atual.
- Seletor de data.

Resumo:
- Total de atendimentos do dia.
- Proximo atendimento.

Lista:
- Horario.
- Cliente.
- Servico.
- Status.

Acoes:
- Abrir detalhes.
- Trocar data.

Estado vazio:
- "Nenhum atendimento para esta data."

### 4.2 Detalhes do Atendimento

Objetivo:
Permitir acompanhar e atualizar um atendimento.

Estrutura:

Topo:
- Titulo: "Atendimento"

Card cliente:
- Nome.
- Telefone, se permitido.

Card reserva:
- Servico.
- Horario.
- Duracao.
- Status.

Acoes:
- Botao primario: "Marcar como concluido"
- Botao secundario: "Cliente nao compareceu"

Modal:
- Confirmar mudanca de status.

Estados:
- Atendimento agendado.
- Atendimento concluido.
- Nao compareceu.
- Atendimento cancelado.

### 4.3 Historico do Barbeiro

Objetivo:
Mostrar atendimentos concluidos.

Estrutura:

Topo:
- Titulo: "Historico"

Filtro:
- Periodo simples: hoje, semana, mes.

Lista:
- Cliente.
- Servico.
- Data.
- Horario.
- Status.

Estado vazio:
- "Nenhum atendimento concluido."

## 5. Wireframes do Administrador

### 5.1 Layout Base do Painel

Estrutura:

Sidebar:
- Dashboard.
- Agenda.
- Servicos.
- Barbeiros.
- Clientes.
- Horarios.
- Configuracoes.

Topo:
- Nome da tela.
- Nome da barbearia.
- Usuario logado.

Area principal:
- Conteudo da tela selecionada.

### 5.2 Dashboard

Objetivo:
Dar visao rapida da operacao.

Estrutura:

Topo:
- Titulo: "Dashboard"
- Filtro de data.

Cards de indicadores:
- Agendamentos de hoje.
- Cancelamentos.
- Clientes cadastrados.
- Barbeiros ativos.

Secao:
- Proximos atendimentos.
- Cancelamentos recentes.

Acoes:
- Ir para agenda.
- Criar servico.
- Criar barbeiro.

### 5.3 Agenda Geral

Objetivo:
Controlar reservas da barbearia.

Estrutura:

Topo:
- Titulo: "Agenda"
- Filtro por data.
- Filtro por barbeiro.

Visualizacao:
- Tabela ou grade por horario.

Colunas sugeridas:
- Horario.
- Cliente.
- Servico.
- Barbeiro.
- Status.
- Acoes.

Acoes:
- Abrir detalhes.
- Cancelar reserva.

Estados:
- Sem reservas.
- Filtro sem resultado.

### 5.4 Detalhes da Reserva Admin

Objetivo:
Permitir controle administrativo da reserva.

Estrutura:

Resumo:
- Cliente.
- Telefone.
- Servico.
- Barbeiro.
- Data.
- Horario.
- Valor.
- Status.

Acoes:
- Marcar concluida.
- Marcar nao compareceu.
- Cancelar reserva.

### 5.5 Servicos

Objetivo:
Gerenciar servicos da barbearia.

Estrutura:

Topo:
- Titulo: "Servicos"
- Botao: "Novo servico"

Tabela:
- Nome.
- Preco.
- Duracao.
- Status.
- Acoes.

Acoes:
- Criar.
- Editar.
- Desativar/ativar.

### 5.6 Formulario de Servico

Objetivo:
Criar ou editar servico.

Campos:
- Nome.
- Descricao.
- Preco.
- Duracao em minutos.
- Status ativo/inativo.

Acoes:
- Salvar.
- Cancelar.

Estados:
- Criando.
- Editando.
- Erro de validacao.
- Salvo com sucesso.

### 5.7 Barbeiros

Objetivo:
Gerenciar profissionais.

Estrutura:

Topo:
- Titulo: "Barbeiros"
- Botao: "Novo barbeiro"

Tabela:
- Nome.
- E-mail.
- Telefone.
- Especialidade.
- Status.
- Acoes.

Acoes:
- Criar.
- Editar.
- Desativar/ativar.

### 5.8 Formulario de Barbeiro

Objetivo:
Criar ou editar barbeiro.

Campos:
- Nome.
- E-mail.
- Telefone.
- Especialidade.
- Foto opcional.
- Status ativo/inativo.

Secao de horarios:
- Dias da semana.
- Hora inicio.
- Hora fim.

Acoes:
- Salvar.
- Cancelar.

Estados:
- E-mail duplicado.
- Horario invalido.
- Salvo com sucesso.

### 5.9 Clientes

Objetivo:
Consultar clientes cadastrados.

Estrutura:

Topo:
- Titulo: "Clientes"
- Campo de busca.

Tabela:
- Nome.
- Telefone.
- E-mail.
- Reservas.
- Ultimo atendimento.
- Acoes.

Acoes:
- Ver detalhes.

### 5.10 Detalhes do Cliente

Objetivo:
Ver dados e historico do cliente.

Estrutura:

Resumo:
- Nome.
- Telefone.
- E-mail.
- Data de cadastro.

Secoes:
- Reservas futuras.
- Historico.

### 5.11 Horarios e Bloqueios

Objetivo:
Controlar disponibilidade.

Estrutura:

Abas:
- Horario da barbearia.
- Horario dos barbeiros.
- Bloqueios.

Horario da barbearia:
- Dias da semana.
- Hora abertura.
- Hora fechamento.
- Ativo/inativo.

Horario dos barbeiros:
- Selecionar barbeiro.
- Dias e horarios.

Bloqueios:
- Data.
- Hora inicio.
- Hora fim.
- Motivo.
- Barbeiro ou geral.

Acoes:
- Salvar horarios.
- Criar bloqueio.
- Remover bloqueio.

Estados:
- Conflito com reserva existente.
- Horario salvo.
- Bloqueio criado.

### 5.12 Configuracoes Basicas

Objetivo:
Configurar dados da barbearia.

Campos:
- Nome da barbearia.
- Telefone.
- Endereco.
- Tempo minimo para cancelamento.
- Texto curto da politica de cancelamento.

Acoes:
- Salvar configuracoes.

## 6. Componentes Padrao

### Card de Servico

Conteudo:
- Nome.
- Descricao.
- Duracao.
- Preco.
- Acao selecionar.

### Card de Barbeiro

Conteudo:
- Foto ou iniciais.
- Nome.
- Especialidade.
- Status.
- Acao selecionar.

### Card de Reserva

Conteudo:
- Servico.
- Barbeiro.
- Data.
- Horario.
- Status.
- Acao detalhes.

### Badge de Status

Status:
- Agendada.
- Confirmada.
- Concluida.
- Cancelada.
- Nao compareceu.

### Modal de Confirmacao

Uso:
- Cancelar reserva.
- Concluir atendimento.
- Marcar nao comparecimento.
- Desativar servico.
- Desativar barbeiro.

Estrutura:
- Titulo.
- Texto explicativo.
- Botao confirmar.
- Botao cancelar.

## 7. Ordem Recomendada Para Desenhar no Figma

1. Componentes base.
2. Tela inicial.
3. Login.
4. Cadastro.
5. Home cliente.
6. Escolha de servico.
7. Escolha de barbeiro.
8. Calendario.
9. Confirmacao.
10. Minhas reservas.
11. Agenda do barbeiro.
12. Dashboard admin.
13. Agenda geral admin.
14. Servicos admin.
15. Barbeiros admin.
16. Horarios admin.

## 8. Proxima Etapa

Depois dos wireframes, o proximo passo e criar o conceito visual do MVP:

- Paleta de cores.
- Tipografia.
- Componentes visuais.
- Layout mobile.
- Layout web admin.
- Guia de estilo inicial.
