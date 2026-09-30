import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { CheckIcon } from '../components/ui/Icons';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const STEPS = [
  'Conferindo os dados cadastrais',
  'Localizando o condomínio informado',
  'Validando bloco e apartamento',
];

export function ValidationScreen() {
  const { state, actions, condominium } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null);

  useEffect(() => {
    const timers: number[] = [];
    STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStepIndex(i + 1), (i + 1) * 650));
    });
    timers.push(
      window.setTimeout(() => {
        setResult(actions.validateCurrentResident());
        setDone(true);
      }, 2000)
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <Shell bg="white">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
        <img src="/assets/f7824.png" alt="Entrega Fácil" className="h-auto w-[180px]" />

        {done && result === 'approved' ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 animate-[pop_400ms_ease-out] items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckIcon size={40} />
            </span>
            <h1 className="text-xl font-bold text-gray-900">Validação aprovada</h1>
            <p className="max-w-[300px] text-[15px] text-gray-600">
              Seu cadastro foi confirmado como morador do{' '}
              {condominium?.name ?? 'condomínio informado'}.
            </p>
            <Button className="mt-2" onClick={() => actions.navigate('catalog')}>
              Entrar no Entrega Fácil
            </Button>
          </div>
        ) : done && result === 'rejected' ? (
          <div className="flex max-w-sm flex-col items-center gap-3 text-center">
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl font-bold text-red-700"
              aria-hidden
            >
              !
            </span>
            <h1 className="text-xl font-bold text-gray-900">Não encontramos este morador</h1>
            <p className="text-[15px] text-gray-600">
              Não foi possível confirmar este bloco e apartamento nos dados do condomínio.
            </p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <Button
                fullWidth
                onClick={actions.restartRegistration}
              >
                Revisar meus dados
              </Button>
              <Button variant="secondary" fullWidth onClick={actions.logout}>
                Voltar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-[340px] flex-col items-center gap-6 text-center">
            <LoadingSpinner size={40} className="text-[#2563EB]" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Validando seu condomínio</h1>
              <p className="mt-1 text-sm text-gray-500">Isso leva apenas alguns segundos.</p>
            </div>
            <ul className="flex w-full flex-col gap-3 text-left">
              {STEPS.map((label, i) => {
                const complete = i < stepIndex;
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        complete ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                      aria-hidden
                    >
                      {complete ? <CheckIcon size={14} /> : i + 1}
                    </span>
                    <span
                      className={`text-sm ${complete ? 'font-semibold text-gray-900' : 'text-gray-500'}`}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Shell>
  );
}
