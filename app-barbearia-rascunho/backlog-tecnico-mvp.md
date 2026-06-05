# Backlog Tecnico do MVP - Aplicativo de Barbearia

## 1. Objetivo

Este documento transforma o escopo do MVP em uma lista tecnica de tarefas para desenvolvimento.

Ele organiza o trabalho por areas:

- Planejamento tecnico.
- Banco de dados.
- Backend/API.
- Autenticacao.
- App mobile.
- Area do barbeiro.
- Painel administrativo.
- Agenda.
- Notificacoes.
- Testes.
- Infraestrutura.
- Publicacao.

## 2. Premissas Tecnicas

Stack recomendada para o MVP:

- Mobile: Flutter.
- Painel web: Next.js.
- Backend: Node.js com NestJS.
- Banco de dados: PostgreSQL.
- Autenticacao: JWT ou Supabase Auth/Firebase Auth.
- Hospedagem painel: Vercel.
- Hospedagem backend: Render, Railway, Fly.io ou similar.
- E-mail: Resend, SendGrid ou Amazon SES.
- Monitoramento: Sentry.

Alternativa mais rapida:

- Supabase para autenticacao, banco e storage.
- Flutter para mobile.
- Next.js para painel admin.

## 3. Fase 0 - Preparacao do Projeto

### Produto e Regras

- Revisar escopo do MVP.
- Validar regras de agendamento.
- Definir prazo de cancelamento.
- Definir status de reserva.
- Definir perfis de usuario.
- Definir dados obrigatorios de cliente, barbeiro e servico.

### Repositorio

- Criar repositorio Git.
- Definir estrutura de pastas.
- Criar branch principal.
- Criar branch de desenvolvimento.
- Definir padrao de commits.

### Ambiente

- Configurar ambiente local.
- Configurar variaveis de ambiente.
- Configurar ambiente de testes.
- Configurar ambiente de producao.

Prioridade:
Muito alta.

## 4. Banco de Dados

### Criar Estrutura Inicial

Tarefas:
- Criar tabela de usuarios.
- Criar tabela de clientes.
- Criar tabela de barbeiros.
- Criar tabela de servicos.
- Criar tabela de horarios da barbearia.
- Criar tabela de horarios dos barbeiros.
- Criar tabela de bloqueios de horario.
- Criar tabela de reservas.
- Criar tabela de notificacoes.

### Campos Principais

Usuario:
- id.
- nome.
- e-mail.
- telefone.
- senha_hash ou auth_provider_id.
- tipo.
- criado_em.
- atualizado_em.

Cliente:
- id.
- usuario_id.
- observacoes.
- criado_em.

Barbeiro:
- id.
- usuario_id.
- nome_publico.
- especialidade.
- foto_url.
- ativo.
- criado_em.

Servico:
- id.
- nome.
- descricao.
- preco.
- duracao_minutos.
- ativo.
- criado_em.

Reserva:
- id.
- cliente_id.
- barbeiro_id.
- servico_id.
- data.
- hora_inicio.
- hora_fim.
- status.
- valor.
- criado_em.
- atualizado_em.

### Regras de Banco

- E-mail unico para usuario.
- Reserva deve referenciar cliente, barbeiro e servico.
- Servico deve ter duracao maior que zero.
- Preco nao pode ser negativo.
- Status de reserva deve usar valores controlados.
- Criar indice para busca por barbeiro, data e horario.

Prioridade:
Muito alta.

## 5. Backend/API

### Configuracao Inicial

Tarefas:
- Criar projeto backend.
- Configurar conexao com PostgreSQL.
- Configurar migrations.
- Configurar validacao de dados.
- Configurar tratamento global de erros.
- Configurar logs.
- Configurar CORS.
- Configurar variaveis de ambiente.

### Modulo de Usuarios

Endpoints:
- Criar usuario.
- Buscar usuario logado.
- Atualizar perfil.
- Listar usuarios por tipo, apenas admin.

Regras:
- Cliente so acessa seus dados.
- Barbeiro so acessa dados relacionados a sua agenda.
- Admin acessa toda a operacao.

