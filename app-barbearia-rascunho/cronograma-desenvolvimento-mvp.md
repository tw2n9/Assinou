# Cronograma de Desenvolvimento do MVP - Aplicativo de Barbearia

## 1. Objetivo

Este cronograma organiza o desenvolvimento do MVP em semanas, com entregas claras e ordem pratica de execucao.

Objetivo final:
Chegar a uma versao beta funcional com app cliente, area do barbeiro, painel administrativo, agenda, reservas e notificacoes simples.

## 2. Premissas

Duracao estimada:
- 8 semanas para um MVP funcional.

Equipe minima sugerida:
- 1 desenvolvedor backend.
- 1 desenvolvedor mobile.
- 1 desenvolvedor frontend/web.
- 1 designer UI/UX.
- 1 responsavel de produto/negocio.

Equipe reduzida:
- 1 desenvolvedor full-stack/mobile pode executar, mas o prazo tende a aumentar.

Stack sugerida:
- Mobile: Flutter.
- Painel admin: Next.js.
- Backend: Node.js/NestJS.
- Banco: PostgreSQL.

## 3. Visao Geral das Fases

Semana 1:
Setup, arquitetura, banco e prototipo base.

Semana 2:
Backend base, autenticacao e usuarios.

Semana 3:
Servicos, barbeiros, horarios e disponibilidade.

Semana 4:
Reservas, conflitos de agenda e cancelamento.

Semana 5:
App cliente com fluxo completo de agendamento.

Semana 6:
Painel administrativo e area do barbeiro.

Semana 7:
Notificacoes, ajustes, testes e beta fechado.

Semana 8:
Producao, publicacao beta e preparacao para lojas.

## 4. Semana 1 - Planejamento Final, Setup e Banco

### Objetivo

Preparar a base do projeto para desenvolvimento sem retrabalho.

### Entregas

Produto:
- Revisao final do escopo do MVP.
- Revisao das regras de agendamento.
- Revisao dos fluxos principais.
- Definicao do prazo minimo de cancelamento.

Design:
- Componentes base no Figma.
- Wireframes principais refinados.
- Tela inicial, login, home e agendamento em baixa fidelidade.

Tecnico:
- Repositorio Git criado.
- Estrutura inicial dos projetos.
- Backend iniciado.
- Painel web iniciado.
- App mobile iniciado.
- Banco de dados modelado.
- Migrations iniciais criadas.

### Tarefas Principais

- Criar repositorios.
- Configurar ambiente local.
- Criar modelo de dados.
- Criar tabelas principais.
- Configurar variaveis de ambiente.
- Definir padrao de branch e commits.
- Criar layout visual inicial.

### Prioridade

Muito alta.

### Criterio de Conclusao

Projetos rodam localmente e banco inicial esta criado.

## 5. Semana 2 - Backend Base e Autenticacao

### Objetivo

Criar a base da API e permitir acesso seguro por perfil.

### Entregas

Backend:
- API configurada.
- Conexao com banco.
- Cadastro de usuario.
- Login.
- Recuperacao de senha, se viavel.
- Middleware de autenticacao.
- Controle de permissoes por perfil.

Perfis:
- Cliente.
- Barbeiro.
- Admin.

### Tarefas Principais

- Implementar modulo de autenticacao.
- Implementar criptografia de senha.
- Implementar JWT ou auth provider.
- Criar endpoints de usuario logado.
- Criar protecao de rotas.
- Criar seeds iniciais, se necessario.
- Criar admin inicial.

### Prioridade

Muito alta.

### Criterio de Conclusao

Cliente, barbeiro e admin conseguem fazer login e acessar apenas suas areas permitidas.

## 6. Semana 3 - Servicos, Barbeiros e Horarios

### Objetivo

Permitir que a barbearia configure a base da agenda.

### Entregas

Backend:
- CRUD de servicos.
- CRUD de barbeiros.
- Configuracao de horarios da barbearia.
- Configuracao de horarios dos barbeiros.
- Bloqueios de horario.

Painel admin:
- Tela de servicos.
- Formulario de servico.
- Tela de barbeiros.
- Formulario de barbeiro.
- Tela inicial de horarios.

