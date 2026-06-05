# Especificacao dos Endpoints da API - MVP Barbearia

## 1. Objetivo

Este documento detalha os endpoints da API do MVP.

Inclui:

- Rotas.
- Metodos HTTP.
- Permissoes.
- Payloads.
- Respostas.
- Erros comuns.

Base URL sugerida:

```text
/api/v1
```

## 2. Padroes Gerais

### Autenticacao

Rotas protegidas devem receber token no header:

```text
Authorization: Bearer {token}
```

### Formato de Resposta de Sucesso

```json
{
  "data": {},
  "message": "Operacao realizada com sucesso"
}
```

### Formato de Erro

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem clara para o usuario ou sistema"
  }
}
```

### Erros Comuns

```text
400 BAD_REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT_FOUND
409 CONFLICT
422 UNPROCESSABLE_ENTITY
500 INTERNAL_SERVER_ERROR
```

## 3. Auth

### POST /auth/register

Objetivo:
Criar conta de cliente.

Permissao:
Publica.

Payload:

```json
{
  "name": "Joao Silva",
  "email": "joao@email.com",
  "phone": "+5511999999999",
  "password": "senha_segura"
}
```

Resposta:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Joao Silva",
      "email": "joao@email.com",
      "phone": "+5511999999999",
      "role": "client"
    },
    "token": "jwt_token"
  },
  "message": "Conta criada com sucesso"
}
```

Erros:
- 409: e-mail ja cadastrado.
- 422: dados invalidos.

### POST /auth/login

Objetivo:
Autenticar usuario.

Permissao:
Publica.

Payload:

```json
{
  "email": "admin@email.com",
  "password": "senha"
}
```

Resposta:

```json
{
  "data": {
    "user": {
      "id": "uuid",
      "name": "Admin",
      "email": "admin@email.com",
      "role": "admin"
    },
    "token": "jwt_token"
  },
  "message": "Login realizado com sucesso"
}
```

Erros:
- 401: credenciais invalidas.
- 403: usuario inativo.

### POST /auth/forgot-password

Objetivo:
Solicitar recuperacao de senha.

Permissao:
Publica.

Payload:

```json
{
  "email": "cliente@email.com"
}
```

Resposta:

```json
{
  "data": null,
  "message": "Se o e-mail existir, enviaremos instrucoes"
}
```

Observacao:
Por seguranca, nao informar se o e-mail existe.

### GET /auth/me

Objetivo:
Retornar usuario autenticado.

Permissao:
Usuario autenticado.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Joao Silva",
    "email": "joao@email.com",
    "phone": "+5511999999999",
    "role": "client"
  },
  "message": "Usuario autenticado"
}
```

## 4. Users

### GET /users/me

Objetivo:
Buscar perfil do usuario logado.

Permissao:
Usuario autenticado.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Joao Silva",
    "email": "joao@email.com",
    "phone": "+5511999999999",
    "role": "client"
  }
}
```

### PATCH /users/me

Objetivo:
Atualizar dados basicos do usuario logado.

Permissao:
Usuario autenticado.

Payload:

```json
{
  "name": "Joao Souza",
  "phone": "+5511888888888"
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Joao Souza",
    "phone": "+5511888888888"
  },
  "message": "Perfil atualizado"
}
```

## 5. Services

### GET /services

Objetivo:
Listar servicos.

Permissao:
Usuario autenticado.

Regras:
- Cliente ve apenas servicos ativos.
- Admin pode ver todos, se usar query `includeInactive=true`.

Query opcional:

