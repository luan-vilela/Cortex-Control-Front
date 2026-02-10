'use client'

import React from 'react'

import Link from 'next/link'

import type { Person } from '@/modules/person/types/person.types'

interface ResponsiblesViewSectionProps {
  person: Person
}

export function ResponsiblesViewSection({ person }: ResponsiblesViewSectionProps) {
  const hasResponsibles = person.responsibles && person.responsibles.length > 0
  const hasDependents = person.dependents && person.dependents.length > 0

  if (!hasResponsibles && !hasDependents) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Responsáveis (quem é responsável por esta pessoa) */}
      {hasResponsibles && (
        <div className="bg-gh-card border-gh-border overflow-hidden rounded-md border">
          <div className="border-gh-border border-b px-6 py-4">
            <h3 className="text-gh-text text-lg font-semibold">Responsáveis</h3>
            <p className="text-gh-text-secondary mt-1 text-sm">
              Pessoas responsáveis por este contato
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {person.responsibles!.map((responsible) => (
                <div
                  key={responsible.id}
                  className="bg-gh-bg border-gh-border rounded-md border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-gh-text text-base font-medium">{responsible.name}</h4>
                        <Link
                          href={`/contatos/${responsible.id}`}
                          className="text-gh-text-secondary hover:text-gh-text text-sm transition-colors"
                        >
                          Ver detalhes →
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gh-text-secondary mb-1">Email</p>
                          <p className="text-gh-text">{responsible.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gh-text-secondary mb-1">Telefone</p>
                          <p className="text-gh-text">
                            {responsible.phones && responsible.phones.length > 0
                              ? responsible.phones[0].number
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dependentes (pessoas pelas quais esta pessoa é responsável) */}
      {hasDependents && (
        <div className="bg-gh-card border-gh-border overflow-hidden rounded-md border">
          <div className="border-gh-border border-b px-6 py-4">
            <h3 className="text-gh-text text-lg font-semibold">Responsável por</h3>
            <p className="text-gh-text-secondary mt-1 text-sm">
              Contatos pelos quais esta pessoa é responsável
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {person.dependents!.map((dependent) => (
                <div key={dependent.id} className="bg-gh-bg border-gh-border rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-gh-text text-base font-medium">{dependent.name}</h4>
                        <Link
                          href={`/contatos/${dependent.id}`}
                          className="text-gh-text-secondary hover:text-gh-text text-sm transition-colors"
                        >
                          Ver detalhes →
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gh-text-secondary mb-1">Email</p>
                          <p className="text-gh-text">{dependent.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gh-text-secondary mb-1">Telefone</p>
                          <p className="text-gh-text">
                            {dependent.phones && dependent.phones.length > 0
                              ? dependent.phones[0].number
                              : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
