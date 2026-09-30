import { useApp } from '../context/AppContext';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';

export function WelcomeScreen() {
  const { actions } = useApp();

  return (
    <Shell bg="white">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-12">
        <img
          src="/assets/f7824.png"
          alt="Entrega Fácil"
          className="h-auto w-full max-w-[300px] rounded-xl object-contain"
        />

        <p className="max-w-[300px] text-center text-[15px] leading-relaxed text-gray-600">
          O marketplace exclusivo para moradores do seu condomínio
        </p>

        <div className="flex w-full max-w-[320px] flex-col gap-3">
          <Button fullWidth size="lg" onClick={() => actions.navigate('login')}>
            Entrar
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="secondary"
            onClick={() => actions.navigate('register')}
          >
            Criar conta
          </Button>
        </div>

        <p className="max-w-[300px] text-center text-sm text-gray-500">
          Compre de vizinhos e venda para eles. Uma única conta de morador para as duas
          coisas.
        </p>

        <button
          type="button"
          onClick={() => actions.navigate('privacy')}
          className="min-h-[44px] rounded-lg px-3 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Privacidade e LGPD
        </button>
      </div>
    </Shell>
  );
}