```text
?includeInactive=true
```

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Corte",
      "description": "Corte masculino",
      "price": 50.0,
      "durationMinutes": 30,
      "isActive": true
    }
  ]
}
```

### POST /services

Objetivo:
Criar servico.

Permissao:
Admin.

Payload:

```json
{
  "name": "Barba",
  "description": "Modelagem de barba",
  "price": 40.0,
  "durationMinutes": 30,
  "isActive": true
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Barba",
    "price": 40.0,
    "durationMinutes": 30,
    "isActive": true
  },
  "message": "Servico criado"
}
```

Erros:
- 403: sem permissao.
- 422: preco ou duracao invalida.

### PATCH /services/:id

Objetivo:
Editar servico.

Permissao:
Admin.

Payload:

```json
{
  "name": "Corte Premium",
  "price": 70.0,
  "durationMinutes": 45,
  "isActive": true
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Corte Premium",
    "price": 70.0
  },
  "message": "Servico atualizado"
}
```

### DELETE /services/:id

Objetivo:
Desativar servico.

Permissao:
Admin.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "isActive": false
  },
  "message": "Servico desativado"
}
```

Observacao:
Usar exclusao logica, nao apagar fisicamente.

## 6. Barbers

### GET /barbers

Objetivo:
Listar barbeiros.

Permissao:
Usuario autenticado.

Regras:
- Cliente ve apenas ativos.
- Admin pode ver todos.

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "publicName": "Marcos",
      "specialty": "Corte degradê",
      "photoUrl": null,
      "isActive": true
    }
  ]
}
```

### POST /barbers

Objetivo:
Criar barbeiro.

Permissao:
Admin.

Payload:

```json
{
  "name": "Marcos Lima",
  "email": "marcos@email.com",
  "phone": "+5511999990000",
  "password": "senha_inicial",
  "publicName": "Marcos",
  "specialty": "Corte degradê",
  "isActive": true
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "publicName": "Marcos",
    "specialty": "Corte degradê",
    "isActive": true
  },
  "message": "Barbeiro criado"
}
```

Erros:
- 409: e-mail ja cadastrado.
- 422: dados invalidos.

### PATCH /barbers/:id

Objetivo:
Editar barbeiro.

Permissao:
Admin.

Payload:

```json
{
  "publicName": "Marcos",
  "specialty": "Barba e corte",
  "isActive": true
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "publicName": "Marcos",
    "specialty": "Barba e corte"
  },
  "message": "Barbeiro atualizado"
}
```

### DELETE /barbers/:id

Objetivo:
Desativar barbeiro.

Permissao:
Admin.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "isActive": false
  },
  "message": "Barbeiro desativado"
}
```

## 7. Schedules

### GET /schedules/business-hours

Objetivo:
Listar horarios gerais da barbearia.

Permissao:
Admin.

Resposta:

```json
{
  "data": [
    {
      "weekday": 1,
      "opensAt": "09:00",
      "closesAt": "19:00",
      "isActive": true
    }
  ]
}
```

### PUT /schedules/business-hours

Objetivo:
Atualizar horarios gerais.

Permissao:
Admin.

Payload:

```json
{
  "hours": [
    {
      "weekday": 1,
      "opensAt": "09:00",
      "closesAt": "19:00",
      "isActive": true
    }
  ]
}
```

Resposta:

```json
{
  "data": [],
  "message": "Horarios atualizados"
}
```

### GET /schedules/barbers/:barberId/working-hours

Objetivo:
Listar horarios de um barbeiro.

Permissao:
Admin ou barbeiro dono do horario.

Resposta:

```json
{
  "data": [
    {
      "weekday": 1,
      "startsAt": "09:00",
      "endsAt": "18:00",
      "isActive": true
    }
  ]
}
```

### PUT /schedules/barbers/:barberId/working-hours

Objetivo:
Atualizar horarios do barbeiro.

Permissao:
Admin.

Payload:

```json
{
  "hours": [
    {
      "weekday": 1,
      "startsAt": "09:00",
      "endsAt": "18:00",
      "isActive": true
    }
  ]
}
```

Resposta:

```json
{
  "data": [],
  "message": "Horario do barbeiro atualizado"
}
```

### GET /schedules/availability

Objetivo:
Consultar horarios disponiveis.

Permissao:
Usuario autenticado.

Query:

```text
?barberId=uuid&serviceId=uuid&date=2026-06-10
```

Resposta:

