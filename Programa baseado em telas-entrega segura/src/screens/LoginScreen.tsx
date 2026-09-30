import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, ScrollArea, Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { validateEmail } from '../utils/formatters';

export function LoginScreen() {
  const { actions } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const submit = () => {
    const next: Record<string, string> = {};
    if (!validateEmail(email)) next.email = 'Informe um e-mail válido';
    if (password.length < 6) next.password = 'A senha deve ter ao menos 6 caracteres';
    setErrors(next);
    setFormError('');
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    window.setTimeout(() => {
      const user = actions.login(email, password);
      if (!user) {
        setLoading(false);
        setFormError('Não encontramos uma conta com esse e-mail.');
      }
    }, 600);
  };

  return (
    <Shell>
      <PageHeader title="Entrar" onBack={() => actions.navigate('welcome')} />
      <ScrollArea className="px-4 py-5 md:px-6">
        <div className="mx-auto w-full max-w-[480px]">
          <form
            className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <Field
              id="login-email"
              label="E-mail"
              type="email"
              inputMode="email"
              placeholder="seu@email.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
              required
            />
            <Field
              id="login-password"
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={setPassword}
              error={errors.password}
              required
            />

            {formError && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {formError}
              </p>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Entrar
            </Button>

            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => actions.navigate('forgot-password')}
                className="min-h-[44px] rounded-lg px-3 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Esqueci minha senha
              </button>
              <button
                type="button"
                onClick={() => actions.navigate('register')}
                className="min-h-[44px] rounded-lg px-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Não tem conta? Criar conta
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-2xl bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">Contas de demonstração</p>
            <p className="mt-1 text-sm text-blue-900">
              Vendedora e compradora: <strong>maria@email.com</strong> / senha123
            </p>
            <p className="text-sm text-blue-900">
              Somente compras: <strong>joao@email.com</strong> / senha123
            </p>
          </div>
        </div>
      </ScrollArea>
    </Shell>
  );
}
