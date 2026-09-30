import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export function PrivacyPolicyText() {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-relaxed text-gray-700">
      <p>
        O Entrega Fácil é um marketplace fechado, disponível apenas para moradores de
        condomínios cadastrados. Esta política descreve, de forma resumida, como tratamos
        seus dados pessoais em conformidade com a Lei nº 13.709/2018 (LGPD).
      </p>

      <section>
        <h3 className="mb-1 text-base font-bold text-gray-900">Dados coletados</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Dados de identificação: nome completo, CPF e e-mail.</li>
          <li>Dados de moradia: condomínio, bloco ou torre e número do apartamento.</li>
          <li>Dados de uso: pedidos realizados, avaliações e mensagens de suporte.</li>
          <li>
            Dados de quem habilita a conta de vendedor: nome do negócio, categoria,
            descrição, telefone e horário de atendimento.
          </li>
        </ul>
      </section>

      <section>
        <h3 className="mb-1 text-base font-bold text-gray-900">Como usamos</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Validar que você realmente reside no condomínio informado.</li>
          <li>Exibir apenas anúncios e vendedores do seu condomínio.</li>
          <li>Intermediar pedidos, agendamentos de serviços e pagamentos.</li>
          <li>Calcular reputação de compradores e vendedores por meio de avaliações.</li>
          <li>Prevenir fraudes e garantir a segurança da comunidade.</li>
        </ul>
        <p className="mt-2">
          Não vendemos, alugamos ou compartilhamos seus dados com anunciantes externos. O
          vendedor visualiza apenas o nome, o bloco e o apartamento necessários para a
          entrega.
        </p>
      </section>

      <section>
        <h3 className="mb-1 text-base font-bold text-gray-900">Seus direitos</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Confirmar a existência de tratamento dos seus dados.</li>
          <li>Acessar, corrigir e atualizar seus dados a qualquer momento no Perfil.</li>
          <li>Solicitar a portabilidade ou a anonimização dos seus dados.</li>
          <li>Revogar o consentimento e solicitar a exclusão da conta.</li>
          <li>Opor-se a tratamentos que considerar irregulares.</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-1 text-base font-bold text-gray-900">Retenção</h3>
        <p>
          Ao solicitar a exclusão da conta, seus dados pessoais serão removidos ou
          anonimizados. Alguns registros poderão ser preservados quando necessários para
          obrigações legais, segurança e auditoria. Esta tela representa funcionalmente a
          política do protótipo e não declara conformidade jurídica completa.
        </p>
      </section>

      <section>
        <h3 className="mb-1 text-base font-bold text-gray-900">Contato</h3>
        <p>
          Encarregado de dados (DPO): privacidade@entregafacil.com.br. As solicitações
          serão tratadas pelo responsável pela privacidade conforme os procedimentos
          aplicáveis.
        </p>
      </section>
    </div>
  );
}

export function PrivacyScreen() {
  const { state, actions } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const loggedIn = state.currentUser !== null;

  return (
    <Shell nav={loggedIn}>
      <PageHeader
        title="Privacidade e LGPD"
        onBack={() => actions.navigate(loggedIn ? 'profile' : 'welcome')}
      />
      <ScrollArea className="px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-[720px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <PrivacyPolicyText />

          {requested ? (
            <p className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">
              Solicitação registrada. Ela será tratada pelo responsável pela privacidade
              conforme os procedimentos aplicáveis.
            </p>
          ) : (
            <Button
              variant="danger"
              fullWidth
              className="mt-6"
              onClick={() => setConfirmOpen(true)}
            >
              Solicitar exclusão de dados
            </Button>
          )}
        </div>
      </ScrollArea>

      <Modal
        open={confirmOpen}
        title="Solicitar exclusão de dados"
        onClose={() => setConfirmOpen(false)}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                setRequested(true);
                setConfirmOpen(false);
              }}
            >
              Confirmar solicitação
            </Button>
          </div>
        }
      >
        <p>
          Pedidos já concluídos poderão ser mantidos de forma anonimizada quando necessário
          para cumprimento de obrigações legais, segurança ou auditoria.
        </p>
      </Modal>
    </Shell>
  );
}
