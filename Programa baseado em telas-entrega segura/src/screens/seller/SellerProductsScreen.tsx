import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../../components/layout/Shell';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { BoxIcon, EditIcon, TrashIcon } from '../../components/ui/Icons';
import { formatCurrency } from '../../utils/formatters';
import type { Product } from '../../domain/types';

export function SellerProductsScreen() {
  const { state, actions } = useApp();
  const user = state.currentUser!;
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const myProducts = useMemo(
    () => state.products.filter((p) => p.sellerId === user.id),
    [state.products, user.id]
  );

  return (
    <Shell nav>
      <PageHeader
        title="Meus Produtos"
        right={
          <Button
            size="sm"
            onClick={() => actions.navigate('seller-product-form', { productId: null })}
          >
            + Novo
          </Button>
        }
      />

      <ScrollArea className="pb-24 lg:pb-6">
        <div className="space-y-3 px-4 pt-4 md:px-6">
          {myProducts.length === 0 ? (
            <EmptyState
              icon={<BoxIcon size={40} className="text-gray-300" />}
              title="Nenhum produto ainda"
              subtitle="Cadastre seu primeiro produto para que compradores possam encontrá-lo."
              actionLabel="Cadastrar produto"
              onAction={() => actions.navigate('seller-product-form', { productId: null })}
            />
          ) : (
            myProducts.map((p) => (
              <div key={p.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover bg-gray-100"
                  loading="lazy"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p className="truncate text-[14px] font-bold text-gray-900">{p.name}</p>
                    <p className="text-[13px] font-semibold text-[#2563EB]">
                      {formatCurrency(p.price)}
                    </p>
                    <p className="text-[12px] text-gray-500">
                      Estoque: {p.stock} · {p.category}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {/* Available toggle */}
                    <button
                      type="button"
                      onClick={() => actions.updateProduct(p.id, { available: !p.available })}
                      className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                        p.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.available ? 'Disponível' : 'Pausado'}
                    </button>
                    <div className="ml-auto flex gap-1">
                      <button
                        type="button"
                        aria-label="Editar produto"
                        onClick={() =>
                          actions.navigate('seller-product-form', { productId: p.id })
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 active:opacity-60"
                      >
                        <EditIcon size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir produto"
                        onClick={() => setDeleteTarget(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 active:opacity-60"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <Modal open={deleteTarget !== null} title="Excluir produto" onClose={() => setDeleteTarget(null)}>
        {deleteTarget && (
          <div>
            <p className="mb-5 text-[14px] text-gray-600">
              Tem certeza que deseja excluir{' '}
              <strong className="text-gray-900">{deleteTarget.name}</strong>? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  actions.deleteProduct(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Excluir
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Shell>
  );
}
