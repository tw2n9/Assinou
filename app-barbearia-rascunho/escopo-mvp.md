# Escopo do MVP - Aplicativo de Barbearia

## 1. Objetivo do MVP

O MVP tem como objetivo lançar uma primeira versão funcional do aplicativo para validar o uso real por clientes, barbeiros e dono da barbearia.

O foco principal sera permitir que clientes consigam:

- Criar conta.
- Ver servicos disponiveis.
- Escolher barbeiro.
- Agendar horario.
- Receber confirmacao.
- Acompanhar suas reservas.

E permitir que a barbearia consiga:

- Gerenciar servicos.
- Gerenciar barbeiros.
- Visualizar agenda.
- Confirmar atendimentos.
- Controlar clientes de forma basica.

O MVP nao precisa ter todos os recursos avancados. Ele precisa resolver bem o problema central: organizar agendamentos e reduzir atendimento manual.

## 2. Publico do MVP

Clientes:
- Pessoas que ja frequentam a barbearia.
- Novos clientes que querem agendar sem chamar no WhatsApp.
- Clientes recorrentes que escolhem sempre o mesmo barbeiro.

Barbeiros:
- Profissionais que precisam acompanhar sua agenda diaria.
- Barbeiros que precisam saber quais servicos cada cliente marcou.

Dono ou gerente:
- Responsavel por configurar servicos, barbeiros, horarios e acompanhar reservas.

## 3. Funcionalidades Incluidas no MVP

### 3.1 Cadastro e Login

Funcionalidades:
- Cadastro com nome, e-mail, telefone e senha.
- Login com e-mail e senha.
- Recuperacao de senha.
- Logout.

Regras:
- E-mail deve ser unico.
- Telefone deve ser obrigatorio.
- Senha deve ter validacao minima.
- Usuario cliente deve ser criado por padrao.

Prioridade:
Alta.

### 3.2 Perfil do Cliente

Funcionalidades:
- Visualizar dados pessoais.
- Editar nome e telefone.
- Visualizar reservas futuras.
- Visualizar historico simples.

Regras:
- Cliente so pode editar seus proprios dados.
- Dados sensiveis nao devem aparecer para outros clientes.

Prioridade:
Media.

### 3.3 Lista de Servicos

Funcionalidades:
- Exibir servicos cadastrados pela barbearia.
- Mostrar nome, descricao curta, preco e duracao.

Servicos iniciais:
- Corte.
- Barba.
- Sobrancelha.
- Pigmentacao.
- Hidratacao.
- Combo Corte + Barba.

Regras:
- Apenas servicos ativos aparecem para o cliente.
- Cada servico deve ter duracao definida para montar a agenda.
- O preco pode ser alterado pelo admin.

Prioridade:
Alta.

### 3.4 Escolha de Barbeiro

Funcionalidades:
- Listar barbeiros ativos.
- Mostrar nome, foto opcional, especialidade e disponibilidade.
- Permitir escolher qualquer barbeiro disponivel.

Regras:
- Apenas barbeiros ativos aparecem no app.
- Barbeiro precisa ter agenda configurada.
- Se o barbeiro nao estiver disponivel para o servico ou horario, nao deve aparecer como opcao valida.

Prioridade:
Alta.

### 3.5 Agendamento de Horario

Funcionalidades:
- Cliente escolhe servico.
- Cliente escolhe barbeiro.
- Cliente escolhe data.
- Cliente escolhe horario disponivel.
- Cliente confirma reserva.

Regras:
- Nao permitir dois agendamentos no mesmo horario para o mesmo barbeiro.
- Considerar duracao do servico.
- Considerar horarios de funcionamento.
- Considerar bloqueios de horario.
- Permitir agendamento apenas em horarios futuros.
- Confirmacao deve gerar uma reserva com status.

Status de reserva:
- Agendada.
- Confirmada.
- Concluida.
- Cancelada.
- Nao compareceu.

Prioridade:
Muito alta.

### 3.6 Minhas Reservas

Funcionalidades:
- Cliente visualiza reservas futuras.
- Cliente visualiza detalhes da reserva.
- Cliente pode cancelar reserva.

Regras:
- Cancelamento permitido apenas antes de um prazo definido.
- Prazo sugerido: ate 2 horas antes do atendimento.
- No MVP, reagendamento pode ser feito cancelando e criando novo agendamento.

Prioridade:
Alta.

### 3.7 Confirmacao de Horario

Funcionalidades:
- Tela de confirmacao apos agendamento.
- Exibir servico, barbeiro, data, horario e valor.
- Enviar notificacao simples.

Notificacao inicial:
- E-mail ou mensagem interna no app.
- WhatsApp pode ficar para fase futura, se a integracao atrasar o MVP.

Prioridade:
Alta.

### 3.8 Area do Barbeiro

Funcionalidades:
- Login como barbeiro.
- Visualizar agenda do dia.
- Visualizar proximos clientes.
- Ver detalhes do atendimento.
- Marcar atendimento como concluido.
- Marcar cliente como nao compareceu.