### Tarefas Principais

- Criar endpoints de servicos.
- Criar endpoints de barbeiros.
- Criar endpoints de horarios.
- Criar validacoes.
- Criar telas admin basicas.
- Integrar painel com API.

### Prioridade

Alta.

### Criterio de Conclusao

Admin consegue cadastrar servicos, barbeiros e horarios que serao usados no agendamento.

## 7. Semana 4 - Agenda, Disponibilidade e Reservas

### Objetivo

Construir o coracao do MVP: reservas sem conflito de horario.

### Entregas

Backend:
- Consulta de disponibilidade.
- Criacao de reserva.
- Calculo de hora final pela duracao do servico.
- Bloqueio de conflitos.
- Cancelamento de reserva.
- Status de reserva.

Regras:
- Nao permitir horario duplicado.
- Nao permitir data passada.
- Respeitar horario da barbearia.
- Respeitar horario do barbeiro.
- Respeitar bloqueios.

### Tarefas Principais

- Implementar algoritmo de disponibilidade.
- Criar endpoint de horarios disponiveis.
- Criar endpoint de reserva.
- Revalidar disponibilidade no momento da confirmacao.
- Implementar cancelamento por cliente.
- Implementar cancelamento por admin.
- Criar testes principais de agenda.

### Prioridade

Muito alta.

### Criterio de Conclusao

Sistema permite criar reserva valida e impede conflitos de agenda.

## 8. Semana 5 - App Cliente

### Objetivo

Entregar o fluxo completo de agendamento no app mobile.

### Entregas

Telas:
- Tela inicial.
- Login.
- Cadastro.
- Home.
- Escolha de servico.
- Escolha de barbeiro.
- Calendario de horarios.
- Confirmacao.
- Reserva confirmada.
- Minhas reservas.
- Detalhes da reserva.
- Perfil.

Funcionalidades:
- Login integrado.
- Cadastro integrado.
- Listagem de servicos.
- Listagem de barbeiros.
- Consulta de horarios.
- Criacao de reserva.
- Cancelamento de reserva.

### Tarefas Principais

- Implementar tema visual.
- Criar navegacao.
- Integrar API.
- Implementar armazenamento de token.
- Criar estados de loading, erro e vazio.
- Testar fluxo completo no mobile.

### Prioridade

Muito alta.

### Criterio de Conclusao

Cliente consegue criar conta, entrar, escolher servico, barbeiro, horario e confirmar reserva pelo app.

## 9. Semana 6 - Painel Admin e Area do Barbeiro

### Objetivo

Permitir operacao real pela equipe da barbearia.

### Entregas

Painel admin:
- Dashboard.
- Agenda geral.
- Detalhes da reserva.
- Servicos.
- Barbeiros.
- Clientes.
- Horarios e bloqueios.
- Configuracoes basicas.

Area do barbeiro:
- Login.
- Agenda do dia.
- Detalhes do atendimento.
- Marcar concluido.
- Marcar nao compareceu.
- Historico simples.

### Tarefas Principais

- Finalizar dashboard admin.
- Integrar agenda geral.
- Integrar listagem de clientes.
- Implementar acoes administrativas.
- Criar area do barbeiro.
- Testar permissoes.

### Prioridade

Alta.

### Criterio de Conclusao

Admin controla a agenda e barbeiro acompanha os atendimentos do dia.

## 10. Semana 7 - Notificacoes, Testes e Beta Fechado

### Objetivo

Estabilizar o MVP e validar com usuarios reais.

### Entregas

Notificacoes:
- Confirmacao de reserva.
- Cancelamento de reserva.
- Lembrete simples, se viavel.

Testes:
- Testes de backend.
- Testes de fluxo mobile.
- Testes do painel admin.
- Testes de permissao.
- Testes com barbearia real.

Beta:
- Grupo pequeno de clientes.
- 1 dono/gerente.
- 1 ou 2 barbeiros.

### Tarefas Principais