### Modulo de Autenticacao

Endpoints:
- Cadastro.
- Login.
- Recuperacao de senha.
- Refresh token, se aplicavel.
- Logout, se aplicavel.

Regras:
- Senha deve ser criptografada.
- Token deve conter id e tipo do usuario.
- Rotas protegidas devem validar permissao.

### Modulo de Servicos

Endpoints:
- Listar servicos ativos para clientes.
- Listar todos os servicos para admin.
- Criar servico.
- Editar servico.
- Ativar/desativar servico.

Regras:
- Apenas admin cria ou edita servicos.
- Servico inativo nao aparece no app cliente.

### Modulo de Barbeiros

Endpoints:
- Listar barbeiros ativos.
- Listar todos os barbeiros para admin.
- Criar barbeiro.
- Editar barbeiro.
- Ativar/desativar barbeiro.
- Buscar agenda do barbeiro.

Regras:
- Apenas admin cria ou edita barbeiro.
- Barbeiro inativo nao aparece para cliente.

### Modulo de Horarios

Endpoints:
- Configurar horario da barbearia.
- Configurar horario do barbeiro.
- Criar bloqueio.
- Remover bloqueio.
- Consultar disponibilidade.

Regras:
- Disponibilidade deve considerar horario da barbearia.
- Disponibilidade deve considerar horario do barbeiro.
- Disponibilidade deve considerar bloqueios.
- Disponibilidade deve considerar reservas existentes.

### Modulo de Reservas

Endpoints:
- Criar reserva.
- Listar reservas do cliente.
- Listar reservas do barbeiro.
- Listar agenda geral admin.
- Buscar detalhes da reserva.
- Cancelar reserva.
- Marcar como concluida.
- Marcar como nao compareceu.

Regras:
- Nao permitir conflito de horario.
- Calcular hora_fim com base na duracao do servico.
- Cliente so cancela suas reservas.
- Cliente so cancela dentro do prazo configurado.
- Barbeiro so atualiza reservas dele.
- Admin pode cancelar e atualizar reservas.

### Modulo de Notificacoes

Endpoints:
- Listar notificacoes do usuario.
- Marcar notificacao como lida.

Eventos:
- Reserva criada.
- Reserva cancelada.
- Lembrete antes do horario.

Prioridade:
Alta.

## 6. App Mobile - Cliente

### Configuracao Inicial

Tarefas:
- Criar projeto mobile.
- Configurar tema visual.
- Configurar rotas.
- Configurar cliente HTTP.
- Configurar armazenamento seguro de token.
- Configurar estados de carregamento e erro.

### Telas de Acesso

Tarefas:
- Criar tela inicial.
- Criar tela de login.
- Criar tela de cadastro.
- Criar tela de recuperacao de senha.
- Implementar validacoes.
- Integrar com API de autenticacao.

### Home

Tarefas:
- Criar home do cliente.
- Exibir saudacao.
- Exibir proxima reserva.
- Criar atalhos principais.
- Criar navegacao inferior.

### Agendamento

Tarefas:
- Criar tela de servicos.
- Integrar lista de servicos.
- Criar tela de barbeiros.
- Integrar lista de barbeiros.
- Criar tela de calendario.
- Consultar disponibilidade.
- Criar selecao de horario.
- Criar tela de confirmacao.
- Criar reserva via API.
- Criar tela de sucesso.

### Reservas

Tarefas:
- Criar tela Minhas Reservas.
- Criar detalhes da reserva.
- Implementar cancelamento.
- Mostrar status.
- Mostrar estado vazio.

### Historico

Tarefas:
- Criar tela de historico.
- Listar atendimentos concluidos, cancelados e nao comparecimentos.

### Perfil

Tarefas:
- Criar tela de perfil.
- Editar nome e telefone.
- Implementar logout.

Prioridade:
Muito alta.

## 7. Area do Barbeiro

Pode ser no app mobile ou em uma area web simples.

### Telas

