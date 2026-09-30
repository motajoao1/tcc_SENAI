import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../../components/layout/Shell';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { PRODUCT_CATEGORIES, WEEKDAY_LABELS } from '../../domain/types';
import type { Product, ProductCategory } from '../../domain/types';

type FormErrors = Partial<Record<string, string>>;

function validate(f: Partial<Product>): FormErrors {
  const e: FormErrors = {};
  if (!f.name?.trim()) e.name = 'Informe o nome do produto';
  if (!f.description?.trim()) e.description = 'Informe uma descrição';
  if (!f.price || f.price <= 0) e.price = 'Preço deve ser maior que zero';
  if (f.stock === undefined || f.stock < 0) e.stock = 'Estoque não pode ser negativo';
  if (!f.category) e.category = 'Selecione uma categoria';
  if (!f.img?.trim()) e.img = 'Informe a URL da imagem';
  return e;
}

export function SellerProductFormScreen() {
  const { state, actions } = useApp();
  const user = state.currentUser!;
  const productId = state.screenParams.productId as string | null;
  const existing = productId ? state.products.find((p) => p.id === productId) : null;

  const [form, setForm] = useState<Partial<Product>>(
    existing ?? {
      name: '',
      description: '',
      price: 0,
      cost: 0,
      stock: 0,
      category: 'Alimentos',
      img: '',
      type: 'product',
      available: true,
      sellerId: user.id,
      condominiumId: user.condominiumId,
      rating: 0,
      totalRatings: 0,
    }
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const set = (updates: Partial<Product>) => setForm((f) => ({ ...f, ...updates }));

  const handleSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      if (existing) {
        actions.updateProduct(existing.id, form);
      } else {
        actions.addProduct(form as Omit<Product, 'id'>);
      }
      actions.navigate('seller-products');
    }, 400);
  };

  return (
    <Shell>
      <PageHeader
        title={existing ? 'Editar Produto' : 'Novo Produto'}
        onBack={() => actions.navigate('seller-products')}
      />

      <ScrollArea className="pb-6">
        <div className="space-y-5 px-4 pt-4 md:px-6">
          {/* Image preview */}
          {form.img && (
            <img
              src={form.img}
              alt="Preview"
              className="h-44 w-full rounded-2xl object-cover bg-gray-100"
            />
          )}

          <div className="rounded-2xl bg-white p-4 shadow-sm space-y-4">
            <Field
              id="img"
              label="URL da imagem"
              placeholder="https://images.unsplash.com/..."
              value={form.img ?? ''}
              onChange={(v) => set({ img: v })}
              error={errors.img}
            />
            <Field
              id="name"
              label="Nome do produto *"
              placeholder="Ex: Bolo de cenoura"
              value={form.name ?? ''}
              onChange={(v) => set({ name: v })}
              error={errors.name}
            />
            <div>
              <label htmlFor="desc" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Descrição *
              </label>
              <textarea
                id="desc"
                rows={3}
                placeholder="Descreva seu produto..."
                value={form.description ?? ''}
                onChange={(e) => set({ description: e.target.value })}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Type toggle */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tipo
              </p>
              <div className="flex gap-2">
                {(['product', 'service'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set({ type: t })}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      form.type === t
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {t === 'product' ? 'Produto' : 'Serviço'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="cat" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Categoria *
              </label>
              <select
                id="cat"
                value={form.category}
                onChange={(e) => set({ category: e.target.value as ProductCategory })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 bg-white"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field
                id="price"
                label="Preço (R$) *"
                placeholder="0,00"
                type="number"
                value={form.price ? String(form.price) : ''}
                onChange={(v) => set({ price: parseFloat(v) || 0 })}
                error={errors.price}
              />
              <Field
                id="cost"
                label="Custo (R$)"
                placeholder="0,00"
                type="number"
                value={form.cost ? String(form.cost) : ''}
                onChange={(v) => set({ cost: parseFloat(v) || 0 })}
              />
              <Field
                id="stock"
                label="Estoque *"
                placeholder="0"
                type="number"
                value={form.stock !== undefined ? String(form.stock) : ''}
                onChange={(v) => set({ stock: parseInt(v) || 0 })}
                error={errors.stock}
              />
            </div>

            {/* Service fields */}
            {form.type === 'service' && (
              <div className="space-y-4 rounded-xl bg-blue-50 p-4">
                <p className="text-[13px] font-bold text-[#2563EB]">Configurações do serviço</p>
                <Field
                  id="duration"
                  label="Duração estimada"
                  placeholder="Ex: 2h"
                  value={form.duration ?? ''}
                  onChange={(v) => set({ duration: v })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    id="avStart"
                    label="Horário início"
                    type="time"
                    value={form.availableStart ?? ''}
                    onChange={(v) => set({ availableStart: v })}
                  />
                  <Field
                    id="avEnd"
                    label="Horário fim"
                    type="time"
                    value={form.availableEnd ?? ''}
                    onChange={(v) => set({ availableEnd: v })}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Dias disponíveis
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAY_LABELS.map((label, day) => {
                      const active = (form.availableDays ?? []).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const days = form.availableDays ?? [];
                            set({
                              availableDays: active
                                ? days.filter((d) => d !== day)
                                : [...days, day],
                            });
                          }}
                          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                            active
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-white text-gray-600 border border-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Available toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Disponível para compra</p>
                <p className="text-xs text-gray-500">Desative para pausar temporariamente</p>
              </div>
              <button
                type="button"
                onClick={() => set({ available: !form.available })}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.available ? 'bg-[#2563EB]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.available ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <Button fullWidth loading={saving} onClick={handleSave}>
            {existing ? 'Salvar alterações' : 'Publicar produto'}
          </Button>
          <Button fullWidth variant="ghost" onClick={() => actions.navigate('seller-products')}>
            Cancelar
          </Button>
        </div>
      </ScrollArea>
    </Shell>
  );
}