Regras:
- Barbeiro so visualiza sua propria agenda.
- Barbeiro nao altera preco de servico.
- Barbeiro nao altera cadastro de outros barbeiros.

Prioridade:
Alta.

### 3.9 Painel Administrativo Basico

Funcionalidades:
- Login de administrador.
- Dashboard simples.
- Visualizar agendamentos do dia.
- Criar, editar e desativar servicos.
- Criar, editar e desativar barbeiros.
- Visualizar clientes cadastrados.
- Cancelar reservas, se necessario.

Regras:
- Apenas admin pode acessar painel administrativo.
- Admin pode visualizar agenda geral.
- Admin pode configurar horarios da barbearia.

Prioridade:
Muito alta.

### 3.10 Gestao de Horarios

Funcionalidades:
- Definir horario de funcionamento da barbearia.
- Definir dias de funcionamento.
- Definir horarios de cada barbeiro.
- Bloquear horarios indisponiveis.

Regras:
- Agenda do cliente deve respeitar os horarios configurados.
- Bloqueios devem impedir novos agendamentos.
- Alterar horario nao deve apagar reservas existentes.

Prioridade:
Alta.

### 3.11 Controle Basico de Clientes

Funcionalidades:
- Lista de clientes.
- Visualizacao de dados basicos.
- Historico simples de atendimentos.
- Quantidade de reservas.

Regras:
- Admin visualiza clientes da barbearia.
- Barbeiro visualiza apenas clientes agendados com ele.

Prioridade:
Media.

### 3.12 Notificacao Simples

Funcionalidades:
- Confirmacao de reserva.
- Lembrete simples antes do atendimento.
- Aviso de cancelamento.

Canais iniciais:
- E-mail.
- Push, se o app mobile ja estiver configurado.

Fora do MVP:
- Automacoes completas por WhatsApp.
- Campanhas promocionais.

Prioridade:
Media.

## 4. Funcionalidades Fora do MVP

Estas funcionalidades devem ficar para versoes futuras:

- Pagamento online completo.
- Pix integrado.
- Cartao de credito.
- Assinaturas recorrentes.
- Programa de fidelidade.
- Loja de produtos.
- Cupons de desconto avancados.
- Indicacao de amigos.
- Cashback.
- Ranking de barbeiros.
- Relatorios financeiros avancados.
- Controle completo de estoque.
- Controle avancado de comissoes.
- Campanhas por WhatsApp.
- Atendimento em domicilio.
- Plano familia.
- Multiunidade.
- Fotos antes e depois.
- Inteligencia para sugerir proximo corte.

## 5. Telas do MVP

### App do Cliente

1. Tela inicial
   - Apresenta a barbearia.
   - Botao para login/cadastro.
   - Botao para agendar.

2. Login
   - E-mail.
   - Senha.
   - Link para recuperar senha.

3. Cadastro
   - Nome.
   - Telefone.
   - E-mail.
   - Senha.

4. Home do Cliente
   - Proxima reserva.
   - Atalho para agendar.
   - Atalho para minhas reservas.

5. Lista de Servicos
   - Nome do servico.
   - Preco.
   - Duracao.
   - Botao selecionar.

6. Escolha de Barbeiro
   - Lista de barbeiros.
   - Especialidade.
   - Disponibilidade.

7. Calendario de Horarios
   - Escolha de data.
   - Horarios disponiveis.

8. Confirmacao de Reserva
   - Servico.
   - Barbeiro.
   - Data.
   - Horario.
   - Valor.
   - Botao confirmar.

9. Minhas Reservas
   - Reservas futuras.
   - Status.
   - Cancelamento.

10. Historico Simples
    - Atendimentos concluidos.
    - Data.
    - Barbeiro.
    - Servico.

11. Perfil
    - Dados pessoais.
    - Editar telefone e nome.
    - Sair da conta.

### Area do Barbeiro

1. Login
2. Agenda do Dia
3. Detalhes do Atendimento
4. Historico de Clientes Atendidos

### Painel Administrativo

1. Login Admin
2. Dashboard
3. Agenda Geral
4. Servicos
5. Barbeiros
6. Clientes
7. Horarios e Bloqueios
8. Configuracoes Basicas

## 6. Regras de Negocio do MVP

Agendamento:
- Um barbeiro nao pode ter dois clientes no mesmo horario.
- O sistema deve considerar a duracao do servico.
- Horarios devem respeitar funcionamento da barbearia e agenda individual do barbeiro.
- Cliente nao pode agendar data passada.
- Cliente so pode cancelar dentro do prazo permitido.

Servicos:
- Cada servico precisa ter nome, preco, duracao e status.
- Servicos inativos nao aparecem para clientes.

Barbeiros:
- Cada barbeiro precisa ter nome, status e horario de trabalho.
- Barbeiros inativos nao aparecem para clientes.

