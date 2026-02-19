'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export default function TesteDevPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Teste Dev - Componente Tabs</h1>
        <p className="text-muted-foreground">Exemplos de uso do componente Tabs do shadcn/ui</p>
      </div>

      {/* Exemplo 1: Tabs Simples */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplo 1: Tabs Simples</CardTitle>
          <CardDescription>Navegação básica entre abas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Aba 1</TabsTrigger>
              <TabsTrigger value="tab2">Aba 2</TabsTrigger>
              <TabsTrigger value="tab3">Aba 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p className="text-muted-foreground text-sm">
                Conteúdo da primeira aba. Aqui você pode colocar qualquer componente.
              </p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p className="text-muted-foreground text-sm">
                Conteúdo da segunda aba. Este é um exemplo de navegação entre abas.
              </p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p className="text-muted-foreground text-sm">
                Conteúdo da terceira aba. Você pode ter quantas abas precisar.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exemplo 2: Tabs com Formulários */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplo 2: Tabs com Formulários</CardTitle>
          <CardDescription>Formulários diferentes em cada aba</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registro</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="********" />
              </div>
              <Button className="w-full">Entrar</Button>
            </TabsContent>
            <TabsContent value="register" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input id="email-register" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Senha</Label>
                <Input id="password-register" type="password" placeholder="********" />
              </div>
              <Button className="w-full">Criar Conta</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exemplo 3: Tabs com Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplo 3: Tabs com Conteúdo Complexo</CardTitle>
          <CardDescription>Abas contendo cards e outros componentes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 45.231,89</div>
                    <p className="text-muted-foreground text-xs">
                      +20.1% em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-muted-foreground text-xs">
                      +180.1% em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Informações Detalhadas</h3>
                  <p className="text-muted-foreground text-sm">
                    Esta aba contém informações mais detalhadas sobre o sistema. Você pode incluir
                    tabelas, gráficos, listas e qualquer outro componente necessário.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Item de configuração 1</li>
                    <li>✓ Item de configuração 2</li>
                    <li>✓ Item de configuração 3</li>
                    <li>✓ Item de configuração 4</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Nome do Projeto</Label>
                <Input id="project-name" placeholder="Meu Projeto" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Descreva seu projeto..." rows={4} />
              </div>
              <Button>Salvar Configurações</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Exemplo 4: Tabs Controladas */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplo 4: Tabs Controladas</CardTitle>
          <CardDescription>
            Tabs com controle de estado via prop value (para uso com estado do componente)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex-1">
                Informações
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex-1">
                Documentação
              </TabsTrigger>
              <TabsTrigger value="help" className="flex-1">
                Ajuda
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Informações do Sistema</h3>
                <p className="text-muted-foreground text-sm">
                  Versão: 1.0.0
                  <br />
                  Ambiente: Desenvolvimento
                  <br />
                  Última atualização: 11/02/2026
                </p>
              </div>
            </TabsContent>
            <TabsContent value="docs" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Documentação</h3>
                <p className="text-muted-foreground text-sm">
                  Consulte a documentação completa do componente Tabs em:
                  <br />
                  <a
                    href="https://ui.shadcn.com/docs/components/tabs"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ui.shadcn.com/docs/components/tabs
                  </a>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="help" className="mt-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Precisa de Ajuda?</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Entre em contato com o suporte técnico para mais informações.
                </p>
                <Button variant="outline">Abrir Suporte</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
