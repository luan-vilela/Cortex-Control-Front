'use client'

import { Alert } from '@/components/Alert'
import { PageHeader } from '@/components/patterns/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertsShowcase,
  ButtonsShowcase,
  CardsShowcase,
  DatePatternsShowcase,
  DialogsShowcase,
  InputsShowcase,
  PatternsShowcase,
  RadioGroupCardShowcase,
  SelectsShowcase,
  SwitchGroupCardShowcase,
  TextareasShowcase,
} from '@/modules/testes-dev/components'

export default function TestesDevPage() {
  const showcases = [
    { id: 'buttons', component: <ButtonsShowcase /> },
    { id: 'inputs', component: <InputsShowcase /> },
    { id: 'textareas', component: <TextareasShowcase /> },
    { id: 'selects', component: <SelectsShowcase /> },
    { id: 'radiogroupcards', component: <RadioGroupCardShowcase /> },
    { id: 'switchgroupcards', component: <SwitchGroupCardShowcase /> },
    { id: 'cards', component: <CardsShowcase /> },
    { id: 'dates', component: <DatePatternsShowcase /> },
    { id: 'patterns', component: <PatternsShowcase /> },
    { id: 'dialogs', component: <DialogsShowcase /> },
    { id: 'alerts', component: <AlertsShowcase /> },
  ]

  return (
    <div className="from-gh-bg via-gh-bg to-gh-hover min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <PageHeader
          title="Testes de Componentes"
          description="Showcase de todos os componentes e padrões disponíveis no projeto"
        />

        <Alert
          variant="info"
          title="Página de Desenvolvimento"
          message="Esta é uma página de desenvolvimento para visualizar e testar todos os componentes e padrões do projeto. Cada seção demonstra um grupo de componentes com exemplos de código."
          className="mt-6 mb-6"
        />

        {/* Índice */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Componentes Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {showcases.map((showcase) => (
                <a
                  key={showcase.id}
                  href={`#${showcase.id}`}
                  className="rounded px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950"
                >
                  #{showcase.id}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Showcases */}
        <div className="space-y-8">
          {showcases.map((showcase) => (
            <div key={showcase.id} id={showcase.id}>
              {showcase.component}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          <p>Página de desenvolvimento e testes de componentes</p>
          <p className="mt-1">
            Use esta página para visualizar, testar e documentar novos componentes
          </p>
        </div>
      </div>
    </div>
  )
}
