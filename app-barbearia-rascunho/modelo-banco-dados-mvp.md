# Modelo de Banco de Dados do MVP - Aplicativo de Barbearia

## 1. Objetivo

Este documento detalha o modelo de banco de dados do MVP.

Ele define:

- Tabelas.
- Campos.
- Tipos sugeridos.
- Chaves primarias.
- Chaves estrangeiras.
- Indices.
- Constraints.
- Regras de integridade.

Banco recomendado:
- PostgreSQL.

## 2. Convencoes

Padrao de nomes:
- Tabelas em plural.
- Campos em snake_case.
- IDs em UUID.
- Datas de criacao e atualizacao em timestamp.

Campos padrao recomendados:

```text
id UUID PRIMARY KEY
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE
```

Soft delete:
- Para o MVP, usar `is_active` em usuarios, barbeiros e servicos.
- Evitar apagar registros que tenham historico.

## 3. Tipos Enum

### user_role

Valores:

```text
client
barber
admin
```

### booking_status

Valores:

```text
scheduled
confirmed
completed
canceled
no_show
```

### notification_channel

Valores:

```text
internal
email
push
whatsapp
```

### notification_status

Valores:

```text
pending
sent
read
failed
```

## 4. Tabela users

Objetivo:
Armazenar dados base de login e identificacao dos usuarios.

Campos:

```text
id UUID PRIMARY KEY
name VARCHAR(120) NOT NULL
email VARCHAR(160) NOT NULL UNIQUE
phone VARCHAR(30) NOT NULL
password_hash TEXT NOT NULL
role user_role NOT NULL
is_active BOOLEAN NOT NULL DEFAULT true
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
UNIQUE (email)
INDEX (role)
INDEX (phone)
```

Regras:
- E-mail deve ser unico.
- Senha nunca deve ser salva em texto puro.
- Role define permissao principal.

## 5. Tabela clients

Objetivo:
Armazenar dados complementares do cliente.

Campos:

```text
id UUID PRIMARY KEY
user_id UUID NOT NULL REFERENCES users(id)
notes TEXT NULL
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
UNIQUE (user_id)
```

Regras:
- Cada cliente deve estar vinculado a um usuario.
- Usuario vinculado deve ter role client.

## 6. Tabela barbers

Objetivo:
Armazenar dados profissionais do barbeiro.

Campos:

```text
id UUID PRIMARY KEY
user_id UUID NOT NULL REFERENCES users(id)
public_name VARCHAR(120) NOT NULL
specialty VARCHAR(160) NULL
photo_url TEXT NULL
is_active BOOLEAN NOT NULL DEFAULT true
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
UNIQUE (user_id)
INDEX (is_active)
```

Regras:
- Cada barbeiro deve estar vinculado a um usuario.
- Usuario vinculado deve ter role barber.
- Barbeiro inativo nao aparece para clientes.

## 7. Tabela services

Objetivo:
Armazenar servicos oferecidos pela barbearia.

Campos:

```text
id UUID PRIMARY KEY
name VARCHAR(120) NOT NULL
description TEXT NULL
price NUMERIC(10,2) NOT NULL
duration_minutes INTEGER NOT NULL
is_active BOOLEAN NOT NULL DEFAULT true
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
INDEX (is_active)
INDEX (name)
```

Constraints:

```text
CHECK (price >= 0)
CHECK (duration_minutes > 0)
```

Regras:
- Servico inativo nao aparece no app do cliente.
- Alterar preco do servico nao altera reservas ja feitas.

## 8. Tabela business_hours

Objetivo:
Definir horario geral de funcionamento da barbearia.

Campos:

```text
id UUID PRIMARY KEY
weekday INTEGER NOT NULL
opens_at TIME NOT NULL
closes_at TIME NOT NULL
is_active BOOLEAN NOT NULL DEFAULT true
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
UNIQUE (weekday)
```

Constraints:

```text
CHECK (weekday >= 0 AND weekday <= 6)
CHECK (opens_at < closes_at)
```

Convencao:
- 0 = domingo.
- 1 = segunda.
- 2 = terca.
- 3 = quarta.
- 4 = quinta.
- 5 = sexta.
- 6 = sabado.

## 9. Tabela barber_working_hours

Objetivo:
Definir horario individual de cada barbeiro.

Campos:

```text
id UUID PRIMARY KEY
barber_id UUID NOT NULL REFERENCES barbers(id)
weekday INTEGER NOT NULL
starts_at TIME NOT NULL
ends_at TIME NOT NULL
is_active BOOLEAN NOT NULL DEFAULT true
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
INDEX (barber_id)
INDEX (barber_id, weekday)
```

Constraints:

```text
CHECK (weekday >= 0 AND weekday <= 6)
CHECK (starts_at < ends_at)
```

Regras:
- Horario do barbeiro deve estar dentro do horario da barbearia.
- Essa validacao pode ser feita no backend.

## 10. Tabela schedule_blocks

Objetivo:
Bloquear horarios especificos.

Campos:

```text
id UUID PRIMARY KEY
barber_id UUID NULL REFERENCES barbers(id)
date DATE NOT NULL
starts_at TIME NOT NULL
ends_at TIME NOT NULL
reason VARCHAR(255) NULL
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
INDEX (barber_id, date)
INDEX (date)
```

Constraints:

```text
CHECK (starts_at < ends_at)
```

Regras:
- Se barber_id for nulo, o bloqueio pode representar bloqueio geral da barbearia.
- Bloqueio nao deve apagar reservas existentes.
- Se houver conflito com reserva existente, admin deve receber alerta.

## 11. Tabela bookings

Objetivo:
Armazenar reservas/agendamentos.

Campos:

