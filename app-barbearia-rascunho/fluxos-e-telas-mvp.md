# Fluxos e Telas do MVP - Aplicativo de Barbearia

## 1. Objetivo do Documento

Este documento organiza os fluxos principais e as telas necessarias para o MVP do aplicativo de barbearia.

Ele deve servir como base para:

- Criacao de wireframes.
- Prototipo visual.
- Planejamento tecnico.
- Desenvolvimento do app cliente.
- Desenvolvimento da area do barbeiro.
- Desenvolvimento do painel administrativo.

## 2. Perfis de Usuario do MVP

### Cliente

Pessoa que agenda servicos na barbearia.

Principais objetivos:
- Criar conta.
- Escolher servico.
- Escolher barbeiro.
- Agendar horario.
- Ver reservas.
- Cancelar reserva.
- Consultar historico.

### Barbeiro

Profissional que realiza atendimentos.

Principais objetivos:
- Ver agenda do dia.
- Ver detalhes do cliente.
- Confirmar atendimento.
- Marcar atendimento como concluido.
- Marcar nao comparecimento.

### Administrador

Dono, gerente ou responsavel pela barbearia.

Principais objetivos:
- Cadastrar servicos.
- Cadastrar barbeiros.
- Configurar horarios.
- Ver agenda geral.
- Controlar reservas.
- Ver clientes.

## 3. Fluxo Principal do Cliente

### Fluxo: Cadastro e Login

1. Cliente abre o aplicativo.
2. Ve a tela inicial.
3. Escolhe entrar ou criar conta.
4. Informa nome, telefone, e-mail e senha.
5. Sistema cria conta.
6. Cliente acessa a home.

Estados importantes:
- Formulario vazio.
- Campos invalidos.
- E-mail ja cadastrado.
- Senha fraca.
- Cadastro realizado.
- Login com erro.
- Recuperacao de senha solicitada.

### Fluxo: Agendamento

1. Cliente acessa a home.
2. Toca em Agendar.
3. Escolhe um servico.
4. Escolhe um barbeiro.
5. Escolhe uma data.
6. Escolhe um horario disponivel.
7. Confere resumo do agendamento.
8. Confirma a reserva.
9. Recebe tela de confirmacao.
10. Reserva aparece em Minhas Reservas.

Regras exibidas no fluxo:
- Mostrar preco e duracao do servico.
- Mostrar apenas barbeiros ativos.
- Mostrar apenas horarios disponiveis.
- Impedir conflito de agenda.
- Confirmar data, horario, barbeiro e servico antes de finalizar.

Estados importantes:
- Sem servicos cadastrados.
- Sem barbeiros disponiveis.
- Sem horarios na data escolhida.
- Horario acabou de ser ocupado.
- Reserva criada com sucesso.

### Fluxo: Cancelamento de Reserva

1. Cliente acessa Minhas Reservas.
2. Seleciona uma reserva futura.
3. Toca em Cancelar.
4. Sistema mostra aviso com regra de cancelamento.
5. Cliente confirma.
6. Reserva muda para status Cancelada.
7. Barbeiro/admin visualizam atualizacao.

Regras:
- Cancelamento permitido ate o prazo definido pela barbearia.
- Sugestao inicial: ate 2 horas antes do atendimento.
- Se estiver fora do prazo, o app mostra mensagem explicando a restricao.

Estados importantes:
- Cancelamento permitido.
- Cancelamento fora do prazo.
- Cancelamento confirmado.
- Erro ao cancelar.

### Fluxo: Historico

1. Cliente acessa Historico.
2. Sistema lista atendimentos concluidos e cancelados.
3. Cliente visualiza servico, barbeiro, data, status e valor.

Estados importantes:
- Historico vazio.
- Lista com atendimentos.
- Filtro futuro por status, se necessario.

## 4. Fluxo Principal do Barbeiro

### Fluxo: Login do Barbeiro

1. Barbeiro acessa o app ou area propria.
2. Informa e-mail e senha.
3. Sistema identifica perfil de barbeiro.
4. Barbeiro entra na Agenda do Dia.

Estados importantes:
- Login correto.
- Login incorreto.
- Usuario sem permissao de barbeiro.

### Fluxo: Agenda do Dia

1. Barbeiro acessa Agenda do Dia.
2. Visualiza horarios ordenados.
3. Cada item mostra cliente, servico, horario e status.
4. Barbeiro toca em um atendimento.
5. Abre detalhes do atendimento.