Tarefas:
- Criar login com redirecionamento por perfil.
- Criar agenda do dia.
- Criar seletor de data.
- Criar detalhes do atendimento.
- Implementar marcar como concluido.
- Implementar marcar como nao compareceu.
- Criar historico simples.

### Regras

- Barbeiro ve apenas seus atendimentos.
- Barbeiro nao altera dados financeiros.
- Barbeiro nao edita servicos.

Prioridade:
Alta.

## 8. Painel Administrativo Web

### Configuracao Inicial

Tarefas:
- Criar projeto web.
- Configurar layout base.
- Configurar sidebar.
- Configurar autenticacao.
- Configurar cliente HTTP.
- Proteger rotas admin.

### Dashboard

Tarefas:
- Criar cards de indicadores.
- Mostrar agendamentos do dia.
- Mostrar cancelamentos.
- Mostrar clientes cadastrados.
- Mostrar barbeiros ativos.
- Mostrar proximos atendimentos.

### Agenda Geral

Tarefas:
- Criar tela de agenda.
- Filtro por data.
- Filtro por barbeiro.
- Tabela de reservas.
- Detalhes da reserva.
- Cancelamento admin.
- Marcar concluida.
- Marcar nao compareceu.

### Servicos

Tarefas:
- Listar servicos.
- Criar formulario de servico.
- Editar servico.
- Ativar/desativar servico.
- Validar preco e duracao.

### Barbeiros

Tarefas:
- Listar barbeiros.
- Criar formulario de barbeiro.
- Editar barbeiro.
- Ativar/desativar barbeiro.
- Configurar horarios do barbeiro.

### Clientes

Tarefas:
- Listar clientes.
- Buscar cliente por nome, telefone ou e-mail.
- Ver detalhes do cliente.
- Ver reservas futuras.
- Ver historico.

### Horarios e Bloqueios

Tarefas:
- Configurar horario da barbearia.
- Configurar horario individual.
- Criar bloqueios.
- Remover bloqueios.
- Alertar conflito com reservas existentes.

### Configuracoes

Tarefas:
- Configurar nome da barbearia.
- Configurar telefone.
- Configurar endereco.
- Configurar prazo minimo de cancelamento.
- Configurar texto da politica de cancelamento.

Prioridade:
Muito alta.

## 9. Agenda e Disponibilidade

Esta e a parte mais critica do MVP.

Tarefas:
- Implementar calculo de horarios disponiveis.
- Considerar duracao do servico.
- Considerar horario da barbearia.
- Considerar horario do barbeiro.
- Considerar bloqueios.
- Considerar reservas existentes.
- Impedir conflito na criacao da reserva.
- Revalidar disponibilidade no momento da confirmacao.
- Criar testes para conflitos de horario.

Casos de teste:
- Agendar horario livre.
- Tentar agendar horario ocupado.
- Agendar servico que ocupa mais de um bloco.
- Agendar fora do horario da barbearia.
- Agendar com barbeiro sem expediente.
- Agendar em horario bloqueado.
- Cancelar reserva e liberar horario.

Prioridade:
Muito alta.

## 10. Notificacoes

### MVP

Tarefas:
- Criar registro interno de notificacoes.
- Enviar confirmacao de reserva por e-mail.
- Enviar aviso de cancelamento por e-mail.
- Criar lembrete simples antes do horario, se viavel.

### Futuro

- Push.
- WhatsApp.
- Campanhas automaticas.
- Recuperacao de clientes inativos.

Prioridade:
Media.

## 11. Testes

### Backend

Tarefas:
- Testar cadastro e login.
- Testar permissoes.
- Testar criacao de servicos.
- Testar criacao de barbeiros.
- Testar disponibilidade.
- Testar criacao de reservas.
- Testar cancelamento.
- Testar atualizacao de status.

### Mobile

Tarefas:
- Testar fluxo de cadastro.
- Testar login.
- Testar agendamento completo.
- Testar minhas reservas.
- Testar cancelamento.
- Testar perfil.

### Painel Admin

Tarefas:
- Testar login admin.
- Testar CRUD de servicos.
- Testar CRUD de barbeiros.
- Testar agenda geral.
- Testar configuracao de horarios.

