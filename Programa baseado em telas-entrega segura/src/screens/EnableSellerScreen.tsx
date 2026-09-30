import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { Field, SelectField, TextAreaField } from '../components/ui/Field';
import { CheckIcon, SparkIcon } from '../components/ui/Icons';
import { PRODUCT_CATEGORIES } from '../domain/types';
import type { ProductCategory } from '../domain/types';
import { maskPhone } from '../utils/formatters';

const BENEFITS = [
  'Sem mensalidade e sem comissão sobre as vendas.',
  'Seu anúncio aparece apenas para vizinhos do mesmo condomínio.',
  'Controle de estoque, pedidos e faturamento em um painel simples.',
  'Reputação construída com avaliações reais dos moradores.',
];

export function EnableSellerScreen() {
  const { state, actions } = useApp();
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = () => {
    const next: Record<string, string> = {};
    if (businessName.trim().length < 3) next.businessName = 'Informe o nome do seu negócio';
    if (!category) next.category = 'Selecione uma categoria';
    if (description.trim().length < 15)
      next.description = 'Descreva seu negócio com pelo menos 15 caracteres';
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'Telefone inválido';
    if (hours.trim().length < 5) next.hours = 'Informe seu horário de atendimento';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    window.setTimeout(() => {
      actions.enableSeller({
        businessName: businessName.trim(),
        category: category as ProductCategory,
        description: description.trim(),
        phone,
        hours: hours.trim(),
      });
      setLoading(false);
      setDone(true);
    }, 700);
  };

  if (done) {
    return (
      <Shell nav>
        <PageHeader title="Conta de vendedor" />
        <ScrollArea className="px-6 py-10">
          <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckIcon size={40} />
            </span>
            <h2 className="text-xl font-bold text-gray-900">Conta habilitada</h2>
            <p className="text-[15px] text-gray-600">
              {businessName} já pode anunciar para os moradores do seu condomínio. Cadastre
              seu primeiro produto no painel do vendedor.
            </p>
            <Button fullWidth onClick={() => actions.setActiveMode('seller')}>
              Ir para o painel do vendedor
            </Button>
            <Button variant="secondary" fullWidth onClick={() => actions.navigate('profile')}>
              Voltar ao perfil
            </Button>
          </div>
        </ScrollArea>
      </Shell>
    );
  }

  return (
    <Shell nav>
      <PageHeader
        title="Quero vender no Entrega Fácil"
        onBack={() => actions.navigate('profile')}
      />
      <ScrollArea className="px-4 py-4 md:px-6">
        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4">
          <section className="rounded-2xl bg-blue-50 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <SparkIcon size={18} />
              Por que habilitar sua conta
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-blue-900">
                  <span className="mt-0.5 shrink-0 text-blue-700" aria-hidden>
                    <CheckIcon size={14} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </section>

          <form
            className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <p className="text-sm text-gray-500">
              Morador: {state.currentUser?.name} · Bloco {state.currentUser?.block} · Apto{' '}
              {state.currentUser?.apartment}
            </p>
            <Field
              id="seller-business"
              label="Nome do negócio"
              placeholder="Doces da Maria"
              value={businessName}
              onChange={setBusinessName}
              error={errors.businessName}
              required
            />
            <SelectField
              id="seller-category"
              label="Categoria principal"
              placeholder="Selecione a categoria"
              value={category}
              onChange={setCategory}
              options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              error={errors.category}
              required
            />
            <TextAreaField
              id="seller-description"
              label="Descrição"
              placeholder="Conte o que você vende e o que torna seu produto especial"
              rows={4}
              value={description}
              onChange={setDescription}
              error={errors.description}
              required
            />
            <Field
              id="seller-phone"
              label="Telefone / WhatsApp"
              placeholder="(11) 99999-0000"
              inputMode="tel"
              value={phone}
              onChange={(v) => setPhone(maskPhone(v))}
              error={errors.phone}
              required
            />
            <Field
              id="seller-hours"
              label="Horário de atendimento"
              placeholder="Seg a Sáb, 9h às 18h"
              value={hours}
              onChange={setHours}
              error={errors.hours}
              required
            />
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Habilitar minha conta
            </Button>
          </form>
        </div>
      </ScrollArea>
    </Shell>
  );
}