Estados importantes:
- Dia sem atendimentos.
- Atendimentos agendados.
- Atendimentos cancelados.
- Proximo atendimento em destaque.

### Fluxo: Concluir Atendimento

1. Barbeiro abre detalhes do atendimento.
2. Confere cliente e servico.
3. Toca em Marcar como concluido.
4. Sistema atualiza status da reserva.
5. Atendimento aparece no historico.

Estados importantes:
- Confirmacao antes de concluir.
- Atendimento concluido.
- Erro ao atualizar status.

### Fluxo: Nao Comparecimento

1. Barbeiro abre detalhes do atendimento.
2. Toca em Cliente nao compareceu.
3. Sistema pede confirmacao.
4. Reserva muda para status Nao compareceu.
5. Admin consegue consultar no painel.

Estados importantes:
- Confirmacao obrigatoria.
- Status atualizado.
- Erro ao atualizar.

## 5. Fluxo Principal do Administrador

### Fluxo: Login Admin

1. Admin acessa painel web.
2. Informa e-mail e senha.
3. Sistema valida permissao.
4. Admin entra no dashboard.

Estados importantes:
- Login correto.
- Login incorreto.
- Usuario sem permissao administrativa.

### Fluxo: Dashboard

1. Admin acessa o painel.
2. Visualiza resumo do dia.
3. Ve quantidade de agendamentos, cancelamentos e clientes.
4. Acessa agenda geral, servicos, barbeiros ou clientes.

Indicadores iniciais:
- Agendamentos de hoje.
- Proximos horarios.
- Cancelamentos recentes.
- Clientes cadastrados.
- Barbeiros ativos.

### Fluxo: Gestao de Servicos

1. Admin acessa Servicos.
2. Visualiza lista de servicos.
3. Cria novo servico ou edita existente.
4. Define nome, descricao, preco, duracao e status.
5. Salva alteracoes.

Regras:
- Servico precisa ter nome, preco e duracao.
- Servico inativo nao aparece para clientes.
- Alterar preco nao deve alterar valor de reservas ja criadas.

Estados importantes:
- Lista vazia.
- Servico criado.
- Servico editado.
- Servico desativado.
- Erro de validacao.

### Fluxo: Gestao de Barbeiros

1. Admin acessa Barbeiros.
2. Visualiza lista de profissionais.
3. Cria ou edita barbeiro.
4. Define nome, e-mail, telefone, especialidade, status e horarios.
5. Salva alteracoes.

Regras:
- Barbeiro ativo aparece no agendamento.
- Barbeiro inativo nao aparece para clientes.
- Barbeiro precisa ter horario de trabalho para receber agendamentos.

Estados importantes:
- Lista vazia.
- Barbeiro criado.
- Barbeiro editado.
- Barbeiro desativado.
- Erro de e-mail duplicado.

### Fluxo: Agenda Geral

1. Admin acessa Agenda Geral.
2. Seleciona dia.
3. Visualiza reservas por horario e barbeiro.
4. Pode abrir detalhes.
5. Pode cancelar reserva, se necessario.

Estados importantes:
- Dia sem reservas.
- Reservas por barbeiro.
- Reserva cancelada.
- Reserva concluida.
- Cliente nao compareceu.

### Fluxo: Gestao de Horarios e Bloqueios

1. Admin acessa Horarios.
2. Define dias e horarios da barbearia.
3. Define horarios individuais dos barbeiros.
4. Cria bloqueios em datas especificas.
5. Sistema remove esses horarios da disponibilidade do cliente.

Regras:
- Bloqueio nao deve apagar reservas ja existentes.
- Se houver reserva em horario bloqueado, admin deve receber alerta.
- Agenda do cliente deve respeitar configuracoes.

Estados importantes:
- Horario salvo.
- Bloqueio criado.
- Conflito com reserva existente.
- Erro de configuracao.

## 6. Mapa de Telas do Cliente

### 6.1 Tela Inicial

Objetivo:
Apresentar a barbearia e direcionar para login, cadastro ou agendamento.

Conteudo:
- Nome/logo da barbearia.
- Chamada principal.
- Botao Entrar.
- Botao Criar conta.
- Botao Agendar agora.

Acoes:
- Ir para login.
- Ir para cadastro.
- Ir para agendamento, exigindo login se necessario.

### 6.2 Login

Conteudo:
- Campo e-mail.
- Campo senha.
- Botao entrar.
- Link criar conta.
- Link recuperar senha.