```json
{
  "data": {
    "date": "2026-06-10",
    "barberId": "uuid",
    "serviceId": "uuid",
    "availableSlots": [
      "09:00",
      "09:30",
      "10:00"
    ]
  }
}
```

Erros:
- 404: barbeiro ou servico nao encontrado.
- 422: data invalida.

### POST /schedules/blocks

Objetivo:
Criar bloqueio de horario.

Permissao:
Admin.

Payload:

```json
{
  "barberId": "uuid",
  "date": "2026-06-10",
  "startsAt": "13:00",
  "endsAt": "15:00",
  "reason": "Compromisso"
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "date": "2026-06-10",
    "startsAt": "13:00",
    "endsAt": "15:00"
  },
  "message": "Bloqueio criado"
}
```

### DELETE /schedules/blocks/:id

Objetivo:
Remover bloqueio.

Permissao:
Admin.

Resposta:

```json
{
  "data": null,
  "message": "Bloqueio removido"
}
```

## 8. Bookings

### POST /bookings

Objetivo:
Criar reserva.

Permissao:
Cliente.

Payload:

```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "date": "2026-06-10",
  "startsAt": "09:00"
}
```

Processo:
- Validar servico ativo.
- Validar barbeiro ativo.
- Calcular endsAt.
- Validar horario.
- Validar conflito.
- Criar reserva.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "service": {
      "id": "uuid",
      "name": "Corte"
    },
    "barber": {
      "id": "uuid",
      "publicName": "Marcos"
    },
    "date": "2026-06-10",
    "startsAt": "09:00",
    "endsAt": "09:30",
    "status": "scheduled",
    "priceSnapshot": 50.0
  },
  "message": "Reserva criada"
}
```

Erros:
- 409: horario indisponivel.
- 422: data ou horario invalido.

### GET /bookings/my

Objetivo:
Listar reservas do cliente logado.

Permissao:
Cliente.

Query opcional:

```text
?status=scheduled
```

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "serviceName": "Corte",
      "barberName": "Marcos",
      "date": "2026-06-10",
      "startsAt": "09:00",
      "status": "scheduled",
      "priceSnapshot": 50.0
    }
  ]
}
```

### GET /bookings/:id

Objetivo:
Buscar detalhes da reserva.

Permissao:
- Cliente dono da reserva.
- Barbeiro responsavel.
- Admin.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "client": {
      "id": "uuid",
      "name": "Joao"
    },
    "service": {
      "id": "uuid",
      "name": "Corte"
    },
    "barber": {
      "id": "uuid",
      "publicName": "Marcos"
    },
    "date": "2026-06-10",
    "startsAt": "09:00",
    "endsAt": "09:30",
    "status": "scheduled",
    "priceSnapshot": 50.0
  }
}
```

### PATCH /bookings/:id/cancel

Objetivo:
Cancelar reserva.

Permissao:
- Cliente dono da reserva, dentro do prazo.
- Admin.

Payload:

```json
{
  "reason": "Nao poderei comparecer"
}
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "status": "canceled"
  },
  "message": "Reserva cancelada"
}
```

Erros:
- 403: sem permissao.
- 422: prazo de cancelamento expirado.

### PATCH /bookings/:id/complete

Objetivo:
Marcar atendimento como concluido.

Permissao:
- Admin.
- Barbeiro responsavel.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "status": "completed"
  },
  "message": "Atendimento concluido"
}
```

### PATCH /bookings/:id/no-show

Objetivo:
Marcar cliente como nao compareceu.

Permissao:
- Admin.
- Barbeiro responsavel.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "status": "no_show"
  },
  "message": "Nao comparecimento registrado"
}
```

### GET /bookings/admin

Objetivo:
Listar agenda geral.

Permissao:
Admin.

Query:

```text
?date=2026-06-10&barberId=uuid&status=scheduled
```

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "clientName": "Joao",
      "barberName": "Marcos",
      "serviceName": "Corte",
      "date": "2026-06-10",
      "startsAt": "09:00",
      "status": "scheduled"
    }
  ]
}
```

