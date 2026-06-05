# Especificacao Tecnica da Arquitetura - Aplicativo de Barbearia

## 1. Objetivo

Este documento define a arquitetura tecnica inicial do MVP do aplicativo de barbearia.

Ele cobre:

- Visao geral da arquitetura.
- Componentes do sistema.
- Estrutura recomendada.
- Modelo de banco de dados.
- Endpoints da API.
- Permissoes.
- Fluxo tecnico de agendamento.
- Regras de seguranca.
- Ambientes.

## 2. Visao Geral da Arquitetura

O MVP sera composto por quatro partes principais:

1. App mobile do cliente.
2. Area do barbeiro.
3. Painel administrativo web.
4. Backend/API com banco de dados.

Arquitetura recomendada:

```text
Cliente Mobile
   |
   | HTTPS
   v
Backend/API  <---->  Banco de Dados PostgreSQL
   ^
   | HTTPS
   |
Painel Admin Web
   ^
   | HTTPS
   |
Area do Barbeiro
```

Servicos externos futuros:

```text
Backend/API
   |-- E-mail transacional
   |-- Push notification
   |-- WhatsApp API
   |-- Gateway de pagamento
   |-- Storage de imagens
   |-- Monitoramento de erros
```

## 3. Stack Recomendada

Mobile:
- Flutter.

Painel administrativo:
- Next.js.

Backend:
- Node.js com NestJS.

Banco de dados:
- PostgreSQL.

Autenticacao:
- JWT no backend ou Supabase/Firebase Auth.

Hospedagem:
- Backend: Render, Railway, Fly.io, AWS, GCP ou Azure.
- Painel: Vercel.
- Banco: Supabase, Neon, Railway, Render, AWS RDS ou similar.

Monitoramento:
- Sentry.

E-mail:
- Resend, SendGrid ou Amazon SES.

## 4. Componentes do Sistema

### App Mobile Cliente

Responsabilidades:
- Cadastro e login.
- Exibir servicos.
- Exibir barbeiros.
- Consultar disponibilidade.
- Criar reserva.
- Listar reservas.
- Cancelar reserva.
- Editar perfil.

### Area do Barbeiro

Pode ser implementada no proprio app mobile ou como tela web responsiva.

Responsabilidades:
- Login do barbeiro.
- Visualizar agenda do dia.
- Ver detalhes do atendimento.
- Marcar atendimento como concluido.
- Marcar nao comparecimento.

### Painel Administrativo Web

Responsabilidades:
- Gerenciar servicos.
- Gerenciar barbeiros.
- Gerenciar horarios.
- Gerenciar bloqueios.
- Visualizar clientes.
- Visualizar agenda geral.
- Cancelar ou atualizar reservas.
- Configurar dados basicos da barbearia.

### Backend/API

Responsabilidades:
- Autenticacao.
- Controle de permissoes.
- Regras de negocio.
- Calculo de disponibilidade.
- Criacao e cancelamento de reservas.
- Persistencia dos dados.
- Notificacoes.
- Logs e auditoria basica.

### Banco de Dados

Responsabilidades:
- Armazenar usuarios.
- Armazenar clientes.
- Armazenar barbeiros.
- Armazenar servicos.
- Armazenar horarios.
- Armazenar reservas.
- Armazenar notificacoes.

## 5. Estrutura Recomendada de Pastas

### Backend

```text
backend/
  src/
    modules/
      auth/
      users/
      clients/
      barbers/
      services/
      schedules/
      bookings/
      notifications/
      admin/
    common/
      guards/
      decorators/
      filters/
      validators/
    database/
      migrations/
      seeds/
    main.ts
```

### App Mobile

```text
mobile/
  lib/
    core/
      theme/
      routes/
      http/
      storage/
    features/
      auth/
      home/
      services/
      barbers/
      booking/
      reservations/
      profile/
      barber_area/
    shared/
      widgets/
      models/
```

### Painel Admin