Estados:
- Carregando.
- Erro de login.
- Sucesso.

### 6.3 Cadastro

Conteudo:
- Nome.
- Telefone.
- E-mail.
- Senha.
- Confirmar senha.
- Botao criar conta.

Estados:
- Campos obrigatorios vazios.
- E-mail invalido.
- Senhas diferentes.
- Cadastro concluido.

### 6.4 Recuperacao de Senha

Conteudo:
- Campo e-mail.
- Botao enviar instrucao.

Estados:
- E-mail enviado.
- E-mail nao encontrado.
- Erro temporario.

### 6.5 Home do Cliente

Conteudo:
- Saudacao.
- Proxima reserva.
- Atalho Agendar.
- Atalho Minhas Reservas.
- Atalho Historico.
- Atalho Perfil.

Estados:
- Cliente sem reserva futura.
- Cliente com reserva futura.

### 6.6 Escolha de Servico

Conteudo:
- Lista de servicos.
- Preco.
- Duracao.
- Descricao curta.

Acoes:
- Selecionar servico.

Estados:
- Lista carregando.
- Lista vazia.
- Erro ao carregar.

### 6.7 Escolha de Barbeiro

Conteudo:
- Lista de barbeiros.
- Nome.
- Foto opcional.
- Especialidade.
- Indicacao de disponibilidade.

Acoes:
- Selecionar barbeiro.

Estados:
- Nenhum barbeiro disponivel.
- Lista carregando.

### 6.8 Calendario de Horarios

Conteudo:
- Datas disponiveis.
- Horarios disponiveis.
- Resumo do servico e barbeiro.

Acoes:
- Escolher data.
- Escolher horario.
- Avancar para confirmacao.

Estados:
- Data sem horario.
- Horario selecionado.
- Horario indisponivel.

### 6.9 Confirmacao de Reserva

Conteudo:
- Servico.
- Barbeiro.
- Data.
- Horario.
- Duracao.
- Valor.
- Politica de cancelamento resumida.

Acoes:
- Confirmar reserva.
- Voltar e editar.

Estados:
- Confirmando.
- Reserva confirmada.
- Horario indisponivel no momento da confirmacao.

### 6.10 Reserva Confirmada

Conteudo:
- Mensagem de sucesso.
- Detalhes da reserva.
- Botao Ver minhas reservas.
- Botao Fazer novo agendamento.

### 6.11 Minhas Reservas

Conteudo:
- Lista de reservas futuras.
- Status.
- Servico.
- Barbeiro.
- Data e horario.

Acoes:
- Abrir detalhes.
- Cancelar reserva.

Estados:
- Sem reservas.
- Reserva cancelada.

### 6.12 Detalhes da Reserva

Conteudo:
- Dados completos da reserva.
- Status.
- Politica de cancelamento.

Acoes:
- Cancelar.

Estados:
- Cancelamento permitido.
- Cancelamento indisponivel.

### 6.13 Historico

Conteudo:
- Lista de atendimentos passados.
- Servico.
- Barbeiro.
- Data.
- Status.
- Valor.

Estados:
- Historico vazio.

### 6.14 Perfil

Conteudo:
- Nome.
- Telefone.
- E-mail.
- Botao salvar.
- Botao sair.

Estados:
- Alteracoes salvas.
- Erro ao salvar.

## 7. Mapa de Telas do Barbeiro

### 7.1 Login do Barbeiro

Pode reutilizar a tela de login geral, diferenciando o destino apos autenticacao.

### 7.2 Agenda do Dia

Conteudo:
- Data atual.
- Lista de horarios.
- Cliente.
- Servico.
- Status.
- Proximo atendimento destacado.

Acoes:
- Abrir atendimento.
- Trocar data.

Estados:
- Sem atendimentos.
- Atendimento cancelado.
- Atendimento concluido.

### 7.3 Detalhes do Atendimento

Conteudo:
- Nome do cliente.
- Telefone, se permitido.
- Servico.
- Horario.
- Duracao.
- Status.
- Observacoes.

Acoes:
- Marcar como concluido.
- Marcar como nao compareceu.

Estados:
- Confirmacao de acao.
- Status atualizado.

### 7.4 Historico do Barbeiro

Conteudo:
- Atendimentos concluidos.
- Datas.
- Servicos.
- Clientes.

Estados:
- Historico vazio.

## 8. Mapa de Telas do Administrador

### 8.1 Login Admin

