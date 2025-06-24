"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Star,
  Clock,
  Users,
  Settings,
  HelpCircle,
  CheckCircle,
  Eye,
  GraduationCap,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Guide {
  id: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  views: number
  rating: number
  tags: string[]
  content: string
  videoUrl?: string
  screenshots: string[]
  lastUpdated: string
  author: string
  userRole: string[]
}

interface Tutorial {
  id: string
  title: string
  description: string
  steps: TutorialStep[]
  category: string
  estimatedTime: string
  completed?: boolean
}

interface TutorialStep {
  id: string
  title: string
  description: string
  action: string
  target?: string
  completed?: boolean
}

const GUIDE_CATEGORIES = {
  getting_started: {
    name: "Primeiros Passos",
    icon: GraduationCap,
    color: "bg-blue-500",
    description: "Guias básicos para começar",
  },
  member_management: {
    name: "Gestão de Membros",
    icon: Users,
    color: "bg-green-500",
    description: "Como gerenciar membros da igreja",
  },
  departments: {
    name: "Departamentos",
    icon: Target,
    color: "bg-purple-500",
    description: "Organização de ministérios",
  },
  events: {
    name: "Eventos",
    icon: Calendar,
    color: "bg-orange-500",
    description: "Planejamento e gestão de eventos",
  },
  finances: {
    name: "Finanças",
    icon: DollarSign,
    color: "bg-emerald-500",
    description: "Controle financeiro e orçamentos",
  },
  reports: {
    name: "Relatórios",
    icon: BarChart3,
    color: "bg-indigo-500",
    description: "Análises e relatórios",
  },
  admin: {
    name: "Administração",
    icon: Settings,
    color: "bg-red-500",
    description: "Configurações avançadas",
  },
  troubleshooting: {
    name: "Solução de Problemas",
    icon: HelpCircle,
    color: "bg-yellow-500",
    description: "Resolução de problemas comuns",
  },
}

const USER_ROLES = {
  admin: "Administrador",
  pastor: "Pastor",
  leader: "Líder",
  member: "Membro",
  treasurer: "Tesoureiro",
  secretary: "Secretário",
}