```text
admin-web/
  src/
    app/
    components/
    features/
      auth/
      dashboard/
      bookings/
      services/
      barbers/
      clients/
      schedules/
      settings/
    lib/
      api/
      auth/
      utils/
```

## 6. Modelo de Banco de Dados

### users

Campos:
- id.
- name.
- email.
- phone.
- password_hash.
- role: client, barber, admin.
- is_active.
- created_at.
- updated_at.

Regras:
- email unico.
- role obrigatorio.
- senha sempre criptografada.

### clients

Campos:
- id.
- user_id.
- notes.
- created_at.
- updated_at.

Relacionamentos:
- client pertence a user.
- client possui muitas bookings.

### barbers

Campos:
- id.
- user_id.
- public_name.
- specialty.
- photo_url.
- is_active.
- created_at.
- updated_at.

Relacionamentos:
- barber pertence a user.
- barber possui muitas bookings.
- barber possui horarios de trabalho.
- barber possui bloqueios.

### services

Campos:
- id.
- name.
- description.
- price.
- duration_minutes.
- is_active.
- created_at.
- updated_at.

Regras:
- price >= 0.
- duration_minutes > 0.
- servico inativo nao aparece para cliente.

### business_hours

Campos:
- id.
- weekday.
- opens_at.
- closes_at.
- is_active.
- created_at.
- updated_at.

Uso:
- Define horario geral da barbearia.

### barber_working_hours

Campos:
- id.
- barber_id.
- weekday.
- starts_at.
- ends_at.
- is_active.
- created_at.
- updated_at.

Uso:
- Define horario individual do barbeiro.

### schedule_blocks

Campos:
- id.
- barber_id.
- date.
- starts_at.
- ends_at.
- reason.
- created_at.
- updated_at.

Uso:
- Bloqueia horarios especificos.
- Pode bloquear barbeiro especifico.

### bookings

Campos:
- id.
- client_id.
- barber_id.
- service_id.
- date.
- starts_at.
- ends_at.
- status.
- price_snapshot.
- cancel_reason.
- created_at.
- updated_at.

Status:
- scheduled.
- confirmed.
- completed.
- canceled.
- no_show.

Regras:
- price_snapshot guarda o preco no momento da reserva.
- ends_at e calculado pela duracao do servico.
- nao pode haver conflito de horario para o mesmo barbeiro.

### notifications

Campos:
- id.
- user_id.
- type.
- title.
- message.
- channel.
- status.
- created_at.
- read_at.

Canais:
- internal.
- email.
- push.
- whatsapp.

## 7. Regras de Permissao

### Cliente

Pode:
- Criar conta.
- Fazer login.
- Ver servicos ativos.
- Ver barbeiros ativos.
- Consultar disponibilidade.
- Criar reserva propria.
- Ver reservas proprias.
- Cancelar reserva propria dentro da regra.
- Editar perfil proprio.

Nao pode:
- Ver reservas de outros clientes.
- Criar servicos.
- Editar barbeiros.
- Acessar painel admin.
- Alterar status para concluido ou no_show.

### Barbeiro

Pode:
- Fazer login.
- Ver sua agenda.
- Ver detalhes dos seus atendimentos.
- Marcar atendimento proprio como concluido.
- Marcar cliente como nao compareceu.
- Ver historico proprio.

Nao pode:
- Ver agenda de outros barbeiros.
- Editar servicos.
- Editar precos.
- Criar barbeiros.
- Alterar configuracoes da barbearia.

### Admin

Pode:
- Acessar painel.
- Gerenciar servicos.
- Gerenciar barbeiros.
- Gerenciar clientes.
- Gerenciar horarios.
- Gerenciar bloqueios.
- Ver agenda geral.
- Cancelar reservas.
- Marcar reservas como concluidas.
- Marcar no_show.
- Configurar politica de cancelamento.

Nao deve:
- Alterar senha de cliente sem fluxo apropriado.
- Expor dados sensiveis desnecessarios.

