import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { CheckIcon } from '../components/ui/Icons';
import { validateEmail } from '../utils/formatters';

export function ForgotPasswordScreen() {
  const { actions } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!validateEmail(email)) {
      setError('Informe um e-mail válido');
      return;
    }
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <Shell>
      <PageHeader title="Recuperar senha" onBack={() => actions.navigate('login')} />
      <ScrollArea className="px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-[480px] rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CheckIcon size={26} />
              </span>
              <p className="text-base font-bold text-gray-900">Link enviado</p>
              <p className="max-w-[320px] text-sm text-gray-600">
                Enviamos as instruções de redefinição de senha para {email}. Verifique também
                a caixa de spam.
              </p>
              <Button fullWidth onClick={() => actions.navigate('login')} className="mt-2">
                Voltar para o login
              </Button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <p className="text-sm text-gray-600">
                Informe o e-mail cadastrado e enviaremos um link para você criar uma nova
                senha.
              </p>
              <Field
                id="forgot-email"
                label="E-mail"
                type="email"
                inputMode="email"
                placeholder="seu@email.com"
                value={email}
                onChange={setEmail}
                error={error}
                required
              />
              <Button type="submit" fullWidth loading={loading}>
                Enviar link de recuperação
              </Button>
            </form>
          )}
        </div>
      </ScrollArea>
    </Shell>
  );
}