- Configurar envio de e-mail.
- Criar mensagens de notificacao.
- Revisar textos.
- Corrigir bugs.
- Validar com usuarios reais.
- Registrar feedback.
- Ajustar fluxo de agendamento.

### Prioridade

Alta.

### Criterio de Conclusao

MVP funciona em beta fechado com usuarios reais e sem erros criticos.

## 11. Semana 8 - Producao e Publicacao Beta

### Objetivo

Colocar o MVP em ambiente de producao e preparar publicacao.

### Entregas

Infraestrutura:
- Backend em producao.
- Banco de producao.
- Painel admin publicado.
- Dominio configurado.
- SSL ativo.
- Backup ativo.
- Logs e monitoramento.

Mobile:
- Build Android.
- Build iOS, se estiver no escopo.
- Testes finais em dispositivos reais.

Publicacao:
- Politica de privacidade.
- Termos de uso.
- Icone.
- Screenshots.
- Descricao curta.
- Descricao completa.
- Teste interno Google Play.
- TestFlight, se houver iOS.

### Tarefas Principais

- Configurar ambiente de producao.
- Configurar variaveis de ambiente.
- Configurar backup.
- Configurar monitoramento.
- Gerar build mobile.
- Rodar checklist final.
- Publicar beta.

### Prioridade

Muito alta.

### Criterio de Conclusao

App esta em beta operacional, com painel funcionando e usuarios reais podendo agendar.

## 12. Marcos do Projeto

Marco 1:
Projeto configurado e banco criado.

Marco 2:
Login e permissoes funcionando.

Marco 3:
Admin cadastra servicos, barbeiros e horarios.

Marco 4:
Agenda cria reservas sem conflito.

Marco 5:
Cliente agenda pelo app.

Marco 6:
Admin e barbeiro operam agenda.

Marco 7:
Beta fechado validado.

Marco 8:
Producao e beta publicado.

## 13. Riscos Principais

Agenda:
Maior risco tecnico. Precisa impedir conflito de horario.

Escopo:
Adicionar pagamentos, assinaturas e loja cedo demais pode atrasar o MVP.

Design:
Telas bonitas mas pouco praticas podem prejudicar uso real.

Publicacao:
App Store e Google Play podem exigir ajustes de politica, permissao ou conteudo.

Operacao:
Se a barbearia nao usar o painel corretamente, a agenda perde confiabilidade.

## 14. Como Reduzir Riscos

- Testar agenda cedo.
- Validar fluxo com cliente real antes de finalizar design.
- Comecar sem pagamentos online no MVP, se o prazo for curto.
- Usar regras simples de cancelamento.
- Treinar dono e barbeiros antes do beta.
- Fazer beta com poucos usuarios antes de abrir para todos.

## 15. Priorizacao Geral

Obrigatorio:
- Login.
- Servicos.
- Barbeiros.
- Horarios.
- Disponibilidade.
- Reserva.
- Cancelamento.
- Admin.
- Area do barbeiro.

Importante:
- Historico.
- Perfil.
- Notificacoes simples.
- Dashboard basico.

Pode esperar:
- Pagamentos.
- Assinaturas.
- Fidelidade.
- Loja.
- Comissoes avancadas.
- Relatorios avancados.
- WhatsApp automatico.

## 16. Checklist de Encerramento do MVP

- App cliente funcionando.
- Painel admin funcionando.
- Area do barbeiro funcionando.
- Agenda sem conflito.
- Reservas funcionando.
- Cancelamento funcionando.
- Servicos cadastraveis.
- Barbeiros cadastraveis.
- Horarios configuraveis.
- Notificacoes simples funcionando.
- Testes com usuarios reais feitos.
- Bugs criticos corrigidos.
- Ambiente de producao pronto.
- Backup ativo.
- Politica de privacidade publicada.
- Termos de uso publicados.

## 17. Proxima Etapa

Depois do cronograma, o proximo passo e criar uma especificacao tecnica mais detalhada da arquitetura:

- Diagrama de arquitetura.
- Estrutura de pastas.
- Endpoints da API.
- Modelo de banco.
- Regras de permissoes.
- Fluxo de autenticacao.
- Fluxo de reserva.