## 8. Endpoints da API

Base:

```text
/api/v1
```

### Auth

```text
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

### Users

```text
GET   /users/me
PATCH /users/me
GET   /users
GET   /users/:id
```

Permissao:
- /users/me: usuario autenticado.
- /users e /users/:id: admin.

### Services

```text
GET    /services
GET    /services/:id
POST   /services
PATCH  /services/:id
DELETE /services/:id
```

Regras:
- GET /services para cliente retorna apenas ativos.
- Criar, editar e desativar apenas admin.
- DELETE pode ser desativacao logica.

### Barbers

```text
GET    /barbers
GET    /barbers/:id
POST   /barbers
PATCH  /barbers/:id
DELETE /barbers/:id
```

Regras:
- Cliente ve apenas barbeiros ativos.
- Admin ve todos.

### Schedules

```text
GET   /schedules/business-hours
PUT   /schedules/business-hours
GET   /schedules/barbers/:barberId/working-hours
PUT   /schedules/barbers/:barberId/working-hours
GET   /schedules/availability
POST  /schedules/blocks
DELETE /schedules/blocks/:id
```

Exemplo de disponibilidade:

```text
GET /schedules/availability?barberId=1&serviceId=2&date=2026-06-10
```

### Bookings

```text
POST  /bookings
GET   /bookings/my
GET   /bookings/:id
PATCH /bookings/:id/cancel
PATCH /bookings/:id/complete
PATCH /bookings/:id/no-show
GET   /bookings/admin
GET   /bookings/barber/me
```

Regras:
- Cliente cria e cancela propria reserva.
- Barbeiro lista sua agenda.
- Admin lista agenda geral.
- Complete e no-show podem ser admin ou barbeiro responsavel.

### Clients

```text
GET /clients
GET /clients/:id
GET /clients/:id/bookings
```

Permissao:
- Admin.

### Notifications

```text
GET   /notifications
PATCH /notifications/:id/read
```

Permissao:
- Usuario ve apenas suas notificacoes.

### Settings

```text
GET   /settings
PATCH /settings
```

Permissao:
- GET pode ser publico ou autenticado.
- PATCH apenas admin.

## 9. Fluxo Tecnico de Agendamento

### Consulta de Disponibilidade

Entrada:
- service_id.
- barber_id.
- date.

Processo:

1. Buscar servico.
2. Validar se servico esta ativo.
3. Buscar barbeiro.
4. Validar se barbeiro esta ativo.
5. Verificar horario da barbearia no dia da semana.
6. Verificar horario individual do barbeiro.
7. Buscar bloqueios na data.
8. Buscar reservas existentes do barbeiro na data.
9. Gerar blocos de horarios possiveis.
10. Remover horarios que conflitam com reservas.
11. Remover horarios que conflitam com bloqueios.
12. Retornar horarios disponiveis.

Saida:

```json
{
  "date": "2026-06-10",
  "serviceId": "service_id",
  "barberId": "barber_id",
  "availableSlots": [
    "09:00",
    "09:30",
    "10:00"
  ]
}
```

### Criacao de Reserva

Entrada:
- client_id pelo token.
- service_id.
- barber_id.
- date.
- starts_at.

Processo:

1. Validar usuario cliente.
2. Buscar servico ativo.
3. Buscar barbeiro ativo.
4. Calcular ends_at.
5. Validar data futura.
6. Validar horario da barbearia.
7. Validar horario do barbeiro.
8. Validar bloqueios.
9. Validar conflitos com reservas existentes.
10. Criar reserva com status scheduled ou confirmed.
11. Salvar price_snapshot.
12. Criar notificacao interna.
13. Enviar e-mail, se configurado.

Saida:

```json
{
  "id": "booking_id",
  "status": "scheduled",
  "date": "2026-06-10",
  "startsAt": "09:00",
  "endsAt": "09:30"
}
```

### Regra de Conflito

Duas reservas conflitam quando:

```text
nova_inicio < reserva_existente_fim
E
nova_fim > reserva_existente_inicio
```

Considerar apenas reservas com status:
- scheduled.
- confirmed.

Nao considerar como bloqueio:
- canceled.
- no_show.

Completed tambem nao deve conflitar para novas reservas futuras, mas normalmente sera de horarios passados.

## 10. Fluxo Tecnico de Cancelamento

Entrada:
- booking_id.
- usuario autenticado.

Processo:

1. Buscar reserva.
2. Validar permissao.
3. Se cliente, validar se reserva pertence a ele.
4. Se cliente, validar prazo minimo de cancelamento.
5. Se admin, permitir cancelamento.
6. Alterar status para canceled.
7. Salvar motivo, se informado.
8. Criar notificacao.
9. Enviar aviso, se configurado.

Regra sugerida:
- Cliente pode cancelar ate 2 horas antes do horario.

## 11. Fluxo Tecnico da Area do Barbeiro

Agenda do dia:

1. Barbeiro faz login.
2. Backend identifica barber_id ligado ao user_id.
3. Busca reservas do barbeiro na data.
4. Retorna reservas ordenadas por horario.

Concluir atendimento:

1. Barbeiro abre atendimento.
2. Envia acao complete.
3. Backend valida se reserva pertence ao barbeiro.
4. Backend altera status para completed.

Nao comparecimento:

1. Barbeiro abre atendimento.
2. Envia acao no-show.
3. Backend valida se reserva pertence ao barbeiro.
4. Backend altera status para no_show.

## 12. Configuracoes da Barbearia

Tabela ou entidade settings:

Campos sugeridos:
- business_name.
- phone.
- address.
- cancellation_limit_minutes.
- cancellation_policy_text.
- default_slot_interval_minutes.

Valores iniciais:
- cancellation_limit_minutes: 120.
- default_slot_interval_minutes: 30.

## 13. Regras de Seguranca

Obrigatorio:
- HTTPS em producao.
- Senhas com hash seguro.
- Tokens com expiracao.
- Rotas protegidas por autenticacao.
- Permissoes por perfil.
- Validacao de entrada no backend.
- Logs de erros.
- Backup do banco.
- Nao armazenar dados sensiveis desnecessarios.

Recomendado:
- Rate limit em login.
- Auditoria simples em acoes administrativas.
- Sentry para erros.
- Variaveis sensiveis fora do codigo.

## 14. Ambientes

### Desenvolvimento

Uso:
- Programacao local.
- Banco local ou remoto separado.

### Testes/Staging

Uso:
- Validacao antes de producao.
- Testes com equipe e beta fechado.

### Producao

Uso:
- Usuarios reais.
- Banco separado.
- Backup ativo.
- Logs e monitoramento.

## 15. Logs e Monitoramento

Registrar:
- Erros de API.
- Falhas de login.
- Criacao de reserva.
- Cancelamento de reserva.
- Alteracao administrativa.
- Falha de notificacao.

Monitorar:
- API fora do ar.
- Erros frequentes.
- Lentidao na consulta de disponibilidade.
- Falhas de banco.

## 16. Pontos Criticos

Agenda:
- Deve ser testada com cuidado.
- Conflito de horario e o maior risco tecnico.

Permissoes:
- Cliente nao pode acessar reserva de outro cliente.
- Barbeiro nao pode acessar agenda de outro barbeiro.

Cancelamento:
- Regras devem ser claras.
- Status precisa ser atualizado corretamente.

Dados:
- O preco da reserva deve ser salvo como snapshot.
- Alterar preco do servico nao pode mudar reservas ja feitas.

## 17. Proxima Etapa

Com esta arquitetura definida, o proximo passo e detalhar o modelo de banco em formato mais tecnico, incluindo:

- SQL ou schema ORM.
- Tipos de campos.
- Chaves primarias.
- Chaves estrangeiras.
- Indices.
- Constraints.
- Regras de integridade.