### Testes com Usuarios Reais

Tarefas:
- Testar com dono da barbearia.
- Testar com 1 ou 2 barbeiros.
- Testar com 5 a 10 clientes.
- Registrar problemas.
- Corrigir pontos criticos.

Prioridade:
Alta.

## 12. Infraestrutura

### Ambiente de Desenvolvimento

Tarefas:
- Configurar banco local ou remoto de desenvolvimento.
- Configurar variaveis de ambiente.
- Configurar scripts de start.
- Configurar logs locais.

### Ambiente de Testes

Tarefas:
- Criar banco de testes.
- Publicar backend de testes.
- Publicar painel de testes.
- Configurar app apontando para ambiente de testes.

### Ambiente de Producao

Tarefas:
- Criar banco de producao.
- Publicar backend.
- Publicar painel admin.
- Configurar dominio.
- Configurar SSL.
- Configurar backups.
- Configurar monitoramento.
- Configurar logs.

Prioridade:
Alta.

## 13. Seguranca Basica

Tarefas:
- Criptografar senhas.
- Usar HTTPS.
- Proteger rotas por autenticacao.
- Proteger rotas por permissao.
- Validar dados no backend.
- Sanitizar entradas.
- Nao expor dados sensiveis.
- Configurar CORS corretamente.
- Configurar backup automatico.
- Configurar logs de erro.

Prioridade:
Muito alta.

## 14. Publicacao do MVP

### Antes da Publicacao

Tarefas:
- Revisar textos do app.
- Revisar politica de privacidade.
- Revisar termos de uso.
- Testar app em Android.
- Testar app em iOS, se estiver no escopo.
- Testar painel admin.
- Testar servidor em producao.
- Testar backup.

### Google Play

Tarefas:
- Criar conta Google Play Console.
- Definir nome do app.
- Criar icone.
- Criar screenshots.
- Escrever descricao curta.
- Escrever descricao completa.
- Informar politica de privacidade.
- Configurar classificacao indicativa.
- Enviar build.
- Fazer teste interno.

### Apple App Store

Tarefas:
- Criar conta Apple Developer.
- Criar app no App Store Connect.
- Configurar certificados e provisioning.
- Criar screenshots.
- Escrever descricao.
- Informar politica de privacidade.
- Enviar build.
- Fazer TestFlight.
- Enviar para revisao.

Prioridade:
Media no inicio, alta perto do lancamento.

## 15. Ordem Recomendada de Implementacao

1. Banco de dados.
2. Backend base.
3. Autenticacao.
4. CRUD de servicos.
5. CRUD de barbeiros.
6. Horarios da barbearia e barbeiros.
7. Disponibilidade de agenda.
8. Criacao de reserva.
9. App cliente com fluxo de agendamento.
10. Minhas reservas e cancelamento.
11. Area do barbeiro.
12. Painel admin.
13. Notificacoes simples.
14. Testes.
15. Ambiente de producao.
16. Publicacao.

## 16. Checklist de MVP Pronto

- Cliente consegue criar conta.
- Cliente consegue fazer login.
- Cliente ve servicos.
- Cliente escolhe barbeiro.
- Cliente escolhe data e horario.
- Cliente confirma reserva.
- Sistema impede conflito de agenda.
- Cliente ve reservas futuras.
- Cliente cancela dentro da regra.
- Barbeiro ve agenda do dia.
- Barbeiro conclui atendimento.
- Admin cria servicos.
- Admin cria barbeiros.
- Admin configura horarios.
- Admin ve agenda geral.
- Backup ativo.
- Logs ativos.
- App testado com usuarios reais.

## 17. Proxima Etapa

Com o backlog tecnico definido, o proximo passo e criar um cronograma estimado de desenvolvimento por semanas.

Esse cronograma deve separar:

- Semana 1: setup e banco.
- Semana 2: backend base.
- Semana 3: agenda e reservas.
- Semana 4: app cliente.
- Semana 5: painel admin.
- Semana 6: area do barbeiro e notificacoes.
- Semana 7: testes.
- Semana 8: producao e publicacao beta.
