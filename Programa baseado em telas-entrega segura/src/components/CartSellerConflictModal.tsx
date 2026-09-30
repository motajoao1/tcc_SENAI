import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

export function CartSellerConflictModal() {
  const { state, actions } = useApp();

  return (
    <Modal
      open={state.pendingCartItem !== null}
      title="Produto de outro vendedor"
      onClose={actions.keepCurrentCart}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="secondary" fullWidth onClick={actions.keepCurrentCart}>
            Manter meu carrinho
          </Button>
          <Button fullWidth onClick={actions.replaceCartWithPendingItem}>
            Limpar carrinho e adicionar
          </Button>
        </div>
      }
    >
      <p>
        Seu carrinho já possui itens de outro vendedor. Para comprar este produto, finalize
        ou limpe o carrinho atual.
      </p>
    </Modal>
  );
}