```text
id UUID PRIMARY KEY
client_id UUID NOT NULL REFERENCES clients(id)
barber_id UUID NOT NULL REFERENCES barbers(id)
service_id UUID NOT NULL REFERENCES services(id)
date DATE NOT NULL
starts_at TIME NOT NULL
ends_at TIME NOT NULL
status booking_status NOT NULL DEFAULT 'scheduled'
price_snapshot NUMERIC(10,2) NOT NULL
cancel_reason TEXT NULL
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Indices:

```text
INDEX (client_id)
INDEX (barber_id)
INDEX (service_id)
INDEX (date)
INDEX (barber_id, date)
INDEX (barber_id, date, starts_at, ends_at)
INDEX (status)
```

Constraints:

```text
CHECK (starts_at < ends_at)
CHECK (price_snapshot >= 0)
```

Regras:
- `price_snapshot` salva o preco no momento da reserva.
- Reservas canceladas nao devem bloquear novos horarios.
- Reservas scheduled e confirmed bloqueiam horario.
- Criacao de reserva deve validar conflito no backend.

Observacao importante:
- PostgreSQL permite criar constraint de exclusao para evitar conflitos, mas para o MVP a validacao pode ser feita no backend.
- Em producao mais robusta, considerar `EXCLUDE USING gist` com intervalo de tempo.

## 12. Tabela notifications

Objetivo:
Registrar notificacoes internas e envios externos.

Campos:

```text
id UUID PRIMARY KEY
user_id UUID NOT NULL REFERENCES users(id)
type VARCHAR(80) NOT NULL
title VARCHAR(160) NOT NULL
message TEXT NOT NULL
channel notification_channel NOT NULL DEFAULT 'internal'
status notification_status NOT NULL DEFAULT 'pending'
created_at TIMESTAMP WITH TIME ZONE NOT NULL
read_at TIMESTAMP WITH TIME ZONE NULL
```

Indices:

```text
INDEX (user_id)
INDEX (status)
INDEX (channel)
INDEX (created_at)
```

Regras:
- Usuario so pode ver suas notificacoes.
- E-mail enviado pode mudar status para sent.
- Notificacao interna lida pode mudar status para read.

## 13. Tabela settings

Objetivo:
Guardar configuracoes gerais da barbearia.

Campos:

```text
id UUID PRIMARY KEY
business_name VARCHAR(160) NOT NULL
phone VARCHAR(30) NULL
address TEXT NULL
cancellation_limit_minutes INTEGER NOT NULL DEFAULT 120
default_slot_interval_minutes INTEGER NOT NULL DEFAULT 30
cancellation_policy_text TEXT NULL
created_at TIMESTAMP WITH TIME ZONE NOT NULL
updated_at TIMESTAMP WITH TIME ZONE NOT NULL
```

Constraints:

```text
CHECK (cancellation_limit_minutes >= 0)
CHECK (default_slot_interval_minutes > 0)
```

Regras:
- Para MVP, pode existir apenas um registro de settings.
- Futuramente, em multiunidade, essa tabela deve ser ligada a uma tabela de barbearias/unidades.

## 14. Relacionamentos

```text
users 1--1 clients
users 1--1 barbers
clients 1--N bookings
barbers 1--N bookings
services 1--N bookings
barbers 1--N barber_working_hours
barbers 1--N schedule_blocks
users 1--N notifications
```

## 15. Regras Contra Conflito de Agenda

Duas reservas conflitam quando:

```text
nova.starts_at < existente.ends_at
AND
nova.ends_at > existente.starts_at
```

Considerar conflito apenas se:

```text
existente.barber_id = novo.barber_id
existente.date = nova.date
existente.status IN ('scheduled', 'confirmed')
```

Nao considerar como conflito:

```text
canceled
no_show
```

## 16. Consulta de Conflito Sugerida

Exemplo conceitual:

```sql
SELECT id
FROM bookings
WHERE barber_id = :barber_id
  AND date = :date
  AND status IN ('scheduled', 'confirmed')
  AND :new_starts_at < ends_at
  AND :new_ends_at > starts_at
LIMIT 1;
```

Se retornar registro, o horario nao pode ser reservado.

## 17. Indices Mais Importantes

Essenciais:

```text
users(email)
bookings(barber_id, date)
bookings(client_id)
barber_working_hours(barber_id, weekday)
schedule_blocks(barber_id, date)
services(is_active)
barbers(is_active)
```

Motivo:
- A maioria das consultas do app depende de servicos ativos, barbeiros ativos, agenda por barbeiro e reservas por cliente.

## 18. Dados Iniciais Recomendados

Settings:

```text
business_name = Nome da Barbearia
cancellation_limit_minutes = 120
default_slot_interval_minutes = 30
```

Servicos iniciais:

```text
Corte
Barba
Sobrancelha
Pigmentacao
Hidratacao
Combo Corte + Barba
```

Admin inicial:

```text
role = admin
is_active = true
```

## 19. Cuidados Para Futuras Versoes

Se o app evoluir para SaaS multiunidade, adicionar:

- companies.
- barber_shops.
- shop_users.
- shop_services.
- shop_settings.

Se adicionar pagamentos:

- payments.
- payment_methods.
- subscriptions.
- subscription_plans.
- invoices.

Se adicionar loja:

- products.
- product_categories.
- orders.
- order_items.
- inventory_movements.

Se adicionar comissoes:

- commissions.
- commission_rules.
- payouts.

## 20. Proxima Etapa

Com o modelo de banco definido, o proximo passo e criar a especificacao detalhada dos endpoints da API:

- Rotas.
- Metodos.
- Payloads.
- Respostas.
- Erros.
- Permissoes.
