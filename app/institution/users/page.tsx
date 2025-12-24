'use client';

import React from 'react';
import { InstitutionPageLayout } from '@/components/institution/InstitutionPageLayout';
import { PermissionGuard } from '@/components/institution/PermissionGuard';
import { UserControl } from '@/components/institution/UserControl';

export default function UserControlPage() {
  return (
    <PermissionGuard requiredTypes={['institution admin', 'institution owner']}>
      <InstitutionPageLayout title="Controle de Usuários" showBackButton>
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Controle de Usuários
              </h1>
              <p className="text-slate-500 mt-2">
                Gerencie quem tem acesso ao painel da sua instituição.
              </p>
            </div>

            <UserControl />
          </div>
        </div>
      </InstitutionPageLayout>
    </PermissionGuard>
  );
}