export default function DocumentationHub() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [activeTab, setActiveTab] = useState("guides")
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocumentation()
  }, [])

  const loadDocumentation = async () => {
    try {
      setLoading(true)
      // Simulate loading documentation data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Comprehensive guides data with additional content
      const sampleGuides: Guide[] = [
        // Getting Started Guides (existing ones remain, adding more)
        {
          id: "getting-started-1",
          title: "Como Começar com o Sistema",
          description: "Guia completo para configurar e usar o sistema pela primeira vez",
          category: "getting_started",
          difficulty: "beginner",
          duration: "15 min",
          views: 1250,
          rating: 4.8,
          tags: ["configuração", "primeiro uso", "básico"],
          content: `# Como Começar com o Sistema de Gestão da Igreja

## Bem-vindo!
Parabéns por escolher nosso sistema de gestão para sua igreja! Este guia irá ajudá-lo a configurar e usar o sistema pela primeira vez.

## Passo 1: Configuração Inicial da Igreja

### 1.1 Informações Básicas
1. Acesse o painel de administração
2. Vá para **Configurações > Informações da Igreja**
3. Preencha os dados essenciais:
   - Nome da igreja
   - Endereço completo
   - Telefone e email de contato
   - Pastor principal
   - Data de fundação

### 1.2 Logo e Identidade Visual
1. Faça upload do logo da igreja (formato PNG ou JPG, máximo 2MB)
2. Escolha as cores principais da igreja
3. Configure o tema visual do sistema

## Passo 2: Configuração de Usuários

### 2.1 Criando o Primeiro Administrador
1. Vá para **Usuários > Adicionar Usuário**
2. Defina as permissões de administrador
3. Envie o convite por email

### 2.2 Níveis de Acesso
- **Administrador**: Acesso total ao sistema
- **Pastor**: Acesso a membros, eventos e relatórios
- **Líder**: Acesso ao seu departamento
- **Secretário**: Acesso a membros e eventos
- **Tesoureiro**: Acesso financeiro
- **Membro**: Acesso limitado ao próprio perfil

## Passo 3: Configuração dos Departamentos

### 3.1 Departamentos Padrão
O sistema vem com departamentos pré-configurados:
- Escola Dominical
- Ministério Feminino
- Grupo de Jovens
- Intercessão
- Porteiros
- Ministério de Louvor
- Ministério Infantil
- Mídia
- Segurança
- Missões

### 3.2 Personalizando Departamentos
1. Acesse **Departamentos**
2. Edite os departamentos existentes ou crie novos
3. Defina líderes para cada departamento
4. Configure horários de reunião

## Passo 4: Adicionando os Primeiros Membros

### 4.1 Importação em Massa
Se você já tem uma lista de membros:
1. Vá para **Membros > Importar**
2. Baixe o modelo Excel
3. Preencha os dados e faça upload

### 4.2 Cadastro Manual
Para adicionar membros individualmente:
1. Clique em **Adicionar Membro**
2. Preencha as informações básicas
3. Adicione foto (opcional)
4. Atribua a departamentos

## Passo 5: Configuração Financeira

### 5.1 Categorias de Receita
Configure as principais fontes de receita:
- Dízimos
- Ofertas
- Doações especiais
- Eventos
- Vendas

### 5.2 Categorias de Despesa
Defina as categorias de gastos:
- Manutenção
- Salários
- Utilidades (água, luz, internet)
- Eventos
- Missões
- Materiais

## Passo 6: Primeiros Eventos

### 6.1 Eventos Regulares
Configure os cultos e atividades regulares:
- Culto de domingo
- Escola dominical
- Reunião de oração
- Ensaio do coral

### 6.2 Eventos Especiais
Adicione eventos especiais:
- Conferências
- Retiros
- Evangelismos
- Festivais

## Dicas Importantes

### ✅ Boas Práticas
- Mantenha os dados sempre atualizados
- Faça backup regular dos dados
- Treine os usuários antes de dar acesso
- Use senhas seguras
- Configure notificações importantes

### ⚠️ Cuidados
- Não compartilhe senhas de administrador
- Verifique permissões antes de dar acesso
- Mantenha informações pessoais protegidas
- Teste funcionalidades em ambiente seguro

## Próximos Passos
1. Explore cada módulo do sistema
2. Configure relatórios automáticos
3. Treine sua equipe
4. Personalize conforme suas necessidades

## Suporte
Se precisar de ajuda:
- Use o chat ao vivo (canto inferior direito)
- Envie email para suporte@sistema.com
- Telefone: +244 XXX XXX XXX
- Horário: Segunda a Sexta, 8h às 18h`,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          screenshots: ["/placeholder.svg?height=300&width=500"],
          lastUpdated: "2024-01-15",
          author: "Equipe de Suporte",
          userRole: ["admin", "pastor"],
        },

        // Add new Getting Started guides
        {
          id: "getting-started-3",
          title: "Primeiros Passos para Pastores",
          description: "Guia específico para pastores começarem a usar o sistema",
          category: "getting_started",
          difficulty: "beginner",
          duration: "20 min",
          views: 890,
          rating: 4.9,
          tags: ["pastor", "liderança", "início"],
          content: `# Primeiros Passos para Pastores

## Introdução
Como pastor, você tem acesso a funcionalidades especiais que facilitam o pastoreio e a administração da igreja.

## Visão Geral do Painel Pastoral

### Dashboard Principal
Ao fazer login, você verá:
- **Resumo de Membros**: Total de membros ativos, novos membros, aniversariantes
- **Eventos Próximos**: Cultos e atividades programadas
- **Situação Financeira**: Resumo de dízimos e ofertas
- **Alertas Importantes**: Notificações que requerem atenção

### Acesso Rápido
- Adicionar novo membro
- Criar evento
- Ver relatórios
- Acessar comunicação

## Gestão Pastoral de Membros

### Acompanhamento Espiritual
**Histórico de Visitas:**
1. Acesse o perfil do membro
2. Vá para a aba "Acompanhamento"
3. Registre visitas pastorais
4. Anote observações importantes
5. Agende próximas visitas

**Situações Especiais:**
- Membros em disciplina
- Casos de aconselhamento
- Necessidades especiais
- Situações familiares

### Relatórios Pastorais
**Relatório de Crescimento:**
- Novos membros por mês
- Batismos realizados
- Transferências
- Membros inativos

**Relatório de Visitação:**
- Visitas realizadas
- Membros visitados
- Pendências de visita
- Acompanhamentos necessários

## Planejamento de Cultos

### Programação Semanal
**Culto de Domingo:**
1. Acesse **Eventos > Cultos**
2. Selecione o domingo
3. Defina a programação:
   - Tema da mensagem
   - Textos bíblicos
   - Hinos/cânticos
   - Avisos especiais
   - Participações especiais

**Outros Cultos:**
- Culto de quarta-feira
- Vigílias
- Cultos especiais
- Eventos departamentais

### Escala de Pregadores
**Organização:**
1. Crie uma escala mensal
2. Defina pregadores convidados
3. Confirme disponibilidade
4. Envie lembretes automáticos

## Comunicação Pastoral

### Mensagens para a Igreja
**Boletim Semanal:**
1. Acesse **Comunicação > Boletim**
2. Escreva a mensagem pastoral
3. Adicione avisos importantes
4. Programe o envio

**Mensagens Especiais:**
- Datas comemorativas
- Campanhas especiais
- Situações de crise
- Celebrações

### Comunicação com Liderança
**Reuniões de Liderança:**
- Agende reuniões mensais
- Defina pautas
- Registre decisões
- Acompanhe tarefas

## Administração Financeira

### Acompanhamento de Dízimos
**Relatórios Mensais:**
- Total arrecadado
- Comparativo com mês anterior
- Dizimistas fiéis
- Novos dizimistas

**Análise de Tendências:**
- Crescimento anual
- Sazonalidade
- Impacto de campanhas
- Projeções futuras

### Aprovação de Gastos
**Processo de Aprovação:**
1. Receba solicitações de gastos
2. Analise a necessidade
3. Verifique orçamento disponível
4. Aprove ou solicite ajustes
5. Acompanhe a execução

## Cuidado Pastoral

### Acompanhamento de Enfermos
**Lista de Enfermos:**
1. Mantenha lista atualizada
2. Programe visitas regulares
3. Organize grupos de visitação
4. Acompanhe recuperações

**Oração pelos Enfermos:**
- Lista para cultos
- Pedidos especiais
- Testemunhos de cura
- Apoio às famílias

### Aconselhamento
**Agendamento:**
1. Configure horários disponíveis
2. Permita agendamento online
3. Confirme consultas
4. Registre observações (confidenciais)

**Acompanhamento:**
- Casos em andamento
- Sessões realizadas
- Progresso observado
- Encaminhamentos necessários

## Desenvolvimento de Líderes

### Identificação de Talentos
**Observação Contínua:**
- Membros com potencial
- Habilidades específicas
- Disponibilidade para servir
- Maturidade espiritual

**Processo de Desenvolvimento:**
1. Convite para liderança
2. Período de observação
3. Treinamento específico
4. Responsabilidades graduais
5. Avaliação contínua

### Capacitação
**Cursos de Liderança:**
- Liderança cristã básica
- Ensino bíblico
- Administração eclesiástica
- Evangelismo pessoal

## Planejamento Estratégico

### Visão e Metas
**Definição Anual:**
1. Estabeleça a visão da igreja
2. Defina metas específicas
3. Crie planos de ação
4. Monitore o progresso
5. Ajuste conforme necessário

**Áreas de Foco:**
- Crescimento numérico
- Desenvolvimento espiritual
- Impacto social
- Sustentabilidade financeira

### Avaliação de Ministérios
**Análise Regular:**
- Eficácia dos departamentos
- Participação dos membros
- Resultados alcançados
- Necessidades de ajuste

## Ferramentas Especiais para Pastores

### Agenda Pastoral
- Compromissos semanais
- Visitas agendadas
- Reuniões importantes
- Eventos especiais

### Biblioteca de Sermões
- Arquivo de mensagens
- Temas por categoria
- Textos bíblicos
- Ilustrações úteis

### Estatísticas da Igreja
- Crescimento mensal
- Participação em cultos
- Batismos e apresentações
- Situação financeira

## Dicas para Pastores

### Uso Eficiente do Sistema
- Dedique tempo diário ao sistema
- Use relatórios para decisões
- Mantenha dados atualizados
- Aproveite automações

### Delegação Eficaz
- Treine líderes no sistema
- Defina responsabilidades claras
- Monitore sem microgerenciar
- Reconheça bom trabalho

### Equilíbrio Pastoral
- Use tecnologia como ferramenta
- Mantenha relacionamentos pessoais
- Não substitua visitas por mensagens
- Preserve tempo para oração e estudo

Este guia fornece uma base sólida para pastores maximizarem o uso do sistema em seu ministério.`,
          videoUrl: "https://www.youtube.com/embed/pastor-guide",
          screenshots: ["/placeholder.svg?height=300&width=500"],
          lastUpdated: "2024-01-13",
          author: "Pastor Marcos",
          userRole: ["pastor"],
        },

        {
          id: "getting-started-4",
          title: "Guia para Secretários da Igreja",
          description: "Como secretários podem usar o sistema para administração eficiente",
          category: "getting_started",
          difficulty: "beginner",
          duration: "18 min",
          views: 720,
          rating: 4.7,
          tags: ["secretário", "administração", "organização"],
          content: `# Guia para Secretários da Igreja

## Introdução
Como secretário da igreja, você é responsável por manter a organização administrativa e apoiar a liderança com informações precisas.

## Responsabilidades do Secretário

### Gestão de Membros
**Cadastro e Atualização:**
- Manter dados de membros atualizados
- Processar transferências
- Registrar mudanças de status
- Organizar documentação

**Controle de Frequência:**
- Registrar presença em cultos
- Acompanhar participação em atividades
- Identificar membros ausentes
- Gerar relatórios de frequência

### Organização de Eventos
**Planejamento:**
- Criar eventos no sistema
- Definir programação detalhada
- Gerenciar inscrições
- Coordenar logística

**Documentação:**
- Registrar atas de reuniões
- Arquivar documentos importantes
- Manter histórico de decisões
- Organizar correspondências

## Funcionalidades Principais

### Painel do Secretário
**Visão Geral Diária:**
- Eventos do dia
- Aniversariantes
- Tarefas pendentes
- Mensagens importantes

**Acesso Rápido:**
- Adicionar membro
- Registrar presença
- Criar evento
- Enviar comunicado

### Gestão de Correspondências
**Recebimento:**
1. Registre correspondências recebidas
2. Classifique por tipo e urgência
3. Encaminhe para responsáveis
4. Acompanhe respostas

**Envio:**
1. Prepare comunicados oficiais
2. Use modelos padronizados
3. Mantenha registro de envios
4. Confirme recebimento

## Relatórios Administrativos

### Relatórios de Membros
**Mensais:**
- Lista de membros ativos
- Novos membros
- Transferências
- Alterações de dados

**Especiais:**
- Aniversariantes do mês
- Membros por departamento
- Estatísticas de crescimento
- Relatório de visitantes

### Relatórios de Eventos
**Participação:**
- Número de participantes
- Lista de presentes
- Ausências notificadas
- Feedback recebido

**Organização:**
- Cronograma cumprido
- Recursos utilizados
- Custos envolvidos
- Lições aprendidas

## Comunicação Eficaz

### Avisos e Comunicados
**Canais de Comunicação:**
- Boletim dominical
- WhatsApp da igreja
- Email para membros
- Quadro de avisos

**Tipos de Comunicados:**
- Eventos programados
- Mudanças de horário
- Informações importantes
- Celebrações especiais

### Atendimento ao Público
**Presencial:**
- Recepção de visitantes
- Informações sobre a igreja
- Orientação sobre serviços
- Agendamento de reuniões

**Telefônico:**
- Atendimento cordial
- Informações precisas
- Recados para liderança
- Agendamentos

## Organização de Arquivos

### Documentos Físicos
**Sistema de Arquivamento:**
- Pastas por categoria
- Etiquetas claras
- Ordem cronológica
- Fácil localização

**Categorias:**
- Atas de reuniões
- Correspondências
- Documentos legais
- Relatórios financeiros
- Registros de membros

### Arquivos Digitais
**Organização no Sistema:**
- Pastas estruturadas
- Nomes padronizados
- Backup regular
- Controle de versões

**Segurança:**
- Senhas seguras
- Acesso controlado
- Backup automático
- Recuperação de dados

## Apoio à Liderança

### Preparação de Reuniões
**Antes da Reunião:**
1. Prepare a pauta
2. Reúna documentos necessários
3. Confirme participantes
4. Reserve local adequado

**Durante a Reunião:**
1. Registre presentes
2. Anote pontos principais
3. Documente decisões
4. Identifique tarefas

**Após a Reunião:**
1. Elabore a ata
2. Distribua para participantes
3. Acompanhe tarefas definidas
4. Archive documentos

### Suporte Administrativo
**Tarefas Diárias:**
- Verificar emails
- Atualizar agenda
- Processar documentos
- Responder consultas

**Tarefas Semanais:**
- Preparar relatórios
- Organizar arquivos
- Atualizar informações
- Planejar próxima semana

## Controle de Qualidade

### Verificação de Dados
**Rotina de Verificação:**
- Conferir dados inseridos
- Validar informações
- Corrigir inconsistências
- Atualizar registros

**Indicadores de Qualidade:**
- Dados completos
- Informações atualizadas
- Documentos organizados
- Processos padronizados

### Melhoria Contínua
**Avaliação Regular:**
- Analisar processos
- Identificar melhorias
- Implementar mudanças
- Medir resultados

## Ferramentas Úteis

### Modelos de Documentos
**Disponíveis no Sistema:**
- Atas de reunião
- Comunicados oficiais
- Relatórios padrão
- Cartas e ofícios

**Personalização:**
- Adapte aos padrões da igreja
- Inclua logotipo oficial
- Use linguagem apropriada
- Mantenha formatação consistente

### Lembretes e Alertas
**Configuração:**
- Aniversários de membros
- Vencimento de documentos
- Eventos programados
- Tarefas pendentes

## Relacionamento com Departamentos

### Coordenação
**Comunicação Regular:**
- Reuniões com líderes
- Troca de informações
- Apoio administrativo
- Resolução de problemas

**Suporte Específico:**
- Escola Dominical: listas de alunos
- Ministério de Louvor: escalas
- Grupo de Jovens: eventos
- Ministério Feminino: atividades

## Dicas para Secretários

### Organização Pessoal
- Use agenda detalhada
- Priorize tarefas importantes
- Mantenha mesa organizada
- Faça backup regular

### Comunicação Eficaz
- Seja claro e objetivo
- Use linguagem apropriada
- Confirme entendimento
- Documente acordos

### Desenvolvimento Profissional
- Participe de treinamentos
- Aprenda novas ferramentas
- Desenvolva habilidades
- Busque feedback

### Relacionamento Interpessoal
- Seja cordial e prestativo
- Mantenha confidencialidade
- Demonstre profissionalismo
- Cultive bons relacionamentos

Este guia fornece as ferramentas necessárias para secretários exercerem sua função com excelência e eficiência.`,
          videoUrl: "https://www.youtube.com/embed/secretary-guide",
          screenshots: ["/placeholder.svg?height=300&width=500"],
          lastUpdated: "2024-01-11",
          author: "Secretária Ana",
          userRole: ["secretary"],
        },

        // Add more Member Management guides
        {
          id: "member-management-2",
          title: "Importação e Exportação de Dados",
          description: "Como importar membros de outros sistemas e exportar relatórios",
          category: "member_management",
          difficulty: "intermediate",
          duration: "20 min",
          views: 1340,
          rating: 4.6,
          tags: ["importação", "exportação", "dados", "migração"],
          content: `# Importação e Exportação de Dados de Membros

## Introdução
A migração de dados é um processo crítico ao implementar um novo sistema. Este guia aborda as melhores práticas para importar e exportar dados de membros.

## Preparação para Importação

### Análise dos Dados Existentes
**Avaliação Inicial:**
1. Identifique a fonte dos dados atuais
2. Avalie a qualidade das informações
3. Mapeie os campos disponíveis
4. Identifique dados faltantes ou inconsistentes

**Limpeza de Dados:**
- Remova duplicatas
- Padronize formatos
- Corrija erros óbvios
- Complete informações essenciais

### Formatos Suportados
**Arquivos Aceitos:**
- Excel (.xlsx, .xls)
- CSV (Comma Separated Values)
- Texto delimitado (.txt)
- Google Sheets (via exportação)

**Codificação de Caracteres:**
- UTF-8 (recomendado)
- ISO-8859-1 (Latin-1)
- Windows-1252

## Processo de Importação

### Passo 1: Preparação do Arquivo
**Estrutura Recomendada:**
\`\`\`
Nome Completo | Email | Telefone | Data Nascimento | Endereço | Status
João Silva    | joao@email.com | (11) 99999-9999 | 15/03/1980 | Rua A, 123 | Ativo
Maria Santos  | maria@email.com | (11) 88888-8888 | 22/07/1985 | Rua B, 456 | Ativo
\`\`\`

**Campos Obrigatórios:**
- Nome completo
- Data de nascimento
- Status do membro

**Campos Opcionais:**
- Email
- Telefone
- Endereço completo
- Estado civil
- Profissão
- Data de batismo
- Departamentos

### Passo 2: Validação de Dados
**Verificações Automáticas:**
- Formato de email válido
- Formato de telefone correto
- Datas válidas
- Campos obrigatórios preenchidos

**Relatório de Validação:**
- Registros válidos
- Registros com erro
- Campos faltantes
- Sugestões de correção

### Passo 3: Mapeamento de Campos
**Interface de Mapeamento:**
1. Carregue o arquivo
2. Visualize as primeiras linhas
3. Mapeie cada coluna para um campo do sistema
4. Configure transformações necessárias
5. Confirme o mapeamento

**Transformações Disponíveis:**
- Conversão de datas
- Padronização de telefones
- Normalização de nomes
- Conversão de status

### Passo 4: Importação
**Processo:**
1. Revise o mapeamento
2. Inicie a importação
3. Acompanhe o progresso
4. Analise o relatório final
5. Corrija erros se necessário

**Relatório de Importação:**
- Total de registros processados
- Registros importados com sucesso
- Registros com erro
- Detalhes dos erros encontrados

## Tratamento de Erros

### Erros Comuns
**Dados Duplicados:**
- Mesmo nome e data de nascimento
- Mesmo email ou telefone
- Critérios de identificação

**Formatos Inválidos:**
- Datas em formato incorreto
- Emails malformados
- Telefones incompletos
- Caracteres especiais

**Dados Faltantes:**
- Campos obrigatórios vazios
- Informações incompletas
- Referências inválidas

### Estratégias de Resolução
**Duplicatas:**
1. Identifique registros similares
2. Compare informações
3. Mescle dados complementares
4. Mantenha registro mais completo
5. Archive duplicatas

**Correção de Formatos:**
- Use ferramentas de padronização
- Aplique máscaras automáticas
- Valide antes da importação
- Corrija manualmente se necessário

## Exportação de Dados

### Tipos de Exportação
**Exportação Completa:**
- Todos os membros
- Todos os campos
- Formato original
- Backup completo

**Exportação Filtrada:**
- Membros específicos
- Campos selecionados
- Critérios personalizados
- Relatórios direcionados

### Formatos de Exportação
**Excel (.xlsx):**
- Formatação preservada
- Múltiplas planilhas
- Gráficos incluídos
- Fórmulas mantidas

**CSV:**
- Formato universal
- Fácil importação
- Tamanho reduzido
- Compatibilidade ampla

**PDF:**
- Relatórios formatados
- Não editável
- Ideal para impressão
- Apresentação profissional

### Configuração da Exportação
**Seleção de Dados:**
1. Escolha os membros
2. Selecione os campos
3. Defina filtros
4. Configure ordenação
5. Escolha o formato

**Opções Avançadas:**
- Incluir fotos
- Agrupar por departamento
- Adicionar estatísticas
- Personalizar layout

## Migração de Sistemas

### Planejamento da Migração
**Fases do Projeto:**
1. **Análise**: Avaliação dos dados atuais
2. **Preparação**: Limpeza e organização
3. **Teste**: Importação piloto
4. **Migração**: Importação completa
5. **Validação**: Verificação final

**Cronograma Recomendado:**
- Semana 1-2: Análise e preparação
- Semana 3: Testes e ajustes
- Semana 4: Migração final
- Semana 5: Validação e correções

### Backup e Segurança
**Antes da Migração:**
- Faça backup completo dos dados atuais
- Documente o processo
- Prepare plano de rollback
- Teste em ambiente separado

**Durante a Migração:**
- Monitore o processo
- Mantenha logs detalhados
- Valide dados críticos
- Corrija erros imediatamente

## Integração com Outros Sistemas

### APIs Disponíveis
**Sistemas Suportados:**
- Sistemas de gestão eclesiástica
- Planilhas Google
- CRMs populares
- Bancos de dados SQL

**Sincronização Automática:**
- Agendamento de importações
- Atualizações incrementais
- Detecção de mudanças
- Resolução de conflitos

### Webhooks
**Configuração:**
1. Configure endpoint de destino
2. Defina eventos de interesse
3. Implemente autenticação
4. Teste a conectividade
5. Monitore a sincronização

## Qualidade de Dados

### Validação Contínua
**Verificações Regulares:**
- Dados duplicados
- Informações desatualizadas
- Campos obrigatórios vazios
- Inconsistências de formato

**Relatórios de Qualidade:**
- Índice de completude
- Taxa de duplicação
- Precisão dos dados
- Atualização recente

### Melhoria Contínua
**Processos:**
1. Monitore qualidade regularmente
2. Identifique padrões de erro
3. Implemente correções automáticas
4. Treine usuários
5. Atualize procedimentos

## Conformidade e Privacidade

### LGPD (Lei Geral de Proteção de Dados)
**Considerações:**
- Consentimento para tratamento
- Minimização de dados
- Finalidade específica
- Segurança adequada
- Direitos dos titulares

**Implementação:**
- Documente bases legais
- Implemente controles de acesso
- Mantenha logs de atividade
- Prepare para exercício de direitos

### Segurança na Transferência
**Criptografia:**
- Use conexões HTTPS
- Criptografe arquivos sensíveis
- Implemente autenticação forte
- Monitore acessos

## Ferramentas Auxiliares

### Validadores de Dados
**Ferramentas Recomendadas:**
- OpenRefine (limpeza de dados)
- Excel/Google Sheets (manipulação)
- Validadores de email online
- Ferramentas de padronização

### Scripts de Automação
**Exemplos Úteis:**
- Padronização de nomes
- Formatação de telefones
- Validação de emails
- Detecção de duplicatas

## Casos de Uso Comuns

### Migração de Planilhas Excel
**Cenário:** Igreja mantém dados em Excel
**Solução:**
1. Exporte planilha para CSV
2. Limpe dados inconsistentes
3. Mapeie colunas corretamente
4. Importe em lotes pequenos
5. Valide dados importados

### Integração com Sistema Financeiro
**Cenário:** Sincronizar dados de dizimistas
**Solução:**
1. Configure API de integração
2. Mapeie campos financeiros
3. Agende sincronização automática
4. Monitore discrepâncias
5. Resolva conflitos

### Backup Regular
**Cenário:** Backup semanal de dados
**Solução:**
1. Configure exportação automática
2. Defina formato e campos
3. Agende para horário adequado
4. Armazene em local seguro
5. Teste restauração periodicamente

## Melhores Práticas

### Preparação
- Sempre faça backup antes de importar
- Teste com pequeno conjunto de dados
- Valide dados críticos manualmente
- Documente o processo

### Execução
- Monitore o progresso constantemente
- Corrija erros imediatamente
- Mantenha logs detalhados
- Comunique status para equipe

### Pós-Importação
- Valide dados importados
- Corrija inconsistências
- Treine usuários nos novos dados
- Monitore qualidade continuamente

Este guia fornece uma base sólida para migração bem-sucedida de dados de membros.`,
          videoUrl: "https://www.youtube.com/embed/data-import-export",
          screenshots: ["/placeholder.svg?height=300&width=500"],
          lastUpdated: "2024-01-09",
          author: "Analista de Dados",
          userRole: ["admin", "secretary"],
        },

        // Continue with more comprehensive guides...
        // (I'll add more guides in the next part to keep the response manageable)
      ]

      const sampleTutorials: Tutorial[] = [
        {
          id: "tutorial-1",
          title: "Configurando sua Conta",
          description: "Passos para configurar sua conta e informações da igreja",
          category: "getting_started",
          estimatedTime: "10 min",
          steps: [
            {
              id: "step-1",
              title: "Criar uma Conta",
              description: "Acesse a página de registro e preencha suas informações",
              action: "Clique no botão 'Criar Conta'",
              target: "Página de Registro",
            },
            {
              id: "step-2",
              title: "Configurar Informações da Igreja",
              description: "Adicione o nome, endereço e detalhes da sua igreja",
              action: "Preencha o formulário na página de configurações",
              target: "Página de Configurações",
            },
          ],
        },
      ]

      const faqs = [
        {
          category: "Geral",
          questions: [
            {
              question: "Como faço para começar a usar o sistema?",
              answer:
                "Para começar, você precisa criar uma conta e configurar as informações básicas da sua igreja. Siga nosso guia 'Como Começar' na seção de tutoriais. O processo inclui: 1) Configurar dados da igreja, 2) Criar usuários administrativos, 3) Configurar departamentos, 4) Adicionar primeiros membros, 5) Configurar sistema financeiro.",
            },
            {
              question: "O sistema funciona offline?",
              answer:
                "Algumas funcionalidades básicas funcionam offline, como visualização de dados já carregados e preenchimento de formulários. No entanto, para sincronização completa, backup automático e funcionalidades avançadas, você precisa de conexão com a internet. Recomendamos uma conexão estável para melhor experiência.",
            },
            {
              question: "Posso importar dados de outro sistema?",
              answer:
                "Sim! O sistema suporta importação de dados em vários formatos (Excel, CSV, Google Sheets). Oferecemos ferramentas de mapeamento de campos, validação de dados e relatórios de importação. Consulte nosso guia 'Importação e Exportação de Dados' para instruções detalhadas.",
            },
            {
              question: "Como funciona o backup dos dados?",
              answer:
                "O sistema realiza backup automático diário de todos os dados na nuvem. Você também pode fazer backups manuais a qualquer momento e configurar backups automáticos personalizados. Os dados são criptografados e armazenados em servidores seguros com redundância geográfica.",
            },
            {
              question: "Quantos usuários podem acessar o sistema?",
              answer:
                "Não há limite fixo de usuários. O número de usuários depende do plano contratado. Oferecemos planos flexíveis que crescem com sua igreja, desde igrejas pequenas até grandes denominações com milhares de membros.",
            },
          ],
        },
        {
          category: "Membros",
          questions: [
            {
              question: "Como adiciono fotos aos perfis dos membros?",
              answer:
                "Para adicionar fotos: 1) Acesse o perfil do membro, 2) Clique em 'Editar', 3) Clique na área da foto, 4) Selecione a imagem (JPG, PNG, máximo 5MB), 5) Ajuste o enquadramento se necessário, 6) Salve as alterações. A foto será redimensionada automaticamente para otimizar o carregamento.",
            },
            {
              question: "Posso criar campos personalizados para membros?",
              answer:
                "Sim! Na seção Configurações > Campos Personalizados, você pode adicionar campos específicos para sua igreja, como: data de conversão, igreja de origem, habilidades especiais, disponibilidade para ministérios, etc. Suportamos vários tipos de campos: texto, número, data, lista de opções, sim/não.",
            },
            {
              question: "Como organizo os membros por famílias?",
              answer:
                "O sistema possui funcionalidade completa de gestão familiar: 1) Crie um registro de família, 2) Defina o chefe da família, 3) Adicione cônjuge e filhos, 4) Configure relacionamentos, 5) Gerencie endereço familiar. Isso facilita comunicação, relatórios e organização de eventos familiares.",
            },
            {
              question: "Como controlo a privacidade dos dados dos membros?",
              answer:
                "O sistema oferece controles granulares de privacidade: 1) Níveis de acesso por usuário, 2) Campos visíveis/ocultos por perfil, 3) Consentimento para uso de imagem, 4) Opt-in/opt-out para comunicações, 5) Logs de acesso aos dados, 6) Conformidade com LGPD.",
            },
            {
              question: "Posso enviar mensagens em massa para os membros?",
              answer:
                "Sim! O sistema inclui ferramentas de comunicação em massa: 1) Email marketing com templates, 2) WhatsApp Business integrado, 3) SMS (onde disponível), 4) Segmentação por departamento, idade, região, 5) Agendamento de envios, 6) Relatórios de entrega e abertura.",
            },
          ],
        },
        {
          category: "Departamentos",
          questions: [
            {
              question: "Como organizo os ministérios da igreja?",
              answer:
                "Use a seção Departamentos para criar e gerenciar ministérios: 1) Crie departamentos por área (Louvor, Jovens, Infantil, etc.), 2) Defina líderes e vice-líderes, 3) Configure horários de reunião, 4) Atribua membros aos departamentos, 5) Gerencie atividades e eventos específicos, 6) Acompanhe participação e crescimento.",
            },
            {
              question: "Posso ter sub-departamentos?",
              answer:
                "Sim! O sistema suporta hierarquia de departamentos. Por exemplo: Ministério Infantil pode ter sub-departamentos como Berçário (0-2 anos), Maternal (3-5 anos), Infantil (6-8 anos). Isso permite organização detalhada e relatórios específicos por faixa etária ou especialidade.",
            },
            {
              question: "Como faço a escala de atividades dos departamentos?",
              answer:
                "Cada departamento tem sua própria agenda: 1) Acesse o departamento, 2) Vá para 'Escalas', 3) Crie escalas por atividade (pregação, louvor, limpeza, etc.), 4) Atribua responsáveis, 5) Configure recorrência, 6) Envie lembretes automáticos, 7) Permita trocas entre membros.",
            },
            {
              question: "Como acompanho o desempenho dos departamentos?",
              answer:
                "O sistema oferece relatórios detalhados: 1) Participação média em reuniões, 2) Crescimento do departamento, 3) Atividades realizadas vs planejadas, 4) Engajamento dos membros, 5) Recursos utilizados, 6) Feedback dos participantes, 7) Comparativo entre departamentos.",
            },
          ],
        },
        {
          category: "Eventos",
          questions: [
            {
              question: "Como crio eventos recorrentes?",
              answer:
                "Para eventos recorrentes: 1) Crie o evento normalmente, 2) Na seção 'Recorrência', escolha a frequência (semanal, mensal, anual), 3) Defina data de término ou número de ocorrências, 4) Configure exceções se necessário, 5) O sistema criará automaticamente todas as ocorrências.",
            },
            {
              question: "Posso controlar inscrições em eventos?",
              answer:
                "Sim! O sistema oferece controle completo de inscrições: 1) Defina limite de participantes, 2) Configure período de inscrições, 3) Crie formulário personalizado, 4) Defina taxa de inscrição (se aplicável), 5) Gerencie lista de espera, 6) Envie confirmações automáticas.",
            },
            {
              question: "Como faço transmissão ao vivo de eventos?",
              answer:
                "O sistema integra com plataformas de streaming: 1) Configure sua conta YouTube/Facebook, 2) No evento, ative 'Transmissão ao vivo', 3) Configure título e descrição, 4) Inicie a transmissão, 5) Compartilhe o link automaticamente, 6) Monitore visualizações e interações.",
            },
            {
              question: "Posso cobrar taxa de inscrição em eventos?",
              answer:
                "Sim! O sistema suporta cobrança de eventos: 1) Configure valores por categoria de participante, 2) Integre com gateways de pagamento (PIX, cartão), 3) Gere boletos automáticos, 4) Controle pagamentos e inadimplência, 5) Emita recibos automáticos, 6) Relatórios financeiros do evento.",
            },
          ],
        },
        {
          category: "Finanças",
          questions: [
            {
              question: "Como registro dízimos e ofertas?",
              answer:
                "Para registrar contribuições: 1) Acesse 'Finanças > Receitas', 2) Selecione o tipo (dízimo/oferta), 3) Informe valor e contribuinte, 4) Adicione observações se necessário, 5) Confirme o registro. O sistema gera recibos automáticos e atualiza relatórios em tempo real.",
            },
            {
              question: "Posso gerar recibos de doação?",
              answer:
                "Sim! O sistema gera recibos automáticos: 1) Configure modelo de recibo com dados da igreja, 2) Recibos são gerados automaticamente para cada contribuição, 3) Envio por email opcional, 4) Relatório anual para Imposto de Renda, 5) Numeração sequencial automática, 6) Assinatura digital disponível.",
            },
            {
              question: "Como faço o controle orçamentário?",
              answer:
                "O sistema oferece controle orçamentário completo: 1) Crie orçamento anual por categoria, 2) Registre todas as receitas e despesas, 3) Acompanhe realizado vs orçado, 4) Receba alertas de desvios, 5) Gere relatórios mensais, 6) Projete cenários futuros.",
            },
            {
              question: "Posso integrar com bancos?",
              answer:
                "Sim! Oferecemos integração bancária: 1) Conecte suas contas bancárias, 2) Importação automática de extratos, 3) Conciliação automática de lançamentos, 4) Detecção de duplicatas, 5) Categorização inteligente, 6) Relatórios de fluxo de caixa em tempo real.",
            },
            {
              question: "Como funciona a prestação de contas?",
              answer:
                "O sistema facilita a transparência: 1) Relatórios automáticos mensais/anuais, 2) Demonstrativos financeiros padronizados, 3) Gráficos e análises visuais, 4) Comparativos históricos, 5) Exportação para PDF/Excel, 6) Publicação automática no site da igreja (opcional).",
            },
          ],
        },
        {
          category: "Relatórios",
          questions: [
            {
              question: "Que tipos de relatórios posso gerar?",
              answer:
                "O sistema oferece mais de 50 tipos de relatórios: Membros (crescimento, aniversários, departamentos), Financeiros (receitas, despesas, orçamento), Eventos (participação, custos), Departamentos (atividades, líderes), Personalizados (campos específicos), Executivos (dashboards), Regulatórios (prestação de contas).",
            },
            {
              question: "Posso agendar relatórios automáticos?",
              answer:
                "Sim! Configure relatórios automáticos: 1) Escolha o relatório desejado, 2) Defina periodicidade (diário, semanal, mensal), 3) Configure destinatários, 4) Escolha formato (PDF, Excel, email), 5) Defina horário de envio, 6) O sistema enviará automaticamente.",
            },
            {
              question: "Como personalizo relatórios?",
              answer:
                "O sistema oferece editor de relatórios: 1) Escolha campos a incluir, 2) Configure filtros e critérios, 3) Defina agrupamentos e ordenação, 4) Personalize layout e cores, 5) Adicione gráficos e imagens, 6) Salve como template para reutilização.",
            },
            {
              question: "Posso exportar dados para Excel?",
              answer:
                "Sim! Todos os relatórios podem ser exportados: 1) Formatos: Excel, CSV, PDF, 2) Dados completos ou filtrados, 3) Com ou sem formatação, 4) Incluindo gráficos e imagens, 5) Múltiplas planilhas, 6) Compatível com Excel 2010+.",
            },
          ],
        },
        {
          category: "Segurança",
          questions: [
            {
              question: "Como funciona a segurança dos dados?",
              answer:
                "Implementamos múltiplas camadas de segurança: 1) Criptografia SSL/TLS para transmissão, 2) Criptografia AES-256 para armazenamento, 3) Autenticação de dois fatores, 4) Controle de acesso baseado em funções, 5) Logs de auditoria completos, 6) Backup automático criptografado, 7) Conformidade com LGPD.",
            },
            {
              question: "Posso controlar quem acessa quais dados?",
              answer:
                "Sim! O sistema oferece controle granular: 1) Perfis de usuário pré-definidos, 2) Permissões personalizáveis por módulo, 3) Acesso por departamento específico, 4) Campos visíveis/ocultos por usuário, 5) Logs de acesso detalhados, 6) Aprovação para ações sensíveis.",
            },
            {
              question: "Como recupero dados em caso de problema?",
              answer:
                "Temos múltiplas proteções: 1) Backup automático diário na nuvem, 2) Versionamento de dados (histórico de alterações), 3) Backup local opcional, 4) Recuperação point-in-time, 5) Suporte técnico 24/7 para emergências, 6) Plano de continuidade de negócios.",
            },
            {
              question: "O sistema é compatível com LGPD?",
              answer:
                "Sim! Somos totalmente compatíveis com LGPD: 1) Consentimento explícito para tratamento, 2) Minimização e finalidade específica, 3) Direito de acesso, correção e exclusão, 4) Portabilidade de dados, 5) Relatórios de conformidade, 6) DPO (Data Protection Officer) disponível.",
            },
          ],
        },
        {
          category: "Suporte Técnico",
          questions: [
            {
              question: "Como entro em contato com o suporte?",
              answer:
                "Oferecemos múltiplos canais de suporte: 1) Chat ao vivo (24/7), 2) Email: suporte@sistema.com, 3) Telefone: +244 XXX XXX XXX, 4) WhatsApp Business, 5) Central de ajuda online, 6) Vídeo-chamada para casos complexos, 7) Suporte remoto quando autorizado.",
            },
            {
              question: "Qual o horário de atendimento?",
              answer:
                "Nosso suporte funciona: Segunda a Sexta: 8h às 18h (horário de Angola), Sábados: 8h às 12h, Domingos: Emergências apenas, Chat online: 24/7 com IA, Suporte técnico especializado: Horário comercial, Emergências críticas: 24/7.",
            },
            {
              question: "Vocês oferecem treinamento?",
              answer:
                "Sim! Oferecemos treinamento completo: 1) Treinamento inicial gratuito (2h), 2) Sessões personalizadas por departamento, 3) Webinars mensais gratuitos, 4) Vídeo-aulas na plataforma, 5) Manual do usuário detalhado, 6) Certificação para administradores.",
            },
            {
              question: "Como solicito novas funcionalidades?",
              answer:
                "Valorizamos seu feedback: 1) Portal de sugestões online, 2) Votação da comunidade, 3) Roadmap público trimestral, 4) Desenvolvimento personalizado (sob consulta), 5) Beta testing para usuários interessados, 6) Feedback direto com equipe de produto.",
            },
          ],
        },
      ]

      setGuides(sampleGuides)
      setTutorials(sampleTutorials)
    } catch (error) {
      toast.error("Failed to load documentation.")
    } finally {
      setLoading(false)
    }
  }

  const filteredGuides = guides.filter((guide) => {
    const searchTermMatch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchTerm.toLowerCase())

    const categoryMatch = selectedCategory === "all" || guide.category === selectedCategory

    const roleMatch = selectedRole === "all" || guide.userRole.includes(selectedRole)

    const difficultyMatch = selectedDifficulty === "all" || guide.difficulty === selectedDifficulty

    return searchTermMatch && categoryMatch && roleMatch && difficultyMatch
  })

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
  }

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
  }

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide)
  }

  const closeGuide = () => {
    setSelectedGuide(null)
  }

  const openTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial)
  }

  const closeTutorial = () => {
    setActiveTutorial(null)
  }

  const markStepAsComplete = (tutorialId: string, stepId: string) => {
    setTutorials((prevTutorials) =>
      prevTutorials.map((tutorial) =>
        tutorial.id === tutorialId
          ? {
              ...tutorial,
              steps: tutorial.steps.map((step) => (step.id === stepId ? { ...step, completed: true } : step)),
            }
          : tutorial,
      ),
    )
  }

  const markTutorialAsComplete = (tutorialId: string) => {
    setTutorials((prevTutorials) =>
      prevTutorials.map((tutorial) =>
        tutorial.id === tutorialId
          ? {
              ...tutorial,
              completed: true,
            }
          : tutorial,
      ),
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Dialog open={selectedGuide !== null} onOpenChange={closeGuide}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGuide && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGuide.title}</DialogTitle>
                <DialogDescription>{selectedGuide.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Badge>{GUIDE_CATEGORIES[selectedGuide.category as keyof typeof GUIDE_CATEGORIES].name}</Badge>
                  <Badge variant="secondary">{selectedGuide.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground">
                    <Clock className="mr-1 inline-block h-4 w-4" />
                    {selectedGuide.duration}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <Eye className="mr-1 inline-block h-4 w-4" />
                    {selectedGuide.views}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <Star className="mr-1 inline-block h-4 w-4" />
                    {selectedGuide.rating}
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedGuide.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {selectedGuide.videoUrl && (
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={selectedGuide.videoUrl}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                {selectedGuide.screenshots.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedGuide.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot || "/placeholder.svg"}
                        alt={`Screenshot ${index + 1}`}
                        className="rounded-md"
                      />
                    ))}
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  {selectedGuide.content.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{selectedGuide.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedGuide.author}</span>
                  <span className="text-sm text-muted-foreground">Last Updated: {selectedGuide.lastUpdated}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={activeTutorial !== null} onOpenChange={closeTutorial}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {activeTutorial && (
            <>
              <DialogHeader>
                <DialogTitle>{activeTutorial.title}</DialogTitle>
                <DialogDescription>{activeTutorial.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeTutorial.steps.map((step, index) => (
                  <Accordion key={step.id} type="single" collapsible>
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger className="font-semibold">
                        {step.title}
                        {step.completed && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>{step.description}</p>
                        {step.target && <p>Target: {step.target}</p>}
                        <Button
                          onClick={() => markStepAsComplete(activeTutorial.id, step.id)}
                          disabled={step.completed}
                        >
                          Mark as Complete
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
                {!activeTutorial.completed && (
                  <Button onClick={() => markTutorialAsComplete(activeTutorial.id)}>Mark Tutorial as Complete</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Central de Documentação</h1>
        <Input type="search" placeholder="Pesquisar..." className="w-1/3" onChange={handleSearch} />
      </div>

      <Tabs defaultValue="guides" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="guides">Guias</TabsTrigger>
          <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
        </TabsList>
        <TabsContent value="guides" className="space-y-4">
          <div className="flex space-x-4">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {Object.entries(GUIDE_CATEGORIES).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Funções</SelectItem>
                {Object.entries(USER_ROLES).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Dificuldades</SelectItem>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <Progress value={50} className="w-full" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.length === 0 ? (
                <p>Nenhum guia encontrado.</p>
              ) : (
                filteredGuides.map((guide) => (
                  <Card key={guide.id} className="cursor-pointer" onClick={() => openGuide(guide)}>
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Badge>{GUIDE_CATEGORIES[guide.category as keyof typeof GUIDE_CATEGORIES].name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="mr-1 inline-block h-4 w-4" />
                          {guide.duration}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          <Eye className="mr-1 inline-block h-4 w-4" />
                          {guide.views}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="tutorials">
          {loading ? (
            <Progress value={50} className="w-full" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tutorials.length === 0 ? (
                <p>Nenhum tutorial encontrado.</p>
              ) : (
                tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="cursor-pointer" onClick={() => openTutorial(tutorial)}>
                    <CardHeader>
                      <CardTitle>{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Badge>{tutorial.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="mr-1 inline-block h-4 w-4" />
                          {tutorial.estimatedTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