Conteudo:
- E-mail.
- Senha.
- Botao entrar.

Estados:
- Erro de login.
- Usuario sem permissao.

### 8.2 Dashboard

Conteudo:
- Agendamentos de hoje.
- Cancelamentos recentes.
- Clientes cadastrados.
- Barbeiros ativos.
- Proximos atendimentos.

Acoes:
- Ir para agenda.
- Ir para servicos.
- Ir para barbeiros.
- Ir para clientes.

### 8.3 Agenda Geral

Conteudo:
- Filtro por data.
- Filtro por barbeiro.
- Lista ou grade de horarios.
- Status das reservas.

Acoes:
- Abrir reserva.
- Cancelar reserva.

Estados:
- Dia sem reservas.
- Reserva cancelada.

### 8.4 Detalhes da Reserva Admin

Conteudo:
- Cliente.
- Servico.
- Barbeiro.
- Data.
- Horario.
- Valor.
- Status.

Acoes:
- Cancelar.
- Marcar concluida.
- Marcar nao compareceu.

### 8.5 Servicos

Conteudo:
- Lista de servicos.
- Nome.
- Preco.
- Duracao.
- Status.

Acoes:
- Criar servico.
- Editar servico.
- Desativar servico.

### 8.6 Formulario de Servico

Campos:
- Nome.
- Descricao.
- Preco.
- Duracao em minutos.
- Status ativo/inativo.

Validacoes:
- Nome obrigatorio.
- Preco obrigatorio.
- Duracao obrigatoria.

### 8.7 Barbeiros

Conteudo:
- Lista de barbeiros.
- Nome.
- Especialidade.
- Status.
- Proximos horarios, se necessario.

Acoes:
- Criar barbeiro.
- Editar barbeiro.
- Desativar barbeiro.

### 8.8 Formulario de Barbeiro

Campos:
- Nome.
- E-mail.
- Telefone.
- Especialidade.
- Foto opcional.
- Status.
- Horarios de trabalho.

Validacoes:
- Nome obrigatorio.
- E-mail obrigatorio.
- Horario recomendado para ativar.

### 8.9 Clientes

Conteudo:
- Lista de clientes.
- Nome.
- Telefone.
- E-mail.
- Quantidade de reservas.
- Ultimo atendimento.

Acoes:
- Ver detalhes.

### 8.10 Detalhes do Cliente

Conteudo:
- Dados basicos.
- Reservas futuras.
- Historico.
- Status.

### 8.11 Horarios e Bloqueios

Conteudo:
- Horarios da barbearia.
- Horarios por barbeiro.
- Bloqueios por data.

Acoes:
- Editar horario.
- Criar bloqueio.
- Remover bloqueio.

### 8.12 Configuracoes Basicas

Conteudo:
- Nome da barbearia.
- Telefone.
- Endereco.
- Politica de cancelamento.
- Tempo minimo para cancelamento.

## 9. Navegacao Recomendada

### Cliente

Navegacao inferior:
- Home.
- Agendar.
- Reservas.
- Historico.
- Perfil.

### Barbeiro

Navegacao simples:
- Agenda.
- Historico.
- Perfil.

### Administrador

Menu lateral no painel web:
- Dashboard.
- Agenda.
- Servicos.
- Barbeiros.
- Clientes.
- Horarios.
- Configuracoes.

## 10. Estados Globais Importantes

O app deve prever:

- Carregando.
- Erro de conexao.
- Lista vazia.
- Confirmacao de acao.
- Sucesso.
- Permissao negada.
- Usuario deslogado.
- Dados indisponiveis.
- Conflito de horario.

## 11. Priorizacao Para Prototipo

Primeiro prototipar:

1. Fluxo de cadastro/login do cliente.
2. Fluxo completo de agendamento.
3. Minhas reservas e cancelamento.
4. Agenda do barbeiro.
5. Dashboard admin.
6. Gestao de servicos.
7. Gestao de barbeiros.
8. Agenda geral admin.

Depois prototipar:

- Historico.
- Perfil.
- Horarios e bloqueios.
- Configuracoes.

## 12. Proxima Etapa

Com os fluxos e telas definidos, o proximo passo e criar os wireframes do MVP.

Wireframes recomendados:

1. App cliente mobile.
2. Area do barbeiro mobile ou web simples.
3. Painel administrativo web.

Depois dos wireframes, criar o prototipo visual com cores, tipografia, componentes e navegacao final.
