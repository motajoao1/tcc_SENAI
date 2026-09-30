import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { Field, SelectField } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { PrivacyPolicyText } from './PrivacyScreen';
import { maskCPF, validateCPF, validateEmail } from '../utils/formatters';

const TOTAL_STEPS = 3;

export function RegisterScreen() {
  const { state, actions } = useApp();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPolicy, setShowPolicy] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [condominiumId, setCondominiumId] = useState('');
  const [block, setBlock] = useState('');
  const [apartment, setApartment] = useState('');
  const [accepted, setAccepted] = useState(false);

  const validateStep = (target: number): boolean => {
    const next: Record<string, string> = {};
    if (target === 1) {
      if (name.trim().split(' ').filter(Boolean).length < 2)
        next.name = 'Informe nome e sobrenome';
      if (!validateCPF(cpf)) next.cpf = 'CPF inválido';
      if (!validateEmail(email)) next.email = 'Informe um e-mail válido';
      else if (state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
        next.email = 'Já existe uma conta com esse e-mail';
      if (password.length < 6) next.password = 'A senha deve ter ao menos 6 caracteres';
      if (password !== confirmPassword) next.confirmPassword = 'As senhas não coincidem';
    }
    if (target === 2) {
      if (!condominiumId) next.condominiumId = 'Selecione o seu condomínio';
      if (!block.trim()) next.block = 'Informe o bloco ou torre';
      if (!apartment.trim()) next.apartment = 'Informe o apartamento';
    }
    if (target === 3) {
      if (!accepted) next.accepted = 'É necessário aceitar os termos para continuar';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const submit = () => {
    if (!validateStep(3)) return;
    setLoading(true);
    window.setTimeout(() => {
      actions.register({ name, email, password, cpf, condominiumId, block, apartment });
    }, 400);
  };

  const back = () => {
    if (step === 1) actions.navigate('welcome');
    else setStep((s) => s - 1);
  };

  return (
    <Shell>
      <PageHeader
        title="Criar conta"
        subtitle={`Passo ${step} de ${TOTAL_STEPS}`}
        onBack={back}
      />

      <div className="shrink-0 bg-white px-4 pb-4 md:px-6">
        <div className="flex gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label="Progresso do cadastro">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-[#2563EB]' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>

      <ScrollArea className="px-4 py-5 md:px-6">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          {step === 1 && (
            <>
              <h2 className="text-base font-bold text-gray-900">Seus dados</h2>
              <Field id="reg-name" label="Nome completo" placeholder="Maria Silva" value={name} onChange={setName} error={errors.name} required />
              <Field id="reg-cpf" label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(v) => setCpf(maskCPF(v))} maxLength={14} inputMode="numeric" error={errors.cpf} required />
              <Field id="reg-email" label="E-mail" type="email" inputMode="email" placeholder="seu@email.com" value={email} onChange={setEmail} error={errors.email} required />
              <Field id="reg-password" label="Senha" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={setPassword} error={errors.password} required />
              <Field id="reg-confirm" label="Confirmar senha" type="password" placeholder="Repita a senha" value={confirmPassword} onChange={setConfirmPassword} error={errors.confirmPassword} required />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-base font-bold text-gray-900">Onde você mora</h2>
              <SelectField
                id="reg-condo"
                label="Condomínio"
                placeholder="Selecione o condomínio"
                value={condominiumId}
                onChange={setCondominiumId}
                options={state.condominiums.map((c) => ({ value: c.id, label: c.name }))}
                error={errors.condominiumId}
                required
              />
              <Field id="reg-block" label="Bloco / Torre" placeholder="Ex: A" value={block} onChange={setBlock} error={errors.block} required />
              <Field id="reg-apartment" label="Apartamento" placeholder="Ex: 201" value={apartment} onChange={setApartment} inputMode="numeric" error={errors.apartment} required />
              <p className="text-sm text-gray-500">
                Usamos essas informações para validar sua moradia e mostrar apenas anúncios
                do seu condomínio.
              </p>
              <p className="rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
                Para demonstração: Solar — Bloco A, apto 201; Parque Verde — Torre 1,
                apto 703.
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-base font-bold text-gray-900">Termos e privacidade</h2>
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                Seus dados são usados apenas para validar sua moradia, intermediar pedidos
                entre vizinhos e enviar notificações do aplicativo. Você pode solicitar a
                exclusão a qualquer momento.
              </div>
              <label htmlFor="reg-terms" className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <span>
                  Li e concordo com os Termos de Uso e a{' '}
                  <button
                    type="button"
                    onClick={() => setShowPolicy(true)}
                    className="font-semibold text-[#2563EB] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Política de Privacidade
                  </button>
                  .
                </span>
              </label>
              {errors.accepted && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {errors.accepted}
                </p>
              )}
            </>
          )}

          <div className="mt-2 flex gap-3">
            {step > 1 && (
              <Button variant="secondary" fullWidth onClick={() => setStep((s) => s - 1)}>
                Anterior
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button fullWidth onClick={goNext}>
                Próximo
              </Button>
            ) : (
              <Button fullWidth loading={loading} onClick={submit}>
                Criar conta
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>

      <Modal
        open={showPolicy}
        title="Política de Privacidade"
        onClose={() => setShowPolicy(false)}
      >
        <PrivacyPolicyText />
      </Modal>
    </Shell>
  );
}