Usuarios:
- Cliente acessa apenas dados proprios.
- Barbeiro acessa apenas sua agenda.
- Admin acessa toda a operacao.

Notificacoes:
- Agendamento confirmado deve gerar aviso.
- Cancelamento deve gerar aviso.
- Lembrete antes do horario e desejavel, mas pode ser simples no inicio.

## 7. Modelo de Dados Inicial

Entidades principais:

Usuario:
- id.
- nome.
- e-mail.
- telefone.
- senha criptografada.
- tipo: cliente, barbeiro ou admin.
- criado em.

Cliente:
- id.
- usuario_id.
- observacoes.
- data de cadastro.

Barbeiro:
- id.
- usuario_id.
- nome publico.
- especialidade.
- foto.
- ativo.

Servico:
- id.
- nome.
- descricao.
- preco.
- duracao em minutos.
- ativo.

HorarioBarbearia:
- id.
- dia da semana.
- hora abertura.
- hora fechamento.
- ativo.

HorarioBarbeiro:
- id.
- barbeiro_id.
- dia da semana.
- hora inicio.
- hora fim.
- ativo.

BloqueioHorario:
- id.
- barbeiro_id.
- data.
- hora inicio.
- hora fim.
- motivo.

Reserva:
- id.
- cliente_id.
- barbeiro_id.
- servico_id.
- data.
- hora inicio.
- hora fim.
- status.
- valor.
- criado em.

Notificacao:
- id.
- usuario_id.
- tipo.
- titulo.
- mensagem.
- status.
- criado em.

## 8. Prioridades do MVP

Prioridade muito alta:
- Login/cadastro.
- Servicos.
- Barbeiros.
- Agendamento.
- Painel admin.
- Agenda geral.

Prioridade alta:
- Minhas reservas.
- Area do barbeiro.
- Gestao de horarios.
- Cancelamento.

Prioridade media:
- Historico simples.
- Notificacao simples.
- Perfil editavel.
- Controle basico de clientes.

Prioridade baixa para MVP:
- Avaliacoes.
- Relatorios simples.
- Filtros avancados.

## 9. Criterios de Sucesso do MVP

O MVP sera considerado valido se:

- Clientes conseguirem criar conta sem ajuda.
- Clientes conseguirem agendar em poucos minutos.
- A barbearia conseguir visualizar e controlar a agenda.
- Barbeiros conseguirem acompanhar seus horarios.
- Nao houver conflito de agenda.
- Cancelamentos forem registrados corretamente.
- A equipe da barbearia reduzir o uso manual de WhatsApp para marcar horarios.

Metricas iniciais:
- Numero de clientes cadastrados.
- Numero de agendamentos realizados.
- Taxa de cancelamento.
- Taxa de nao comparecimento.
- Horarios mais agendados.
- Barbeiros mais escolhidos.
- Servicos mais escolhidos.

## 10. Stack Recomendada Para o MVP

Opcao pratica:

- Mobile: Flutter.
- Painel web: Next.js.
- Backend: Node.js com NestJS.
- Banco de dados: PostgreSQL.
- Autenticacao: JWT ou Supabase Auth.
- Hospedagem backend: Render, Railway ou Fly.io.
- Hospedagem painel: Vercel.
- Storage: Supabase Storage ou Cloudflare R2.
- E-mail: Resend ou SendGrid.
- Monitoramento: Sentry.

Opcao mais rapida para validar:

- Mobile/web inicial com Flutter.
- Backend e banco com Supabase.
- Painel admin em Next.js ou no proprio Flutter Web.

## 11. Entregaveis do MVP

Entregaveis de produto:
- Documento de escopo.
- Regras de negocio.
- Lista de telas.
- Prototipo visual.

Entregaveis de desenvolvimento:
- App cliente.
- Area do barbeiro.
- Painel administrativo.
- API/backend.
- Banco de dados.
- Sistema de autenticacao.
- Agenda funcional.
- Notificacao simples.

Entregaveis de operacao:
- Ambiente de testes.
- Ambiente de producao.
- Backup configurado.
- Politica de privacidade basica.
- Termos de uso basicos.
- Suporte inicial.

## 12. O Que Validar Com Clientes Reais

Perguntas praticas:
- O cliente conseguiu agendar sem pedir ajuda?
- O fluxo de escolha de servico ficou claro?
- O cliente quer escolher barbeiro ou prefere qualquer disponivel?
- A barbearia confia na agenda do sistema?
- O barbeiro consegue usar a agenda durante o dia?
- O cancelamento esta claro?
- O app reduziu mensagens manuais?

## 13. Proxima Etapa

Depois deste escopo, o proximo passo e criar os fluxos e telas do MVP:

1. Fluxo do cliente.
2. Fluxo do barbeiro.
3. Fluxo do administrador.
4. Wireframes das telas.
5. Prototipo visual inicial.

Esses materiais devem ser criados antes do desenvolvimento para evitar retrabalho.