### GET /bookings/barber/me

Objetivo:
Listar agenda do barbeiro logado.

Permissao:
Barbeiro.

Query:

```text
?date=2026-06-10
```

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "clientName": "Joao",
      "serviceName": "Corte",
      "date": "2026-06-10",
      "startsAt": "09:00",
      "endsAt": "09:30",
      "status": "scheduled"
    }
  ]
}
```

## 9. Clients

### GET /clients

Objetivo:
Listar clientes.

Permissao:
Admin.

Query opcional:

```text
?search=joao
```

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Joao",
      "email": "joao@email.com",
      "phone": "+5511999999999",
      "bookingsCount": 3,
      "lastBookingAt": "2026-06-01"
    }
  ]
}
```

### GET /clients/:id

Objetivo:
Ver detalhes do cliente.

Permissao:
Admin.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Joao",
    "email": "joao@email.com",
    "phone": "+5511999999999",
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

### GET /clients/:id/bookings

Objetivo:
Listar reservas do cliente.

Permissao:
Admin.

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "serviceName": "Corte",
      "barberName": "Marcos",
      "date": "2026-06-10",
      "status": "completed"
    }
  ]
}
```

## 10. Notifications

### GET /notifications

Objetivo:
Listar notificacoes do usuario logado.

Permissao:
Usuario autenticado.

Resposta:

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Reserva confirmada",
      "message": "Seu horario foi reservado.",
      "channel": "internal",
      "status": "pending",
      "createdAt": "2026-06-01T10:00:00Z"
    }
  ]
}
```

### PATCH /notifications/:id/read

Objetivo:
Marcar notificacao como lida.

Permissao:
Usuario dono da notificacao.

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "status": "read"
  },
  "message": "Notificacao marcada como lida"
}
```

## 11. Settings

### GET /settings

Objetivo:
Buscar configuracoes publicas da barbearia.

Permissao:
Publica ou usuario autenticado.

Resposta:

```json
{
  "data": {
    "businessName": "Barbearia Prime",
    "phone": "+5511999999999",
    "address": "Rua Exemplo, 123",
    "cancellationLimitMinutes": 120,
    "defaultSlotIntervalMinutes": 30,
    "cancellationPolicyText": "Cancelamentos ate 2 horas antes."
  }
}
```

### PATCH /settings

Objetivo:
Atualizar configuracoes da barbearia.

Permissao:
Admin.

Payload:

```json
{
  "businessName": "Barbearia Prime",
  "phone": "+5511999999999",
  "address": "Rua Exemplo, 123",
  "cancellationLimitMinutes": 120,
  "defaultSlotIntervalMinutes": 30,
  "cancellationPolicyText": "Cancelamentos ate 2 horas antes."
}
```

Resposta:

```json
{
  "data": {
    "businessName": "Barbearia Prime"
  },
  "message": "Configuracoes atualizadas"
}
```

## 12. Codigos de Erro Sugeridos

```text
AUTH_INVALID_CREDENTIALS
AUTH_USER_INACTIVE
AUTH_TOKEN_MISSING
AUTH_TOKEN_INVALID
PERMISSION_DENIED
USER_EMAIL_ALREADY_EXISTS
SERVICE_NOT_FOUND
SERVICE_INACTIVE
BARBER_NOT_FOUND
BARBER_INACTIVE
BOOKING_NOT_FOUND
BOOKING_SLOT_UNAVAILABLE
BOOKING_CANCEL_LIMIT_EXPIRED
SCHEDULE_OUTSIDE_BUSINESS_HOURS
SCHEDULE_OUTSIDE_BARBER_HOURS
SCHEDULE_BLOCKED
VALIDATION_ERROR
INTERNAL_ERROR
```

## 13. Proxima Etapa

Depois desta especificacao, o proximo passo e criar:

- Contrato OpenAPI/Swagger.
- Schema ORM ou migrations SQL.
- Checklist de implementacao por endpoint.
