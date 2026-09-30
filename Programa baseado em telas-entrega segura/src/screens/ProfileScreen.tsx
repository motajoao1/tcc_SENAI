import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Field } from '../components/ui/Field';
import { RatingStars } from '../components/ui/RatingStars';
import {
  ChevronRightIcon,
  LogoutIcon,
  ReceiptIcon,
  ShieldIcon,
  SparkIcon,
  UserIcon,
} from '../components/ui/Icons';
import { formatCurrency, getInitials, maskPhone } from '../utils/formatters';

export function ProfileScreen() {
  const { state, actions, condominium } = useApp();
  const user = state.currentUser!;
  const isSeller = user.role === 'both';
  const isBuyerMode = state.activeMode === 'buyer';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState('');
  const [editErrors, setEditErrors] = useState<{ name?: string }>({});
  const [editSaving, setEditSaving] = useState(false);

  const myOrders = state.orders.filter((o) => o.buyerId === user.id);
  const totalSpent = myOrders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + o.total, 0);

  const mySellerOrders = isSeller
    ? state.orders.filter((o) => o.sellerId === user.id)
    : [];
  const sellerRevenue = mySellerOrders
    .filter((o) => o.status === 'delivered' && o.paymentStatus === 'approved')
    .reduce((s, o) => s + o.total, 0);

  const handleEditSave = () => {
    const errs: { name?: string } = {};
    if (!editName.trim()) errs.name = 'Informe seu nome';
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    setEditSaving(true);
    setTimeout(() => {
      actions.updateCurrentUser({ name: editName.trim() });
      setEditSaving(false);
      setShowEditModal(false);
    }, 400);
  };

  return (
    <Shell nav>
      <PageHeader title="Meu Perfil" />

      <ScrollArea className="pb-24 lg:pb-6">
        <div className="space-y-4 px-4 pt-4 md:px-6">
          {/* Avatar + info */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[22px] font-bold text-[#2563EB]">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[17px] font-bold text-gray-900">{user.name}</p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-[#2563EB]">
                    {condominium?.name ?? 'Condomínio'}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                    Bloco {user.block}, Apto {user.apartment}
                  </span>
                  {isSeller && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                      Vendedor
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isSeller && user.totalRatings > 0 && (
              <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                <RatingStars value={user.rating} size={14} />
                <span className="text-[12px] text-gray-500">{user.totalRatings} avaliações</span>
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[20px] font-bold text-gray-900">{myOrders.length}</p>
                <p className="text-[11px] text-gray-500">Compras</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[16px] font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                <p className="text-[11px] text-gray-500">Total gasto</p>
              </div>
              {isSeller && (
                <>
                  <div className="rounded-xl bg-green-50 p-3 text-center">
                    <p className="text-[20px] font-bold text-gray-900">{mySellerOrders.length}</p>
                    <p className="text-[11px] text-gray-500">Vendas</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3 text-center">
                    <p className="text-[16px] font-bold text-gray-900">
                      {formatCurrency(sellerRevenue)}
                    </p>
                    <p className="text-[11px] text-gray-500">Receita</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="divide-y divide-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
            {[
              { label: 'Editar dados', icon: <UserIcon size={18} />, onClick: () => setShowEditModal(true) },
              { label: 'Meus pedidos', icon: <ReceiptIcon size={18} />, onClick: () => actions.navigate('orders') },
              { label: 'Regras do condomínio', icon: <ShieldIcon size={18} />, onClick: () => actions.navigate('condo-rules') },
              { label: 'Privacidade e LGPD', icon: <ShieldIcon size={18} />, onClick: () => actions.navigate('privacy') },
            ].map(({ label, icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-gray-400">{icon}</span>
                <span className="flex-1 text-[14px] font-medium text-gray-800">{label}</span>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </button>
            ))}

            {/* Seller toggle */}
            {isSeller && (
              <button
                type="button"
                onClick={() => actions.setActiveMode(isBuyerMode ? 'seller' : 'buyer')}
                className="flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-[#2563EB]">
                  <UserIcon size={18} />
                </span>
                <span className="flex-1 text-[14px] font-medium text-[#2563EB]">
                  {isBuyerMode ? 'Alternar para modo vendedor' : 'Alternar para modo comprador'}
                </span>
                <ChevronRightIcon size={16} className="text-[#2563EB]" />
              </button>
            )}

            {/* Enable seller */}
            {!isSeller && (
              <button
                type="button"
                onClick={() => actions.navigate('enable-seller')}
                className="flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="text-green-600">
                  <SparkIcon size={18} />
                </span>
                <span className="flex-1 text-[14px] font-medium text-green-700">
                  Quero vender no Entrega Fácil
                </span>
                <ChevronRightIcon size={16} className="text-green-600" />
              </button>
            )}

            {/* Delete account */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full min-h-[52px] items-center gap-3 px-4 py-3 text-left hover:bg-red-50 active:bg-red-100"
            >
              <span className="text-red-400">
                <ShieldIcon size={18} />
              </span>
              <span className="flex-1 text-[14px] font-medium text-red-600">
                Solicitar exclusão de conta
              </span>
              <ChevronRightIcon size={16} className="text-red-400" />
            </button>
          </div>

          <Button
            fullWidth
            variant="secondary"
            onClick={() => actions.logout()}
          >
            <LogoutIcon size={16} />
            Sair da conta
          </Button>
        </div>
      </ScrollArea>

      {/* Edit modal */}
      <Modal open={showEditModal} title="Editar dados" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <Field
              id="edit-name"
              label="Nome completo"
              value={editName}
              onChange={setEditName}
              error={editErrors.name}
            />
            <Field
              id="edit-phone"
              label="Telefone"
              placeholder="(11) 99999-0000"
              value={editPhone}
              onChange={(v) => setEditPhone(maskPhone(v))}
              type="tel"
            />
            <Button fullWidth loading={editSaving} onClick={handleEditSave}>
              Salvar
            </Button>
          </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={showDeleteModal} title="Excluir conta" onClose={() => setShowDeleteModal(false)}>
        <div className="mb-5 rounded-xl bg-red-50 p-4">
          <p className="text-[14px] font-semibold text-red-700">Atenção — ação irreversível</p>
          <p className="mt-1 text-[13px] text-red-600">
            Ao solicitar a exclusão da conta, seus dados pessoais serão removidos ou
            anonimizados. Alguns registros poderão ser preservados quando necessários para
            obrigações legais, segurança e auditoria.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              actions.deleteAccount();
              setShowDeleteModal(false);
            }}
          >
            Excluir minha conta
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </Shell>
  );
}
